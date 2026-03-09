'use client';

import React from 'react';
import { useWallet } from '@/components/providers/WalletProviderWrapper';

export default function Navbar() {
    const { walletAddress, connect, disconnect, connecting, balance } = useWallet();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-card-border px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
                    O
                </div>
                <span className="text-xl font-bold tracking-tight">OP_NET <span className="text-primary">Predict</span></span>
            </div>

            <div className="flex items-center gap-6">
                <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Markets</a>
                <a href="/profile" className="text-sm font-medium hover:text-primary transition-colors">Profile</a>

                {walletAddress ? (
                    <div className="flex items-center gap-3">
                        {balance && (
                            <span className="text-xs font-mono text-zinc-400">
                                {(balance.confirmed / 1e8).toFixed(4)} BTC
                            </span>
                        )}
                        <button
                            onClick={disconnect}
                            className="flex items-center gap-3 px-4 py-2 glass rounded-full border border-primary/20 hover:border-primary/50 transition-all"
                        >
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            <span className="text-xs font-mono text-zinc-400">
                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={connect}
                        disabled={connecting}
                        className="px-6 py-2 bg-primary hover:bg-primary/90 text-sm font-bold rounded-full transition-all animate-glow disabled:opacity-50"
                    >
                        {connecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                )}
            </div>
        </nav>
    );
}
