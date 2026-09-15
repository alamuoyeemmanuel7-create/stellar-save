"use client";

import { useWallet } from "@/lib/wallet";
import { useGetGroup } from "@/lib/hooks";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import { JoinGroupForm } from "@/components/JoinGroupForm";
import { OnboardingOverlay } from "@/components/Onboarding";
import { useState, useEffect } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function GroupsPage() {
  const { isConnected, address } = useWallet();
  const [myGroups, setMyGroups] = useState<number[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("stellar-save-onboarded");
    if (!hasSeenOnboarding && isConnected) {
      setShowOnboarding(true);
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <section className="dashboard">
        <h1>My Groups</h1>
        <p className="subtitle">
          Connect your Freighter wallet to view and manage your groups.
        </p>
      </section>
    );
  }

  return (
    <section className="dashboard">
      {showOnboarding && (
        <OnboardingOverlay
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem("stellar-save-onboarded", "true");
          }}
        />
      )}

      <h1>My Groups</h1>
      <p className="subtitle">Create, join, and manage your rotating savings groups.</p>

      {myGroups.length > 0 ? (
        <div style={{ marginTop: "2rem" }}>
          <h2>Your Groups</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {myGroups.map((groupId) => (
              <Link
                key={groupId}
                href={`/groups/${groupId}`}
                style={{
                  padding: "1rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  textDecoration: "none",
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: "600" }}>Group #{groupId}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                  Click to view details
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "2rem", color: "var(--muted)" }}>
          You're not a member of any groups yet.
        </div>
      )}

      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <CreateGroupForm
          onSuccess={(groupId) => {
            setMyGroups((prev) => [...prev, groupId]);
          }}
        />

        <div>
          <h3>Join an Existing Group</h3>
          <JoinGroupForm
            onSuccess={() => {
              // Refresh groups list
            }}
          />
        </div>
      </div>
    </section>
  );
}
