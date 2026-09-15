import "../styles/globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "StellarSave — Group Savings Dashboard",
  description: "Trustless Ajo/Esusu rotating savings on Stellar/Soroban",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
