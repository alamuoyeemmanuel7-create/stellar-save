# StellarSave Web App

A Next.js + TypeScript frontend for the StellarSave smart contract, enabling trustless Ajo/Esusu rotating savings groups on Stellar/Soroban.

## Features

- **Wallet Integration** — Freighter wallet connection for transaction signing
- **Group Management** — Create and join rotating savings groups
- **Real-time State** — Read group data and member contribution status from contract
- **Transaction Submission** — Submit contributions and trigger payouts with Soroban
- **Status Tracking** — Visual feedback for transaction states (pending, success, error)

## Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Freighter wallet extension (https://freighter.app)
- Local Stellar network or access to testnet/futurenet

### Installation

```bash
cd apps/web
npm install
```

### Environment Setup

Create a `.env.local` file in the web app directory:

```bash
# For local development with docker-compose stellar-quickstart
NEXT_PUBLIC_SOROBAN_RPC_URL=http://localhost:8000/soroban/rpc
NEXT_PUBLIC_NETWORK_PASSPHRASE="Standalone Network ; February 2017"

# For testnet
# NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
# NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Contract ID (set after deploying the smart contract)
NEXT_PUBLIC_CONTRACT_ID=CBQHLSNLFVFD7P7ZFDBQC45SVESJ76QM6LSC5YSLVMHTQRYOJBGPSD2

# Settlement token address (USDC or other asset)
NEXT_PUBLIC_SETTLEMENT_TOKEN=CBQHLSNLFVFD7P7ZFDBQC45SVESJ76QM6LSC5YSLVMHTQRYOJBGPSD2
```

### Running Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Architecture

### Core Modules

- **`lib/wallet.tsx`** — Freighter wallet context provider
  - Manages wallet connection, disconnection, and transaction signing
  - Provides `useWallet()` hook for components

- **`lib/contract.ts`** — Soroban contract interface
  - Builds and simulates contract invocations
  - Submits signed transactions
  - Read-only contract calls

- **`lib/hooks.ts`** — Custom hooks for contract interactions
  - `useGetGroup(groupId)` — Fetch group state
  - `useHasContributed(groupId, member)` — Check contribution status
  - `useContribute(groupId)` — Submit contribution
  - `useTriggerPayout(groupId)` — Trigger payout

- **`lib/groupContext.tsx`** — Global group state management
  - Manages active groups and selected group
  - Provides `useGroups()` hook

### Components

- **`WalletConnect`** — Header button for wallet connection/disconnection
- **`CreateGroupForm`** — Form to create a new rotating savings group
- **`JoinGroupForm`** — Form to join an existing group

### Pages

- **`/`** — Redirects to `/groups`
- **`/groups`** — My groups dashboard; create/join groups
- **`/groups/[id]`** — View and manage a specific group

## Transaction Flow

1. User connects Freighter wallet
2. User creates a group or joins an existing one
3. Contract stores group state on-chain
4. User submits a contribution:
   - Frontend builds contract invocation XDR
   - Simulates transaction to get fees and auth
   - Sends XDR to Freighter for signing
   - Submits signed transaction to Soroban RPC
   - Polls for confirmation
5. Once all members contribute, triggers payout
6. Contract transfers pooled funds to recipient

## Limitations & TODOs

- **Group queries** — Currently limited to single group reads. A group discovery endpoint would enable browsing all available groups.
- **Member contribution tracking** — `has_contributed` is queried per-member; batch queries would improve performance.
- **XDR parsing** — Contract result XDR is not yet fully decoded; returning group ID requires better result parsing.
- **Error messages** — Contract errors should be more descriptive and user-friendly.
- **Retry logic** — Transactions that timeout or fail could have automatic retry.
- **Persistence** — Group list is not persisted; refreshing the page clears state.

## Development

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

## Browser Support

- Chrome/Edge (latest) — Full support
- Firefox (latest) — Full support
- Safari (latest) — Full support

**Note:** Freighter is required; the wallet extension is not available on mobile browsers.

## Deployment

### Vercel (recommended)

1. Push code to GitHub
2. Import repo in Vercel
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -f docker/Dockerfile.web -t stellar-save-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SOROBAN_RPC_URL=... \
  -e NEXT_PUBLIC_CONTRACT_ID=... \
  stellar-save-web
```

## Security Considerations

- **Private Keys:** Never expose private keys in environment variables; Freighter handles signing securely.
- **Contract ID:** Verify the contract ID before deployment; a wrong ID could send funds to incorrect address.
- **Token Address:** Verify settlement token address to avoid sending to wrong asset.
- **HTTPS:** Always use HTTPS in production to prevent man-in-the-middle attacks on wallet communication.

## Resources

- [Stellar SDK Docs](https://developers.stellar.org/docs/build/smart-contracts)
- [Soroban RPC](https://developers.stellar.org/docs/build/smart-contracts/testing/rpc)
- [Freighter API](https://github.com/stellar/freighter)
- [Next.js Docs](https://nextjs.org/docs)
