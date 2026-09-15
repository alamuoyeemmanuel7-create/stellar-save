"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { useNotifications } from "@/lib/notifications";
import * as StellarSdk from "@stellar/stellar-sdk";
import {
  buildContractInvocation,
  submitTransaction,
} from "@/lib/contract";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export function JoinGroupForm({ onSuccess }: { onSuccess?: () => void }) {
  const { address, signTransaction, isConnected } = useWallet();
  const { addNotification } = useNotifications();
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      addNotification("error", "Wallet Not Connected", "Please connect your wallet first");
      return;
    }

    if (!groupId.trim()) {
      addNotification("error", "Missing Group ID", "Please enter a group ID");
      return;
    }

    setLoading(true);
    addNotification("pending", "Joining Group", "Submitting transaction...");

    try {
      const id = parseInt(groupId, 10);
      const args = [
        StellarSdk.nativeToScVal(id, { type: "u64" }),
        StellarSdk.Address.fromString(address).toScVal(),
      ];

      const xdr = await buildContractInvocation(
        CONTRACT_ID,
        "join_group",
        args,
        address
      );
      const signedXdr = await signTransaction(xdr);
      await submitTransaction(signedXdr);

      addNotification("success", "Joined Group", `Successfully joined group #${id}`);
      setGroupId("");
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to join group";
      addNotification("error", "Join Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoin} style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            Group ID
          </label>
          <input
            type="number"
            min="0"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
            placeholder="0"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isConnected}
          className="primary-btn"
        >
          {loading ? "Joining..." : "Join Group"}
        </button>
      </div>
    </form>
  );
}
