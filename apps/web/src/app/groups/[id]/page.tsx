"use client";

import { useWallet } from "@/lib/wallet";
import { useGetGroup, useContribute, useTriggerPayout } from "@/lib/hooks";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const dynamic = "force-dynamic";

type Member = {
  address: string;
  contributed: boolean;
};

export default function GroupDetailPage() {
  const { isConnected, address } = useWallet();
  const params = useParams();
  const groupId = parseInt(String(params.id), 10);

  const { group, loading: groupLoading, error: groupError, fetch: fetchGroup } = useGetGroup(
    groupId
  );
  const { contribute, loading: contributeLoading, error: contributeError } = useContribute(
    groupId
  );
  const { triggerPayout, loading: payoutLoading, error: payoutError } = useTriggerPayout(
    groupId
  );

  const [members, setMembers] = useState<Member[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      fetchGroup();
    }
  }, [isConnected, groupId, fetchGroup]);

  useEffect(() => {
    if (group?.members) {
      const memberList: Member[] = group.members.map((addr) => ({
        address: addr,
        contributed: false,
      }));
      setMembers(memberList);
    }
  }, [group]);

  if (!isConnected) {
    return (
      <section className="dashboard">
        <Link href="/groups" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Groups
        </Link>
        <h1>Connect wallet to view group</h1>
      </section>
    );
  }

  if (groupError) {
    return (
      <section className="dashboard">
        <Link href="/groups" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Groups
        </Link>
        <h1>Error loading group</h1>
        <p style={{ color: "var(--pending)" }}>{groupError}</p>
      </section>
    );
  }

  if (groupLoading || !group) {
    return (
      <section className="dashboard">
        <Link href="/groups" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Back to Groups
        </Link>
        <h1>Loading group {groupId}...</h1>
      </section>
    );
  }

  const contributionAmount = Number(group.contribution_amount || 0);
  const pool = contributionAmount * (members.length || 0);
  const allContributed = members.every((m) => m.contributed);
  const currentRound = group.current_round || 0;
  const numMembers = group.num_members || 1;
  const currentRecipient = members[currentRound % members.length];

  async function handleContribute() {
    setStatus("Submitting contribution...");
    try {
      await contribute();
      setStatus("Contribution submitted! Waiting for confirmation...");
      setTimeout(() => fetchGroup(), 2000);
    } catch (err) {
      setStatus(`Contribution failed: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  async function handleTriggerPayout() {
    setStatus("Triggering payout...");
    try {
      await triggerPayout();
      setStatus("Payout triggered! Waiting for confirmation...");
      setTimeout(() => fetchGroup(), 2000);
    } catch (err) {
      setStatus(`Payout failed: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  const isCurrentRecipient = address && currentRecipient && currentRecipient.address === address;

  return (
    <section className="dashboard">
      <Link href="/groups" style={{ color: "var(--accent)", textDecoration: "none" }}>
        ← Back to Groups
      </Link>

      <h1>Group #{groupId}</h1>
      <p className="subtitle">
        {members.length} members · {contributionAmount} tokens per round · Round {currentRound + 1}{" "}
        of {numMembers}
      </p>

      {isCurrentRecipient && (
        <div
          style={{
            padding: "1rem",
            background: "rgba(79, 209, 138, 0.15)",
            border: "1px solid var(--good)",
            borderRadius: "6px",
            color: "var(--good)",
            marginBottom: "1.5rem",
            fontWeight: "600",
          }}
        >
          You are the recipient this round!
        </div>
      )}

      <table className="members-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Role This Round</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i}>
              <td>
                {m.address.slice(0, 6)}...{m.address.slice(-6)}
                {m.address === address && " (You)"}
              </td>
              <td>
                {i === currentRound % members.length ? (
                  <span style={{ color: "var(--accent)" }}>Recipient</span>
                ) : (
                  <span style={{ color: "var(--muted)" }}>Contributor</span>
                )}
              </td>
              <td>
                <button
                  className={m.contributed ? "status-pill status-yes" : "status-pill status-no"}
                  disabled
                >
                  {m.contributed ? "Contributed" : "Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dashboard-actions">
        <div className="total">Pool Total: {pool} tokens</div>
        <button
          className="primary-btn"
          onClick={handleContribute}
          disabled={contributeLoading || !isConnected || group.is_open}
        >
          {contributeLoading ? "Submitting..." : "Contribute"}
        </button>
        <button
          className="primary-btn"
          onClick={handleTriggerPayout}
          disabled={payoutLoading || !allContributed}
        >
          {payoutLoading ? "Processing..." : "Trigger Payout"}
        </button>
      </div>

      {group.is_open && (
        <p style={{ color: "var(--pending)", marginTop: "1rem" }}>
          ⏳ Group is still open for new members. Contributions not yet enabled.
        </p>
      )}

      {(status || contributeError || payoutError) && (
        <p className="status-line">{status || contributeError || payoutError}</p>
      )}
    </section>
  );
}
