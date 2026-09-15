"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          background: "rgba(11, 14, 20, 0.95)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
        }}
      >
        <div style={{ fontSize: "1.5rem", fontWeight: "700", letterSpacing: "0.05em" }}>
          StellarSave
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#features" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Features
          </a>
          <a href="#how-it-works" style={{ color: "var(--muted)", textDecoration: "none" }}>
            How It Works
          </a>
          <a href="#pricing" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Pricing
          </a>
          <Link href="/groups" style={{ color: "var(--accent)", textDecoration: "none" }}>
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: "6rem 2rem",
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(224, 179, 79, 0.1) 0%, rgba(79, 209, 138, 0.05) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
              lineHeight: "1.2",
            }}
          >
            Trustless Savings Groups for Emerging Markets
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--muted)",
              marginBottom: "2rem",
              maxWidth: "700px",
              margin: "0 auto 2rem",
            }}
          >
            StellarSave digitizes Africa's $20B+ informal savings market. No middleman. No fees. Pure blockchain transparency.
          </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "3rem" }}>
            <Link
              href="/groups"
              style={{
                background: "var(--accent)",
                color: "#241b06",
                padding: "1rem 2rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              Start Saving Today
            </Link>
            <Link
              href="/demo"
              style={{
                border: "2px solid var(--accent)",
                color: "var(--accent)",
                padding: "0.875rem 2rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              See Interactive Demo
            </Link>
          </div>

          {/* Social Proof */}
          <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            <p>Backed by Stellar Community Fund | SGC 2024 Finalist | $14M+ Market Opportunity</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem" }}>
          The Problem
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "8px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--accent)" }}>◈</div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>$20B+ Market</h3>
            <p style={{ color: "var(--muted)", lineHeight: "1.6" }}>
              10% of Africans (100M+) rely solely on informal Ajo/Esusu savings groups. The largest platform moved ₦100B+ ($70M).
            </p>
          </div>
          <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "8px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--accent)" }}>◆</div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>One Point of Failure</h3>
            <p style={{ color: "var(--muted)", lineHeight: "1.6" }}>
              The collector holds all cash. Lost contributions, "misremembered" withdrawals, and absconded funds plague the system.
            </p>
          </div>
          <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "8px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--accent)" }}>◉</div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Custodian Trust</h3>
            <p style={{ color: "var(--muted)", lineHeight: "1.6" }}>
              Existing digital apps still centralize custody in company servers. Users can't verify funds are safe.
            </p>
          </div>
          <div style={{ background: "var(--surface)", padding: "2rem", borderRadius: "8px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--accent)" }}>★</div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Scale</h3>
            <p style={{ color: "var(--muted)", lineHeight: "1.6" }}>
              Traditional groups max out at 10 people. No way to create hyper-local, community-driven saving clubs.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        id="features"
        style={{
          padding: "4rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1rem" }}>
          The StellarSave Solution
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--muted)",
            marginBottom: "3rem",
            fontSize: "1.1rem",
          }}
        >
          Smart contracts that replace the middleman with math.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
          {[
            {
              icon: "◆",
              title: "No Middleman",
              desc: "Pooled funds live on-chain. Smart contract manages payouts. Zero human trust needed.",
            },
            {
              icon: "⚡",
              title: "Instant Payouts",
              desc: "Once all members contribute, payment is atomic. Recipient gets funds in seconds, not days.",
            },
            {
              icon: "◈",
              title: "Borderless",
              desc: "Works across continents. Send USDC globally. Peer-to-peer savings without geography limits.",
            },
            {
              icon: "∞",
              title: "Mobile First",
              desc: "Works on any device with a web browser. No app store needed. 2G-friendly.",
            },
            {
              icon: "◉",
              title: "Transparent",
              desc: "All transactions on Stellar blockchain. Members can audit group health anytime.",
            },
            {
              icon: "★",
              title: "Scalable",
              desc: "Create unlimited groups. Manage billions in savings with fixed smart contract code.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                padding: "2rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--accent)" }}>{feature.icon}</div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{feature.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        style={{
          padding: "4rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem" }}>
          How It Works
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          {[
            { step: "1", title: "Create Group", desc: "Set up: 5 members, $100 per round, 1 payout = $500" },
            { step: "2", title: "Members Join", desc: "Friends join via group ID, adding to payout queue" },
            { step: "3", title: "Members Contribute", desc: "Each round, everyone contributes $100 to the pool" },
            {
              step: "4",
              title: "Auto Payout",
              desc: "When all contribute, smart contract pays $500 to next recipient",
            },
            { step: "5", title: "Repeat", desc: "5 rounds later, everyone has been paid. Group complete." },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "2rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  background: "var(--accent)",
                  color: "#241b06",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "1.5rem",
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ color: "var(--muted)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        style={{
          padding: "4rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "3rem" }}>
          Simple Pricing
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              background: "var(--surface)",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>For Users</h3>
            <div style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              0%
            </div>
            <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
              No platform fees. No subscription. No hidden costs.
            </p>
            <ul style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.8" }}>
              <li>Create unlimited groups</li>
              <li>Contribute & withdraw freely</li>
              <li>Transparent on-chain transactions</li>
              <li>Blockchain security</li>
            </ul>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, rgba(224, 179, 79, 0.1) 0%, rgba(79, 209, 138, 0.05) 100%)",
              padding: "2rem",
              borderRadius: "8px",
              border: "2px solid var(--accent)",
            }}
          >
            <div style={{ background: "var(--accent)", color: "#241b06", padding: "0.5rem 1rem", borderRadius: "4px", display: "inline-block", fontSize: "0.8rem", fontWeight: "600", marginBottom: "1rem" }}>
              COMING SOON
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>For Businesses</h3>
            <div style={{ fontSize: "3rem", fontWeight: "700", marginBottom: "0.5rem" }}>
              Custom
            </div>
            <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
              White-label groups for your platform.
            </p>
            <ul style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.8" }}>
              <li>API access</li>
              <li>Custom branding</li>
              <li>Revenue share model</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          padding: "4rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>The Opportunity</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--accent)", marginBottom: "0.5rem" }}>
              $20B+
            </div>
            <p style={{ color: "var(--muted)" }}>Annual savings group volume in Africa alone</p>
          </div>
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--good)", marginBottom: "0.5rem" }}>
              100M+
            </div>
            <p style={{ color: "var(--muted)" }}>Active participants globally</p>
          </div>
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--accent)", marginBottom: "0.5rem" }}>
              70%
            </div>
            <p style={{ color: "var(--muted)" }}>Are women (untapped fintech demographic)</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "4rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Ready to Revolutionize Savings?</h2>
        <p style={{ color: "var(--muted)", marginBottom: "2rem", fontSize: "1.1rem" }}>
          Join thousands saving together on the blockchain.
        </p>
        <Link
          href="/groups"
          style={{
            background: "var(--accent)",
            color: "#241b06",
            padding: "1rem 2rem",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "1rem",
            display: "inline-block",
          }}
        >
          Launch App & Start Saving
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: "0.9rem",
        }}
      >
        <p>© 2024 StellarSave. Built on Stellar. MIT License.</p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "1rem" }}>
          <a href="mailto:hello@stellarsave.io" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Contact
          </a>
          <a href="/docs" style={{ color: "var(--muted)", textDecoration: "none" }}>
            Docs
          </a>
        </div>
      </footer>
    </div>
  );
}
