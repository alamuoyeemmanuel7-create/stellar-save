//! StellarSave group-savings contract
//!
//! A trustless implementation of the Nigerian Ajo/Esusu rotating savings
//! model: a fixed group of members each contribute an equal amount every
//! round; the full pool pays out to one member per round, in join order,
//! until every member has received a payout once. The contract — not a
//! human collector — holds custody of funds between contribution and
//! payout.

#![no_std]

use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, Env, Map, Vec};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    NextGroupId,
    Group(u64),
    Contributed(u64, u32), // (group_id, round) -> Map<Address, bool>
}

#[contracttype]
#[derive(Clone)]
pub struct Group {
    pub creator: Address,
    pub token: Address,
    pub contribution_amount: i128,
    pub num_members: u32,
    pub members: Vec<Address>, // fixed payout order = join order
    pub current_round: u32,
    pub is_open: bool, // true while still accepting members
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum SavingsError {
    GroupNotFound = 1,
    GroupFull = 2,
    GroupNotFull = 3,
    GroupClosed = 4,
    AlreadyMember = 5,
    NotAMember = 6,
    AlreadyContributedThisRound = 7,
    NotAllContributed = 8,
    InvalidParams = 9,
    RotationComplete = 10,
}

#[contract]
pub struct GroupSavings;

#[contractimpl]
impl GroupSavings {
    /// Create a new rotating savings group. The creator becomes member #0.
    /// `num_members` fixes both the group size and the number of rounds
    /// in the rotation (one payout per member).
    pub fn create_group(
        env: Env,
        creator: Address,
        token: Address,
        contribution_amount: i128,
        num_members: u32,
    ) -> Result<u64, SavingsError> {
        creator.require_auth();

        if contribution_amount <= 0 || num_members < 2 {
            return Err(SavingsError::InvalidParams);
        }

        let group_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::NextGroupId)
            .unwrap_or(0u64);

        let mut members = Vec::new(&env);
        members.push_back(creator.clone());

        let group = Group {
            creator,
            token,
            contribution_amount,
            num_members,
            members,
            current_round: 0,
            is_open: true,
        };

        env.storage().persistent().set(&DataKey::Group(group_id), &group);
        env.storage()
            .instance()
            .set(&DataKey::NextGroupId, &(group_id + 1));

        Ok(group_id)
    }

    /// Join an open group. Fails once the group reaches `num_members`.
    pub fn join_group(env: Env, group_id: u64, member: Address) -> Result<(), SavingsError> {
        member.require_auth();

        let mut group = Self::load_group(&env, group_id)?;

        if !group.is_open {
            return Err(SavingsError::GroupClosed);
        }
        if group.members.contains(&member) {
            return Err(SavingsError::AlreadyMember);
        }
        if group.members.len() >= group.num_members {
            return Err(SavingsError::GroupFull);
        }

        group.members.push_back(member);
        if group.members.len() == group.num_members {
            group.is_open = false;
        }

        env.storage().persistent().set(&DataKey::Group(group_id), &group);
        Ok(())
    }

    /// Contribute this round's fixed amount into the group's on-chain pool.
    /// Only callable by a member, once per round, and only once the group
    /// has filled (rotation order is fixed once membership is complete).
    pub fn contribute(env: Env, group_id: u64, member: Address) -> Result<(), SavingsError> {
        member.require_auth();

        let group = Self::load_group(&env, group_id)?;

        if group.is_open {
            return Err(SavingsError::GroupNotFull);
        }
        if !group.members.contains(&member) {
            return Err(SavingsError::NotAMember);
        }
        if group.current_round >= group.num_members {
            return Err(SavingsError::RotationComplete);
        }

        let key = DataKey::Contributed(group_id, group.current_round);
        let mut contributed: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Map::new(&env));

        if contributed.get(member.clone()).unwrap_or(false) {
            return Err(SavingsError::AlreadyContributedThisRound);
        }

        // Contribution moves from member into contract-held custody.
        let token_client = soroban_sdk::token::Client::new(&env, &group.token);
        let contract_address = env.current_contract_address();
        token_client.transfer(&member, &contract_address, &group.contribution_amount);

        contributed.set(member, true);
        env.storage().persistent().set(&key, &contributed);

        Ok(())
    }

    /// Once every member has contributed for the current round, pay the
    /// full pool out to that round's recipient (join order) and advance
    /// to the next round.
    pub fn trigger_payout(env: Env, group_id: u64) -> Result<(), SavingsError> {
        let mut group = Self::load_group(&env, group_id)?;

        if group.is_open {
            return Err(SavingsError::GroupNotFull);
        }
        if group.current_round >= group.num_members {
            return Err(SavingsError::RotationComplete);
        }

        let key = DataKey::Contributed(group_id, group.current_round);
        let contributed: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Map::new(&env));

        for i in 0..group.members.len() {
            let m = group.members.get(i).unwrap();
            if !contributed.get(m).unwrap_or(false) {
                return Err(SavingsError::NotAllContributed);
            }
        }

        let recipient = group.members.get(group.current_round).unwrap();
        let pool_total = group.contribution_amount * (group.num_members as i128);

        let token_client = soroban_sdk::token::Client::new(&env, &group.token);
        let contract_address = env.current_contract_address();
        token_client.transfer(&contract_address, &recipient, &pool_total);

        group.current_round += 1;
        env.storage().persistent().set(&DataKey::Group(group_id), &group);

        Ok(())
    }

    /// Read a group's full state.
    pub fn get_group(env: Env, group_id: u64) -> Result<Group, SavingsError> {
        Self::load_group(&env, group_id)
    }

    /// Check whether a specific member has contributed in the current round.
    pub fn has_contributed(env: Env, group_id: u64, member: Address) -> Result<bool, SavingsError> {
        let group = Self::load_group(&env, group_id)?;
        let key = DataKey::Contributed(group_id, group.current_round);
        let contributed: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| Map::new(&env));
        Ok(contributed.get(member).unwrap_or(false))
    }

    fn load_group(env: &Env, group_id: u64) -> Result<Group, SavingsError> {
        env.storage()
            .persistent()
            .get(&DataKey::Group(group_id))
            .ok_or(SavingsError::GroupNotFound)
    }
}

mod test;
