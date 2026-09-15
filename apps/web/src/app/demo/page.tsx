"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";

type DemoStep = "connect" | "create" | "join" | "contribute" | "payout" | "complete";

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>("connect");
  const [demoWallet, setDemoWallet] = useState<string | null>(null);
  const [demoGroup, setDemoGroup] = useState<{
    id: number;
    members: string[];
    contributed: string[];
    round: number;
  } | null>(null);

  // Simulated data
  const walletAddress = "GBQQ...SXYZ";
  const friends = ["Alice", "Bob", "Carol", "David"];

  const handleConnect = () => {
    setDemoWallet(walletAddress);
    setStep("create");
  };

  const handleCreateGroup = () => {
    setDemoGroup({
      id: 1,
      members: [walletAddress, "GBAA...ALICE", "GBBB...BOB", "GBCC...CAROL"],
      contributed: [],
      round: 1,
    });
    setStep("contribute");
  };

  const handleContribute = (member: string) => {
    if (demoGroup) {
      const newGroup = {
        ...demoGroup,
        contributed: [...demoGroup.contributed, member],
      };
      setDemoGroup(newGroup);

      if (newGroup.contributed.length === newGroup.members.length) {
        setTimeout(() => {
          setStep("payout");
        }, 800);
      }
    }
  };

  const handlePayout = () => {
    if (demoGroup) {
      setDemoGroup({
        ...demoGroup,
        round: demoGroup.round + 1,
        contributed: [],
      });
      setStep("complete");
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <h1 style={{ marginBottom: "0.5rem" }}>Interactive Demo</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          See how StellarSave works in 60 seconds. No wallet required.
        </p>

        {/* Step Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "3rem",
            position: "relative",
          }}
        >
          {["Connect", "Create", "Contribute", "Payout"].map((label, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    step === ["connect", "create", "contribute", "payout"][i]
                      ? "var(--accent)"
                      : ["connect", "create", "contribute", "payout"].indexOf(step) > i
                        ? "var(--good)"
                        : "var(--border)",
                  color: step === ["connect", "create", "contribute", "payout"][i] ? "#241b06" : "var(--text)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  margin: "0 auto 0.5rem",
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "2rem",
            minHeight: "400px",
          }}
        >
          {/* STEP 1: Connect Wallet */}
          {step === "connect" && (
            <div>
              <h2 style={{ marginBottom: "1rem" }}>Step 1: Connect Your Wallet</h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
                In the real app, you'd click "Connect Freighter" to sign in with your wallet. For this demo, we'll use a simulated wallet.
              </p>

              <div
                style={{
                  background: "var(--bg)",
                  padding: "1rem",
                  borderRadius: "6px",
                  marginBottom: "2rem",
                  border: "1px solid var(--border)",
                }}
              >
                <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Wallet Address:</p>
                <p style={{ fontFamily: "monospace", fontSize: "1rem", wordBreak: "break-all" }}>
                  {walletAddress}
                </p>
              </div>

              <button
                onClick={handleConnect}
                style={{
                  background: "var(--accent)",
                  color: "#241b06",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Continue with Wallet →
              </button>
            </div>
          )}

          {/* STEP 2: Create Group */}
          {step === "create" && (
            <div>
              <h2 style={{ marginBottom: "1rem" }}>Step 2: Create a Group</h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
                Set up a rotating savings group. Define the contribution amount, number of members, and payout schedule.
              </p>

              <div
                style={{
                  background: "var(--bg)",
                  padding: "1.5rem",
                  borderRadius: "6px",
                  marginBottom: "2rem",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    Group Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Tech Squad Savings"
                    disabled
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "var(--surface)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    Contribution per Round
                  </label>
                  <input
                    type="text"
                    defaultValue="$100 USDC"
                    disabled
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      background: "var(--surface)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    Members
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {["You", "Alice", "Bob", "Carol"].map((name, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.5rem",
                          background: "var(--surface)",
                          borderRadius: "4px",
                          fontSize: "0.9rem",
                        }}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ color: "var(--good)", marginBottom: "1rem" }}>✓ Group created successfully!</p>

              <button
                onClick={handleCreateGroup}
                style={{
                  background: "var(--accent)",
                  color: "#241b06",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Start Group →
              </button>
            </div>
          )}

          {/* STEP 3: Contribute */}
          {step === "contribute" && demoGroup && (
            <div>
              <h2 style={{ marginBottom: "1rem" }}>Step 3: Members Contribute</h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
                Each member sends their $100 to the smart contract. All funds are held on-chain until everyone contributes.
              </p>

              <div
                style={{
                  background: "var(--bg)",
                  padding: "1.5rem",
                  borderRadius: "6px",
                  marginBottom: "2rem",
                  border: "1px solid var(--border)",
                }}
              >
                <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1rem" }}>
                  Round {demoGroup.round} Contributions:
                </p>
                {demoGroup.members.map((member, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem",
                      background: "var(--surface)",
                      borderRadius: "4px",
                      marginBottom: "0.5rem",
                      border:
                        demoGroup.contributed.includes(member)
                          ? "1px solid var(--good)"
                          : "1px solid var(--border)",
                    }}
                  >
                    <span>{member === walletAddress ? "You" : friends[i - 1]}</span>
                    <span
                      style={{
                        color: demoGroup.contributed.includes(member) ? "var(--good)" : "var(--muted)",
                      }}
                    >
                      {demoGroup.contributed.includes(member) ? "✓ $100" : "⏳ Pending"}
                    </span>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    background: "var(--bg)",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
                    Pool Total:
                  </p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                    ${demoGroup.contributed.length * 100}
                  </p>
                </div>
              </div>

              {demoGroup.contributed.length < demoGroup.members.length ? (
                <button
                  onClick={() =>
                    handleContribute(demoGroup.members[demoGroup.contributed.length])
                  }
                  style={{
                    background: "var(--accent)",
                    color: "#241b06",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "6px",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Next Member Contributes →
                </button>
              ) : (
                <p style={{ color: "var(--good)", fontWeight: "600" }}>
                  ✓ All members contributed! Processing payout...
                </p>
              )}
            </div>
          )}

          {/* STEP 4: Payout */}
          {step === "payout" && demoGroup && (
            <div>
              <h2 style={{ marginBottom: "1rem" }}>Step 4: Smart Contract Payout</h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: "1.6" }}>
                Once all members contributed, the smart contract automatically pays the recipient. No collector needed. No fraud possible.
              </p>

              <div
                style={{
                  background: "var(--bg)",
                  padding: "2rem",
                  borderRadius: "6px",
                  marginBottom: "2rem",
                  border: "2px solid var(--good)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
                <h3 style={{ marginBottom: "0.5rem" }}>Payout Complete!</h3>
                <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                  Smart contract sent $400 to You
                </p>
                <div
                  style={{
                    background: "var(--surface)",
                    padding: "1rem",
                    borderRadius: "4px",
                    marginBottom: "1rem",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    wordBreak: "break-all",
                  }}
                >
                  Tx Hash: 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p...
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
                  Verifiable on Stellar blockchain forever
                </p>
              </div>

              <button
                onClick={handlePayout}
                style={{
                  background: "var(--accent)",
                  color: "#241b06",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next Round Starts →
              </button>
            </div>
          )}

          {/* STEP 5: Complete */}
          {step === "complete" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
              <h2 style={{ marginBottom: "1rem" }}>You've Seen It All!</h2>
              <p style={{ color: "var(--muted)", marginBottom: "2rem", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto 2rem" }}>
                That's how StellarSave works:
              </p>
              <ul
                style={{
                  textAlign: "left",
                  display: "inline-block",
                  color: "var(--muted)",
                  lineHeight: "1.8",
                  marginBottom: "2rem",
                }}
              >
                <li>✓ Connect wallet (Freighter)</li>
                <li>✓ Create or join a group</li>
                <li>✓ Contribute each round</li>
                <li>✓ Smart contract automatically pays recipients</li>
                <li>✓ All transactions on-chain, verifiable forever</li>
              </ul>

              <div
                style={{
                  background: "var(--bg)",
                  padding: "1.5rem",
                  borderRadius: "6px",
                  marginBottom: "2rem",
                  border: "1px solid var(--border)",
                }}
              >
                <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
                  Ready for the real thing?
                </p>
                <p style={{ fontWeight: "600" }}>Deploy testnet version coming soon.</p>
              </div>

              <a
                href="/landing"
                style={{
                  background: "var(--accent)",
                  color: "#241b06",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "600",
                  display: "inline-block",
                }}
              >
                Back to Home →
              </a>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div
          style={{
            marginTop: "2rem",
            background: "rgba(79, 209, 138, 0.1)",
            border: "1px solid var(--good)",
            padding: "1rem",
            borderRadius: "6px",
            fontSize: "0.9rem",
            color: "var(--good)",
          }}
        >
          <strong>💡 Note:</strong> This is a simulated demo. The real app connects to Stellar blockchain and Freighter wallet.
        </div>
      </div>
    </div>
  );
}
