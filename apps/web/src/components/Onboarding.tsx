"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";

export function OnboardingOverlay({ onComplete }: { onComplete: () => void }) {
  const { isConnected } = useWallet();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to StellarSave 👋",
      desc: "Trustless group savings on the blockchain.",
      cta: "Next",
    },
    {
      title: "Connect Your Wallet",
      desc: "Click 'Connect Freighter' in the top right. This is how you sign transactions safely.",
      cta: isConnected ? "Wallet Connected ✓" : "Connect Wallet",
      highlight: true,
    },
    {
      title: "Create or Join a Group",
      desc: "Start a new group (set members + contribution) or join an existing one via group ID.",
      cta: "Next",
    },
    {
      title: "Contribute Each Round",
      desc: "Every round, send your fixed contribution to the group pool. All on-chain, no middleman.",
      cta: "Next",
    },
    {
      title: "Get Paid Automatically",
      desc: "When all members contribute, the smart contract automatically pays the next recipient. Trustless ✨",
      cta: "Next",
    },
    {
      title: "You're Ready!",
      desc: "Go save with your community. No fees. No collector risk. Pure blockchain.",
      cta: "Start Saving",
      final: true,
    },
  ];

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  if (step >= steps.length) {
    onComplete();
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            height: "4px",
            background: "var(--border)",
            borderRadius: "2px",
            marginBottom: "1.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "var(--accent)",
              width: `${progress}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Content */}
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{current.title}</h2>
        <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
          {current.desc}
        </p>

        {/* Illustration placeholder */}
        <div
          style={{
            height: "150px",
            background: "var(--bg)",
            borderRadius: "8px",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "4rem",
          }}
        >
          {["👋", "🔗", "👥", "💰", "✨", "🎉"][step]}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (current.final) {
                onComplete();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={step === 1 && !isConnected}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: "var(--accent)",
              color: "#241b06",
              border: "none",
              borderRadius: "6px",
              cursor: step === 1 && !isConnected ? "not-allowed" : "pointer",
              fontWeight: "600",
              opacity: step === 1 && !isConnected ? 0.5 : 1,
            }}
          >
            {current.cta}
          </button>
          <button
            onClick={onComplete}
            style={{
              padding: "0.75rem 1.5rem",
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: "var(--muted)", fontSize: "0.8rem", textAlign: "center", marginTop: "1rem" }}>
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
