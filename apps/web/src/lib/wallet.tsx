"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";

declare global {
  interface Window {
    freighter?: {
      getPublicKey?: () => Promise<string>;
      signTransaction?: (xdr: string, options: { network: string }) => Promise<string>;
    };
  }
}

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Freighter is installed and user is already connected
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        if (typeof window !== "undefined" && window.freighter) {
          const pubkey = await window.freighter.getPublicKey?.();
          if (pubkey) {
            setAddress(pubkey);
            setIsConnected(true);
          }
        }
      } catch (err) {
        console.log("Freighter not available or no existing connection");
      }
    };

    checkFreighter();
  }, []);

  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window === "undefined" || !window.freighter) {
        throw new Error(
          "Freighter wallet not detected. Install it: https://freighter.app"
        );
      }

      const pubkey = await window.freighter.getPublicKey?.();
      if (!pubkey) {
        throw new Error("Failed to get public key from Freighter");
      }

      setAddress(pubkey);
      setIsConnected(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
  };

  const signTransaction = async (xdr: string): Promise<string> => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      if (!window.freighter || !window.freighter.signTransaction) {
        throw new Error("Freighter not available");
      }

      const signedXdr = await window.freighter.signTransaction(xdr, {
        network: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Standalone Network ; February 2017",
      });
      return signedXdr;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign transaction";
      throw new Error(message);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isLoading,
        error,
        connect,
        disconnect,
        signTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
