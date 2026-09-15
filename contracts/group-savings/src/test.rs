#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{token, Env};

fn create_token_contract<'a>(
    env: &Env,
    admin: &Address,
) -> (Address, token::StellarAssetClient<'a>, token::Client<'a>) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    let address = sac.address();
    (
        address.clone(),
        token::StellarAssetClient::new(env, &address),
        token::Client::new(env, &address),
    )
}

fn setup_full_group(
    env: &Env,
) -> (
    u64,
    GroupSavingsClient<'static>,
    Vec<Address>,
    token::Client<'static>,
) {
    let admin = Address::generate(env);
    let (token_addr, token_admin, token_client) = create_token_contract(env, &admin);

    let contract_id = env.register(GroupSavings, ());
    let client = GroupSavingsClient::new(env, &contract_id);

    let creator = Address::generate(env);
    token_admin.mint(&creator, &10_000);

    let group_id = client.create_group(&creator, &token_addr, &1_000, &3);

    let m2 = Address::generate(env);
    let m3 = Address::generate(env);
    token_admin.mint(&m2, &10_000);
    token_admin.mint(&m3, &10_000);

    client.join_group(&group_id, &m2);
    client.join_group(&group_id, &m3);

    let members = Vec::from_array(env, [creator, m2, m3]);
    (group_id, client, members, token_client)
}

#[test]
fn test_create_and_fill_group() {
    let env = Env::default();
    env.mock_all_auths();

    let (group_id, client, members, _) = setup_full_group(&env);

    let group = client.get_group(&group_id);
    assert_eq!(group.members.len(), 3);
    assert!(!group.is_open);
    assert_eq!(group.members.get(0).unwrap(), members.get(0).unwrap());
}

#[test]
fn test_join_fails_once_full() {
    let env = Env::default();
    env.mock_all_auths();

    let (group_id, client, _, _) = setup_full_group(&env);

    let latecomer = Address::generate(&env);
    let result = client.try_join_group(&group_id, &latecomer);
    assert!(result.is_err());
}

#[test]
fn test_full_rotation_payout_cycle() {
    let env = Env::default();
    env.mock_all_auths();

    let (group_id, client, members, token_client) = setup_full_group(&env);

    // Round 0: everyone contributes, member 0 (creator) gets the pool.
    for m in members.iter() {
        client.contribute(&group_id, &m);
    }
    client.trigger_payout(&group_id);

    let recipient0 = members.get(0).unwrap();
    assert_eq!(token_client.balance(&recipient0), 10_000 - 1_000 + 3_000);

    let group_after_round0 = client.get_group(&group_id);
    assert_eq!(group_after_round0.current_round, 1);

    // Round 1: everyone contributes again, member 1 gets the pool.
    for m in members.iter() {
        client.contribute(&group_id, &m);
    }
    client.trigger_payout(&group_id);

    let recipient1 = members.get(1).unwrap();
    assert_eq!(token_client.balance(&recipient1), 10_000 - 1_000 + 3_000);

    let group_after_round1 = client.get_group(&group_id);
    assert_eq!(group_after_round1.current_round, 2);
}

#[test]
fn test_payout_rejected_until_all_contribute() {
    let env = Env::default();
    env.mock_all_auths();

    let (group_id, client, members, _) = setup_full_group(&env);

    // Only 2 of 3 members contribute.
    client.contribute(&group_id, &members.get(0).unwrap());
    client.contribute(&group_id, &members.get(1).unwrap());

    let result = client.try_trigger_payout(&group_id);
    assert!(result.is_err());
}

#[test]
fn test_double_contribution_same_round_rejected() {
    let env = Env::default();
    env.mock_all_auths();

    let (group_id, client, members, _) = setup_full_group(&env);
    let m0 = members.get(0).unwrap();

    client.contribute(&group_id, &m0);
    let result = client.try_contribute(&group_id, &m0);
    assert!(result.is_err());
}

#[test]
fn test_non_member_cannot_contribute() {
    let env = Env::default();
    env.mock_all_auths();

    let (group_id, client, _, _) = setup_full_group(&env);
    let outsider = Address::generate(&env);

    let result = client.try_contribute(&group_id, &outsider);
    assert!(result.is_err());
}
