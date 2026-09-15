"use client";

import { useWallet } from "@/lib/wallet";
import { useNotifications } from "@/lib/notifications";
import { useState } from "react";

export function WalletConnect() {
  const { address, isConnected, isLoading, error, connect, disconnect } = useWallet();
  const { addNotification } = useNotifications();
  const [showError, setShowError] = useState(false);

  const handleConnect = async () => {
    setShowError(false);
    try {
      await connect();
      addNotification("success", "Wallet Connected", "Your Freighter wallet is now connected");
    } catch (err) {
      addNotification(
        "error",
        "Connection Failed",
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  };

  const handleDisconnect = () => {
    disconnect();
    addNotification("info", "Wallet Disconnected", "Your wallet has been disconnected");
  };

  if (isConnected && address) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
          {address.slice(0, 6)}...{address.slice(-6)}
        </span>
        <button
          onClick={handleDisconnect}
          style={{
            background: "transparent",
            border: "1px solid var(--muted)",
            color: "var(--muted)",
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isLoading}
        style={{
          background: "var(--accent)",
          color: "#241b06",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
          fontWeight: "600",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? "Connecting..." : "Connect Freighter"}
      </button>

      {error && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            background: "rgba(224, 138, 79, 0.15)",
            color: "var(--pending)",
            borderRadius: "4px",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
