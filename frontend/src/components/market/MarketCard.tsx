import React from 'react';
import Link from 'next/link';
import { Market } from '@/types/market';

interface MarketCardProps {
    market: Market;
}

export default function MarketCard({ market }: MarketCardProps) {
    const yesProb = (market.yesPool / (market.yesPool + market.noPool)) * 100;

    return (
        <Link href={`/market/${market.id}`}>
            <div className="glass glass-hover rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all">
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                        {market.title}
                    </h3>
                    <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        BTC
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs font-medium text-zinc-400">
                        <span>YES Probability</span>
                        <span className="text-success font-bold">{yesProb.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500"
                            style={{ width: `${yesProb}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Volume</span>
                        <span className="text-sm font-mono font-medium">${(market.totalVolume / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Ends</span>
                        <span className="text-sm font-medium">{new Date(market.endDate).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-2">
                    <button className="flex-1 py-2 bg-success/10 hover:bg-success/20 text-success text-xs font-bold rounded-lg border border-success/20 transition-colors">
                        BUY YES
                    </button>
                    <button className="flex-1 py-2 bg-danger/10 hover:bg-danger/20 text-danger text-xs font-bold rounded-lg border border-danger/20 transition-colors">
                        BUY NO
                    </button>
                </div>
            </div>
        </Link>
    );
}
