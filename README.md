# StellarSave — Trustless Ajo/Esusu Rotating Savings on Soroban

A Soroban smart contract that digitizes Nigeria's traditional rotating
savings groups (Ajo/Esusu/Adashe) — members contribute a fixed amount each
round, and the pooled sum pays out to one member per rotation, on a fixed,
publicly verifiable schedule. No collector holds the cash; the contract does.

Submitted to the Stellar Community Fund (SCF) Open Track.

## The problem, in numbers

- About **10% of Nigerian adults (~14 million people)** rely on informal
  savings groups as their *only* financial channel, and total Ajo
  participation is far higher since many banked Nigerians run one on the
  side (EFInA 2023 Access to Financial Services survey).
- **58% of Nigeria's GDP is informal**, and **70% of market traders are
  women** — the core Ajo demographic.
- The traditional model depends on a human collector holding the pot. That
  single point of failure is the system's most common failure mode: lost,
  "misremembered," or absconded contributions are a recurring, well
  documented source of loss for participants.
- Digitized versions of this model are already proving demand: one
  Nigerian platform alone has moved over ₦100 billion (~$70M) in group
  savings for 500,000+ customers — evidence the model digitizes well, just
  not yet trustlessly.

## What StellarSave does differently

Existing digital Ajo apps still centralize custody in a company server.
StellarSave puts the pooled funds and the payout order in a Soroban smart
contract instead — verifiable on-chain, no custodian, and portable across
any wallet that can sign Soroban transactions.

## Monorepo layout

```
stellar-save/
├── contracts/group-savings/   # Soroban smart contract (Rust)
├── apps/web/                  # Next.js group dashboard
├── docker/                    # Dockerfiles for contract + web build
├── .github/workflows/         # CI/CD: lint, test, build, contract deploy
├── scripts/                   # Local dev + deploy helper scripts
└── docker-compose.yml         # Full local stack (Stellar quickstart + web)
```

## Quick Start

```bash
# Copy environment template
cp .env.example .env

# Start full stack (Stellar network + web app)
docker compose up --build

# In another terminal: setup & deploy contract
./scripts/setup-local.sh
./scripts/deploy.sh local
```

Then open **http://localhost:3000** in your browser and connect your Freighter wallet.

Detailed setup guide: **[SETUP.md](./SETUP.md)**

## What's Built

### Smart Contract (`contracts/group-savings`)

✅ **Fully Implemented & Tested**

- `create_group()` — Start a new rotating group
- `join_group()` — Members join until group fills
- `contribute()` — Pay fixed amount each round
- `trigger_payout()` — Send pool to next recipient
- `get_group()` — Query group state
- `has_contributed()` — Check member contribution status

See: [`contracts/group-savings/src/lib.rs`](./contracts/group-savings/src/lib.rs)

### Web Dashboard (`apps/web`)

✅ **Phase 1: Wallet Integration & Contract Connection** (Just completed!)

**Features:**
- Connect/disconnect Freighter wallet
- Create rotating savings groups
- Join existing groups
- View group details and member list
- Submit contributions (sign & broadcast)
- Trigger payouts (when all members contribute)
- Real-time state updates from contract
- Toast notifications for user feedback
- Fully responsive mobile-friendly design
- Type-safe TypeScript + ESLint

**Docs:**
- Setup: [`apps/web/README.md`](./apps/web/README.md)
- API Reference: [`apps/web/API.md`](./apps/web/API.md)
- Implementation Details: [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md)

**Future Phases:**
- 🔲 Phase 2: Group discovery & marketplace
- 🔲 Phase 3: Reputation scoring
- 🔲 Phase 4: Missed contribution handling
- 🔲 Phase 5: Mobile app (React Native)

## Architecture

```
User's Freighter Wallet
    ↓ (signs transactions)
Next.js Dashboard
    ├─ Create/join groups
    ├─ Manage contributions
    └─ View group status
    ↓ (JSON-RPC calls)
Soroban RPC Endpoint
    ↓
Soroban Smart Contract
    ├─ Create groups
    ├─ Track contributions
    └─ Execute payouts
```

## Roadmap

| Phase | Milestone | Status |
|---|---|---|
| MVP | Wallet + contract integration | ✅ Complete |
| Testnet | Multi-group dashboard, discovery | 🔄 In progress |
| Mainnet | Audit, deploy, reputation system | 📋 Planned |

## Development

- Contracts: Rust + [Soroban SDK](https://developers.stellar.org/docs/build/smart-contracts/getting-started)
- Frontend: Next.js + TypeScript + plain CSS
- CI/CD: GitHub Actions (see `.github/workflows/ci.yml`)
- Containerized via Docker + Docker Compose

## License

MIT — see `LICENSE`.
