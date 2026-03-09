import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import WalletProviderWrapper from "@/components/providers/WalletProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OP_NET Predict | Bitcoin L1 Prediction Markets",
  description: "Trade binary prediction markets on Bitcoin L1 using OP_NET.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProviderWrapper>
          <Navbar />
          <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            {children}
          </main>
        </WalletProviderWrapper>
      </body>
    </html>
  );
}
