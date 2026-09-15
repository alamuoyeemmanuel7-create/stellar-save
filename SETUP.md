# StellarSave Setup & Deployment Guide

This guide covers setting up and running StellarSave locally and deploying to production.

## Prerequisites

- **Node.js 18+** — https://nodejs.org/
- **Rust 1.70+** — https://rustup.rs/
- **Docker** — https://www.docker.com/
- **Freighter Wallet** — https://freighter.app (for local testing)

## Local Development (With Docker)

### Step 1: Start Stellar Network

```bash
docker pull stellar/quickstart:testing
docker run --rm -it -p 8000:8000 stellar/quickstart:testing --local --enable-soroban-rpc
```

Keep this running in the background. The Stellar network will be available at `http://localhost:8000`.

### Step 2: Deploy Smart Contract

In a new terminal:

```bash
cd contracts/group-savings

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Setup deployer identity and fund it (Friendbot)
soroban keys add deployer --network local 2>/dev/null || true
soroban keys fund deployer --network local

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/group_savings.wasm \
  --source deployer \
  --network local
```

**Save the contract ID** — you'll need it for the web app.

Example output:
```
Contract ID: CBQHLSNLFVFD7P7ZFDBQC45SVESJ76QM6LSC5YSLVMHTQRYOJBGPSD2
```

### Step 3: Run Web App

In another terminal:

```bash
cd apps/web

# Install dependencies
npm install

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SOROBAN_RPC_URL=http://localhost:8000/soroban/rpc
NEXT_PUBLIC_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
NEXT_PUBLIC_CONTRACT_ID=<YOUR_CONTRACT_ID_FROM_STEP_2>
NEXT_PUBLIC_SETTLEMENT_TOKEN=<YOUR_USDC_CONTRACT_ID>
EOF

# Run dev server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Step 4: Test with Freighter

1. Install Freighter wallet extension
2. Open the app and click "Connect Freighter"
3. Create a new account or import one
4. Fund your account via the local Friendbot (done automatically by setup script)
5. Create a group or join an existing one

## Using Docker Compose (Full Stack)

For a complete local setup with all services:

```bash
cp .env.example .env

docker compose up --build
```

This starts:
- Stellar Quickstart (blockchain)
- Web app (Next.js)
- Contracts service (for building/testing)

## Testnet Deployment

### 1. Get Testnet Account

```bash
# Create a new account
soroban keys generate testnet-deployer

# Get your public key
soroban keys address testnet-deployer
```

### 2. Fund Account via Friendbot

Visit https://friendbot.stellar.org/ and paste your public key.

### 3. Deploy Contract to Testnet

```bash
cd contracts/group-savings

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/group_savings.wasm \
  --source testnet-deployer \
  --network testnet
```

### 4. Configure Web App for Testnet

```bash
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_CONTRACT_ID=<YOUR_TESTNET_CONTRACT_ID>
NEXT_PUBLIC_SETTLEMENT_TOKEN=<USDC_TESTNET_ADDRESS>
EOF

cd apps/web
npm run dev
```

## Production Deployment

### Frontend (Vercel Recommended)

1. Push code to GitHub
2. Connect repo in Vercel dashboard
3. Set environment variables:
   ```
   NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
   NEXT_PUBLIC_NETWORK_PASSPHRASE="Public Global Stellar Network ; September 2015"
   NEXT_PUBLIC_CONTRACT_ID=<MAINNET_CONTRACT_ID>
   NEXT_PUBLIC_SETTLEMENT_TOKEN=<MAINNET_USDC_ADDRESS>
   ```
4. Deploy

### Smart Contract (Mainnet)

⚠️ **Before mainnet deployment:**
- [ ] Conduct security audit
- [ ] Test extensively on testnet
- [ ] Verify contract ID and token addresses
- [ ] Have deployment key/seed phrase backed up securely

```bash
cd contracts/group-savings

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/group_savings.wasm \
  --source mainnet-deployer \
  --network public
```

## Environment Variables Reference

### `.env.local` (Development)

```env
# Soroban RPC endpoint
NEXT_PUBLIC_SOROBAN_RPC_URL=http://localhost:8000/soroban/rpc

# Network identifier
NEXT_PUBLIC_NETWORK_PASSPHRASE="Standalone Network ; February 2017"

# Deployed contract ID
NEXT_PUBLIC_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Settlement token (USDC or other)
NEXT_PUBLIC_SETTLEMENT_TOKEN=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### `.env.example` (Reference)

Committed to repo — DO NOT include real values or secrets.

## Testing

### Contract Tests

```bash
cd contracts/group-savings
cargo test
```

### Web App Tests

```bash
cd apps/web
npm run test
```

## Troubleshooting

### "Wallet not connected"

Ensure Freighter is installed and you've clicked "Connect Freighter" in the app.

### "Contract not found"

Check that:
- The `NEXT_PUBLIC_CONTRACT_ID` is correct
- The contract has been deployed to the network
- The RPC URL is correct

### "Cannot connect to insecure RPC"

Ensure the RPC URL uses HTTPS in production. Local dev can use HTTP.

### Build Fails with "Cannot find name 'u64'"

Make sure all dependencies are installed:

```bash
cd apps/web
npm install
npm run typecheck
```

## Architecture

```
stellar-save/
├── contracts/
│   └── group-savings/       # Rust smart contract (Soroban)
├── apps/
│   └── web/                 # Next.js + TypeScript frontend
├── docker/
│   ├── Dockerfile.contracts
│   └── Dockerfile.web
├── docker-compose.yml       # Full stack setup
└── scripts/
    ├── setup-local.sh       # Local dev bootstrap
    └── deploy.sh            # Contract deploy script
```

## Key Features Implemented

✅ Wallet Connection (Freighter)
✅ Contract Integration (Create/Join/Contribute/Payout)
✅ Group Management (Multi-group support)
✅ Transaction Signing & Submission
✅ State Management (React Context)
✅ Error Handling & Notifications
✅ Responsive Design

## Roadmap

- [ ] Add "My Groups" listing from on-chain storage
- [ ] Implement contribution history tracking
- [ ] Add group discovery/search
- [ ] Enable missed-contribution handling
- [ ] Build reputation system
- [ ] Add mobile app (React Native)
- [ ] Security audit and mainnet deployment

## Support

For issues or questions:
- Check the [main README](./README.md)
- Review contract code in `contracts/group-savings/src/lib.rs`
- See web app docs in `apps/web/README.md`
- Open an issue on GitHub

## License

MIT — See [LICENSE](./LICENSE)
