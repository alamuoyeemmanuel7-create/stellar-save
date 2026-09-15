"use client";

import { ReactNode } from "react";
import { WalletProvider } from "@/lib/wallet";
import { GroupProvider } from "@/lib/groupContext";
import { NotificationsProvider } from "@/lib/notifications";
import { WalletConnect } from "@/components/WalletConnect";
import { ToastContainer } from "@/components/Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NotificationsProvider>
      <WalletProvider>
        <GroupProvider>
          <ToastContainer />
          <header className="site-header">
            <div className="brand">StellarSave</div>
            <nav>
              <a href="/">My Groups</a>
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <WalletConnect />
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            Built on Stellar/Soroban · SCF Open Track submission
          </footer>
        </GroupProvider>
      </WalletProvider>
    </NotificationsProvider>
  );
}
