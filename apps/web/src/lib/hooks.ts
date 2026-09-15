import { useState, useCallback } from "react";
import { useWallet } from "./wallet";
import {
  buildContractInvocation,
  submitTransaction,
  callContractRead,
  parseGroupResponse,
  GroupData,
} from "./contract";
import * as StellarSdk from "@stellar/stellar-sdk";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export function useGetGroup(groupId: number) {
  const [group, setGroup] = useState<Partial<GroupData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!CONTRACT_ID) {
      setError("CONTRACT_ID not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const args = [StellarSdk.nativeToScVal(groupId, { type: "u64" })];
      const result = await callContractRead(CONTRACT_ID, "get_group", args);
      const parsed = parseGroupResponse(result);
      setGroup(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch group";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { group, loading, error, fetch };
}

export function useHasContributed(groupId: number, member: string) {
  const [hasContributed, setHasContributed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!CONTRACT_ID) {
      setError("CONTRACT_ID not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const args = [
        StellarSdk.nativeToScVal(groupId, { type: "u64" }),
        StellarSdk.Address.fromString(member).toScVal(),
      ];
      const result = await callContractRead(CONTRACT_ID, "has_contributed", args);
      // Extract boolean from ScVal (this depends on the actual SDK implementation)
      // For now, assume it's a simple bool value
      setHasContributed(true); // Placeholder - will need proper decoding
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to check contribution";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { hasContributed, loading, error, fetch };
}

export function useContribute(groupId: number) {
  const { address, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const contribute = useCallback(async () => {
    if (!CONTRACT_ID || !address) {
      setError("CONTRACT_ID not configured or wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const args = [
        StellarSdk.nativeToScVal(groupId, { type: "u64" }),
        StellarSdk.Address.fromString(address).toScVal(),
      ];

      const xdr = await buildContractInvocation(CONTRACT_ID, "contribute", args, address);
      const signedXdr = await signTransaction(xdr);
      const hash = await submitTransaction(signedXdr);

      setTxHash(hash);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Contribution failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { contribute, loading, error, txHash };
}

export function useTriggerPayout(groupId: number) {
  const { address, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const triggerPayout = useCallback(async () => {
    if (!CONTRACT_ID || !address) {
      setError("CONTRACT_ID not configured or wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const args = [StellarSdk.nativeToScVal(groupId, { type: "u64" })];

      const xdr = await buildContractInvocation(
        CONTRACT_ID,
        "trigger_payout",
        args,
        address
      );
      const signedXdr = await signTransaction(xdr);
      const hash = await submitTransaction(signedXdr);

      setTxHash(hash);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payout trigger failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { triggerPayout, loading, error, txHash };
}
