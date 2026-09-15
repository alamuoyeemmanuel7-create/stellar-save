# StellarSave Web App API Reference

This document describes the hooks, contexts, and utilities available for building features in the StellarSave web app.

## Wallet API

### `useWallet()`

Access wallet connection and transaction signing.

```typescript
import { useWallet } from "@/lib/wallet";

const {
  address,           // User's public key (null if not connected)
  isConnected,       // Boolean: wallet connected
  isLoading,         // Boolean: connection in progress
  error,             // Error message or null
  connect,           // () => Promise<void> — Connect wallet
  disconnect,        // () => void — Disconnect wallet
  signTransaction,   // (xdr: string) => Promise<string> — Sign & return XDR
} = useWallet();
```

**Example:**

```typescript
function MyComponent() {
  const { address, isConnected, connect } = useWallet();

  if (!isConnected) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  return <p>Connected: {address}</p>;
}
```

## Group Hooks

### `useGetGroup(groupId)`

Fetch group data from contract.

```typescript
const {
  group,             // GroupData | null
  loading,           // Boolean
  error,             // Error message or null
  fetch,             // () => Promise<void> — Refresh group data
} = useGetGroup(groupId);
```

**GroupData Structure:**

```typescript
type GroupData = {
  id: number;
  creator: string;
  token: string;
  contribution_amount: bigint;
  num_members: number;
  members: string[];
  current_round: number;
  is_open: boolean;
};
```

**Example:**

```typescript
function GroupView({ groupId }: { groupId: number }) {
  const { group, loading, error, fetch } = useGetGroup(groupId);

  useEffect(() => {
    fetch();
  }, [groupId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!group) return <p>Group not found</p>;

  return (
    <div>
      <h2>Group #{groupId}</h2>
      <p>{group.members.length} members</p>
      <p>Round {group.current_round + 1}</p>
    </div>
  );
}
```

### `useContribute(groupId)`

Submit a contribution transaction.

```typescript
const {
  contribute,        // () => Promise<void> — Submit contribution
  loading,           // Boolean
  error,             // Error message or null
  txHash,            // Transaction hash on success
} = useContribute(groupId);
```

**Example:**

```typescript
function ContributeButton({ groupId }: { groupId: number }) {
  const { contribute, loading, error } = useContribute(groupId);

  return (
    <>
      <button onClick={contribute} disabled={loading}>
        {loading ? "Submitting..." : "Contribute"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
```

### `useTriggerPayout(groupId)`

Trigger the payout to current recipient.

```typescript
const {
  triggerPayout,     // () => Promise<void> — Trigger payout
  loading,           // Boolean
  error,             // Error message or null
  txHash,            // Transaction hash on success
} = useTriggerPayout(groupId);
```

### `useHasContributed(groupId, member)`

Check if a member has contributed in current round.

```typescript
const {
  hasContributed,    // Boolean
  loading,           // Boolean
  error,             // Error message or null
  fetch,             // () => Promise<void> — Refresh status
} = useHasContributed(groupId, member);
```

## State Management

### `useGroups()`

Access global group state.

```typescript
import { useGroups } from "@/lib/groupContext";

const {
  groups,                    // Map<number, GroupData>
  selectedGroupId,           // number | null
  setSelectedGroupId,        // (id: number | null) => void
  addGroup,                  // (id: number, data: GroupData) => void
  updateGroup,               // (id: number, partial: Partial<GroupData>) => void
  getGroup,                  // (id: number) => GroupData | undefined
  isLoading,                 // Boolean
  setIsLoading,              // (loading: boolean) => void
} = useGroups();
```

**Example:**

```typescript
function GroupList() {
  const { groups, selectedGroupId, setSelectedGroupId } = useGroups();

  return (
    <ul>
      {Array.from(groups.values()).map((group) => (
        <li
          key={group.id}
          onClick={() => setSelectedGroupId(group.id)}
          style={{
            fontWeight: selectedGroupId === group.id ? "bold" : "normal",
          }}
        >
          Group #{group.id}
        </li>
      ))}
    </ul>
  );
}
```

## Notifications API

### `useNotifications()`

Show toast notifications.

```typescript
import { useNotifications } from "@/lib/notifications";

const {
  notifications,           // Notification[]
  addNotification,         // (type, title, message?) => string (notifId)
  removeNotification,      // (id: string) => void
  clearAll,                // () => void
} = useNotifications();
```

**Notification Type:**

```typescript
type NotificationType = "success" | "error" | "info" | "pending";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: number;
}
```

**Example:**

```typescript
function SubmitButton() {
  const { addNotification } = useNotifications();

  const handleSubmit = async () => {
    try {
      addNotification("pending", "Processing", "Please wait...");
      // ... do work
      addNotification("success", "Done", "Transaction confirmed");
    } catch (err) {
      addNotification("error", "Failed", err.message);
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

## Contract API

### `buildContractInvocation()`

Build a contract method invocation.

```typescript
import { buildContractInvocation } from "@/lib/contract";

const xdr = await buildContractInvocation(
  contractId,        // string
  method,            // string ("create_group", "join_group", etc.)
  args,              // ScVal[]
  signerPublicKey    // string
);
```

Returns: XDR transaction envelope (base64 string)

**Example:**

```typescript
const { address, signTransaction } = useWallet();
const { addNotification } = useNotifications();

const groupId = 1;
const args = [
  StellarSdk.nativeToScVal(groupId, { type: "u64" }),
  StellarSdk.Address.fromString(address).toScVal(),
];

