import * as StellarSdk from "@stellar/stellar-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "http://localhost:8000/soroban/rpc";
const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Standalone Network ; February 2017";

let server: StellarSdk.SorobanRpc.Server | null = null;

function getServer() {
  if (!server) {
    server = new StellarSdk.SorobanRpc.Server(RPC_URL);
  }
  return server;
}

export type GroupData = {
  id: number;
  creator: string;
  token: string;
  contribution_amount: bigint;
  num_members: number;
  members: string[];
  current_round: number;
  is_open: boolean;
};

/**
 * Invoke a contract method and return the transaction envelope XDR.
 * This is a simplified version that builds a contract invoke operation.
 * The caller must sign this XDR with their wallet and then submit it.
 */
export async function buildContractInvocation(
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[],
  signerPublicKey: string
): Promise<string> {
  try {
    const sourceAccount = await getServer().getAccount(signerPublicKey);
    
    // Create a basic invoke contract operation
    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    // Use native Soroban operation builder
    const op: any = {
      type: "invokeHostFunction",
      functions: [
        {
          type: "invokeContract",
          contractId: contractId,
          method: method,
          args: args,
        },
      ],
    };

    const tx = txBuilder
      .addOperation(StellarSdk.Operation.invokeHostFunction(op))
      .setTimeout(30)
      .build();

    // Simulate to get fees and build envelope
    const simTx = await getServer().simulateTransaction(tx);
    
    if (!simTx || (simTx as any).error) {
      throw new Error(`Simulation failed`);
    }

    // Assemble with simulated data
    const assembled = StellarSdk.SorobanRpc.assembleTransaction(tx, simTx).build();
    return assembled.toEnvelope().toXDR("base64");
  } catch (err) {
    throw new Error(
      `Failed to build contract invocation: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Submit a signed transaction and wait for confirmation.
 */
export async function submitTransaction(signedXdr: string): Promise<string> {
  try {
    const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const response = await getServer().sendTransaction(tx);

    if (response.status === "PENDING") {
      // Poll for completion
      let attempts = 0;
      while (attempts < 30) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const result = await getServer().getTransaction(response.hash);

        if (result.status === "SUCCESS") {
          return response.hash;
        } else if (result.status === "FAILED") {
          throw new Error(`Transaction failed`);
        }
        attempts++;
      }
      throw new Error("Transaction timeout");
    } else if (response.status === "ERROR") {
      throw new Error(`Submission failed`);
    }

    return response.hash;
  } catch (err) {
    throw new Error(
      `Failed to submit transaction: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Call a contract read function (get_group, has_contributed, etc).
 * These are view-only and don't require signing.
 */
export async function callContractRead(
  contractId: string,
  method: string,
  args: StellarSdk.xdr.ScVal[]
): Promise<StellarSdk.xdr.ScVal> {
  try {
    const sourceAccount = await getServer().getAccount(contractId);
    
    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const op: any = {
      type: "invokeHostFunction",
      functions: [
        {
          type: "invokeContract",
          contractId: contractId,
          method: method,
          args: args,
        },
      ],
    };

    const tx = txBuilder
      .addOperation(StellarSdk.Operation.invokeHostFunction(op))
      .setTimeout(30)
      .build();

    const simTx = await getServer().simulateTransaction(tx);
    
    if (!simTx || (simTx as any).error) {
      throw new Error(`Read call failed`);
    }

    // Return the result value from simulation
    if ((simTx as any).result && (simTx as any).result.retval) {
      return (simTx as any).result.retval;
    }

    throw new Error("No result returned from contract call");
  } catch (err) {
    throw new Error(
      `Failed to call contract read: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Convert ScVal to readable group data.
 * This is a helper; actual conversion depends on contract struct encoding.
 */
export function parseGroupResponse(scval: StellarSdk.xdr.ScVal): Partial<GroupData> {
  // For now, return a placeholder. This needs to match the contract's Group struct encoding.
  // In a real implementation, you'd decode the XDR based on the contract's schema.
  return {
    current_round: 0,
    is_open: false,
    num_members: 0,
    members: [],
  };
}
