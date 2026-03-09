'use client';

import React from 'react';
import { useWallet } from '@/components/providers/WalletProviderWrapper';
import { UserPosition, TradeHistory } from '@/types/market';

const MOCK_POSITIONS: UserPosition[] = [
    {
        marketId: "1",
        marketTitle: "Will BTC reach $150k before 2026?",
        side: "YES",
        amount: 500,
        entryPrice: 0.42,
        pnl: 120
    }
];

const MOCK_HISTORY: TradeHistory[] = [
    {
        id: "tx1",
        date: "2024-03-08",
        marketTitle: "Will BTC reach $150k before 2026?",
        side: "YES",
        amount: 500,
        price: 0.42
    }
];

export default function Profile() {
    const { walletAddress, connect, balance } = useWallet();

    if (!walletAddress) {
        return (
            <div className="py-20 flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold">Connect your wallet</h2>
                <p className="text-zinc-500">Please connect your OP Wallet to view your positions and trade history.</p>
                <button
                    onClick={connect}
                    className="px-8 py-3 bg-primary rounded-full font-bold shadow-lg shadow-primary/20"
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold font-mono">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </h1>
                <p className="text-zinc-500">My Trading Profile</p>
                {balance && (
                    <div className="flex gap-4 mt-2">
                        <div className="glass rounded-xl px-4 py-2">
                            <span className="text-xs text-zinc-500">Balance</span>
                            <p className="font-mono font-bold">{(balance.confirmed / 1e8).toFixed(8)} BTC</p>
                        </div>
                    </div>
                )}
            </header>

            <section className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">Open Positions</h2>
                <div className="glass rounded-2xl overflow-hidden border-card-border">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-900/50">
                            <tr className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                                <th className="px-6 py-4">Market</th>
                                <th className="px-6 py-4">Side</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Entry</th>
                                <th className="px-6 py-4 text-right">PnL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border">
                            {MOCK_POSITIONS.map((pos, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium max-w-xs truncate">{pos.marketTitle}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pos.side === 'YES' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                                            {pos.side}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">${pos.amount}</td>
                                    <td className="px-6 py-4 font-mono">${pos.entryPrice}</td>
                                    <td className={`px-6 py-4 font-mono text-right ${pos.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                        {pos.pnl >= 0 ? '+' : ''}{pos.pnl}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <h2 className="text-xl font-bold">Trade History</h2>
                <div className="glass rounded-2xl overflow-hidden border-card-border">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-900/50">
                            <tr className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Market</th>
                                <th className="px-6 py-4">Side</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-card-border text-zinc-400">
                            {MOCK_HISTORY.map((trade, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono">{trade.date}</td>
                                    <td className="px-6 py-4 font-medium truncate max-w-xs">{trade.marketTitle}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trade.side === 'YES' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                                            {trade.side}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">${trade.amount}</td>
                                    <td className="px-6 py-4 font-mono text-right">${trade.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