try {
  const xdr = await buildContractInvocation(
    CONTRACT_ID,
    "contribute",
    args,
    address
  );
  const signedXdr = await signTransaction(xdr);
  const hash = await submitTransaction(signedXdr);
  addNotification("success", "Contributed", `Tx: ${hash}`);
} catch (err) {
  addNotification("error", "Failed", err.message);
}
```

### `submitTransaction()`

Submit a signed transaction.

```typescript
import { submitTransaction } from "@/lib/contract";

const txHash = await submitTransaction(signedXdr);
```

Returns: Transaction hash (string)

Polls for confirmation up to 30 times (1 second intervals).

### `callContractRead()`

Execute a read-only contract call.

```typescript
import { callContractRead } from "@/lib/contract";

const result = await callContractRead(
  contractId,        // string
  method,            // string ("get_group", "has_contributed", etc.)
  args               // ScVal[]
);
```

Returns: `ScVal` (parsed response depends on method)

## Component API

### `<WalletConnect />`

Display wallet connection button in header.

```typescript
import { WalletConnect } from "@/components/WalletConnect";

export default function Header() {
  return (
    <header>
      <h1>App Name</h1>
      <WalletConnect />
    </header>
  );
}
```

Shows:
- "Connect Freighter" button if disconnected
- Shortened address + disconnect button if connected
- Error message if connection failed

### `<ToastContainer />`

Display toast notifications.

Must be placed once in the layout:

```typescript
import { ToastContainer } from "@/components/Toast";

export default function Layout() {
  return (
    <>
      <ToastContainer />
      {/* Other content */}
    </>
  );
}
```

### `<CreateGroupForm />`

Form to create a new group.

```typescript
import { CreateGroupForm } from "@/components/CreateGroupForm";

<CreateGroupForm
  onSuccess={(groupId) => {
    console.log("Group created:", groupId);
  }}
/>
```

Props:
- `onSuccess?: (groupId: number) => void` — Called after successful creation

### `<JoinGroupForm />`

Form to join an existing group.

```typescript
import { JoinGroupForm } from "@/components/JoinGroupForm";

<JoinGroupForm
  onSuccess={() => {
    console.log("Group joined!");
  }}
/>
```

Props:
- `onSuccess?: () => void` — Called after successful join

## Patterns & Best Practices

### Pattern: Wallet Guard

Always check wallet connection before contract operations:

```typescript
function MyComponent() {
  const { isConnected, address } = useWallet();

  if (!isConnected) {
    return <p>Please connect your wallet</p>;
  }

  return <GroupForm />;
}
```

### Pattern: Loading & Error States

Combine hooks with proper UI feedback:

```typescript
function GroupDetail({ groupId }: { groupId: number }) {
  const { group, loading, error, fetch } = useGetGroup(groupId);

  useEffect(() => {
    fetch();
  }, [groupId, fetch]);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} retry={fetch} />;
  if (!group) return <NotFound />;

  return <GroupView group={group} />;
}
```

### Pattern: Transaction Feedback

Show user feedback throughout transaction lifecycle:

```typescript
const { contribute, loading, error } = useContribute(groupId);
const { addNotification } = useNotifications();

const handleContribute = async () => {
  const id = addNotification("pending", "Contributing", "Signing transaction...");

  try {
    await contribute();
    removeNotification(id);
    addNotification("success", "Contributed", "Your contribution was recorded");
  } catch (err) {
    removeNotification(id);
    addNotification("error", "Failed", err.message);
  }
};
```

### Pattern: Optimistic Updates

Update UI immediately, then sync with contract:

```typescript
function ContributeButton() {
  const { groups, updateGroup } = useGroups();
  const { contribute } = useContribute(groupId);

  const handleContribute = async () => {
    // Optimistic update
    updateGroup(groupId, {
      current_round: group.current_round + 1,
    });

    try {
      await contribute();
      // Fetch latest state from contract
      await fetchGroup();
    } catch (err) {
      // Revert optimistic update on error
      updateGroup(groupId, group);
    }
  };
}
```

## Environment Variables

Available in browser (prefixed with `NEXT_PUBLIC_`):

```env
NEXT_PUBLIC_SOROBAN_RPC_URL=http://localhost:8000/soroban/rpc
NEXT_PUBLIC_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
NEXT_PUBLIC_CONTRACT_ID=CBQH...
NEXT_PUBLIC_SETTLEMENT_TOKEN=CBQH...
```

Access in code:

```typescript
const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL;
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;
```

## Error Handling

Common errors and their causes:

| Error | Cause | Solution |
|-------|-------|----------|
| "Wallet not connected" | User hasn't connected | Show connect button |
| "Cannot find name 'u64'" | TypeScript import missing | Check imports |
| "Contract not found" | Wrong contract ID | Verify CONTRACT_ID |
| "Group not found" | Invalid group ID | Check group exists on-chain |
| "Transaction timeout" | Network slow or stuck | Retry or check network |
| "Insufficient balance" | User lacks funds | Fund account via Friendbot |

## Debugging

Enable debug logging:

```typescript
// In contract.ts or hooks.ts
console.log("Building invocation:", { contractId, method, args });
console.log("Simulation result:", simTx);
console.log("Signed XDR:", signedXdr);
console.log("Submitted tx hash:", hash);
```

Check transaction status:

```bash
curl "http://localhost:8000/soroban/rpc" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getTransaction","params":["YOUR_TX_HASH"]}'
```

## TypeScript Types

All major types are exported from their modules:

```typescript
import type { GroupData } from "@/lib/groupContext";
import type { Notification, NotificationType } from "@/lib/notifications";
import { useWallet, useNotifications, useGroups } from "@/lib/*";
```

## Support

For questions or issues:
- Check existing issues on GitHub
- Review examples in component source code
- Consult Stellar SDK docs
- Ask in Stellar Developers Discord
