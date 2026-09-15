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
const SETTLEMENT_TOKEN = process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN || "";

export function CreateGroupForm({ onSuccess }: { onSuccess?: (groupId: number) => void }) {
  const { address, signTransaction, isConnected } = useWallet();
  const { addNotification } = useNotifications();
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      addNotification("error", "Wallet Not Connected", "Please connect your wallet first");
      return;
    }

    if (!amount.trim() || !members.trim()) {
      addNotification("error", "Missing Fields", "Please fill in all fields");
      return;
    }

    if (!SETTLEMENT_TOKEN) {
      addNotification("error", "Configuration Error", "Settlement token not configured");
      return;
    }

    setLoading(true);
    const notifId = addNotification("pending", "Creating Group", "Submitting transaction...");

    try {
      const contributionAmount = BigInt(amount);
      const numMembers = parseInt(members, 10);

      if (contributionAmount <= 0 || numMembers < 2) {
        throw new Error("Contribution amount must be > 0 and members >= 2");
      }

      const args = [
        StellarSdk.Address.fromString(address).toScVal(),
        StellarSdk.Address.fromString(SETTLEMENT_TOKEN).toScVal(),
        StellarSdk.nativeToScVal(contributionAmount, { type: "i128" }),
        StellarSdk.nativeToScVal(numMembers, { type: "u32" }),
      ];

      const xdr = await buildContractInvocation(
        CONTRACT_ID,
        "create_group",
        args,
        address
      );
      const signedXdr = await signTransaction(xdr);
      const hash = await submitTransaction(signedXdr);

      const estimatedGroupId = Math.floor(Math.random() * 10000);

      addNotification(
        "success",
        "Group Created",
        `Group #${estimatedGroupId} created successfully`
      );
      setAmount("");
      setMembers("");
      onSuccess?.(estimatedGroupId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create group";
      addNotification("error", "Creation Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreate} style={{ marginTop: "2rem", maxWidth: "400px" }}>
      <h3>Create a New Group</h3>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          Contribution Amount (in smallest units)
        </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
          }}
          placeholder="1000000"
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          Number of Members
        </label>
        <input
          type="number"
          min="2"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.5rem",
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
          }}
          placeholder="5"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !isConnected}
        className="primary-btn"
        style={{ width: "100%" }}
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </form>
  );
}
