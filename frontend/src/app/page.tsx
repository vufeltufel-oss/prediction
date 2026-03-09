'use client';

import React, { useState } from 'react';
import MarketCard from '@/components/market/MarketCard';
import { SAMPLE_MARKETS } from '@/services/mockData';
import { useWallet } from '@/components/providers/WalletProviderWrapper';
import {
    getPredictionMarketContract,
    CONTRACT_ADDRESS,
    DEFAULT_FEE_RATE,
    MAX_SAT_PER_TX,
} from '@/services/contract';

export default function Home() {
    const { walletAddress, provider, signer, network, connect } = useWallet();
    const [isCreating, setIsCreating] = useState(false);
    const [createStatus, setCreateStatus] = useState<string | null>(null);

    const handleCreateMarkets = async () => {
        if (!walletAddress) {
            connect();
            return;
        }
        if (!provider || !CONTRACT_ADDRESS) {
            alert('Provider or contract address not available');
            return;
        }

        setIsCreating(true);
        setCreateStatus('Initializing...');

        try {
            const contract = getPredictionMarketContract(provider, network, walletAddress || undefined);

            for (let i = 0; i < SAMPLE_MARKETS.length; i++) {
                const market = SAMPLE_MARKETS[i];
                const endTimestamp = BigInt(Math.floor(new Date(market.endDate).getTime() / 1000));

                setCreateStatus(`Creating market ${i + 1}/${SAMPLE_MARKETS.length}: "${market.title}"...`);

                const simulation = await contract.createMarket(endTimestamp);

                if ('revert' in simulation && (simulation as any).revert) {
                    throw new Error(`Simulation failed for market ${i}: ${(simulation as any).revert}`);
                }

                const txParams: any = {
                    signer: signer || null,
                    refundTo: walletAddress,
                    maximumAllowedSatToSpend: MAX_SAT_PER_TX,
                    feeRate: DEFAULT_FEE_RATE,
                    network: network,
                };
                const tx = await simulation.sendTransaction(txParams);

                const txId = tx?.transactionId || tx?.toString() || 'sent';
                setCreateStatus(`Market ${i + 1} created! TX: ${txId.slice(0, 16)}...`);

                if (i < SAMPLE_MARKETS.length - 1) {
                    await new Promise(r => setTimeout(r, 2000));
                }
            }

            setCreateStatus(`All ${SAMPLE_MARKETS.length} markets created successfully!`);
        } catch (err: any) {
            console.error('Market creation failed:', err);
            setCreateStatus(`Error: ${err?.message || String(err)}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-4 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    The Leading <span className="text-primary">Prediction Market</span> on BTC L1
                </h1>
                <p className="text-zinc-400 text-lg leading-relaxed">
                    Trade on the world&apos;s most highly-debated topics with the security and decentralization of Bitcoin using OP_NET.
                </p>
            </header>

            {/* Admin: Create Markets (testnet) */}
            {CONTRACT_ADDRESS && (
                <div className="glass rounded-2xl p-6 flex flex-col gap-4 border border-yellow-500/20 bg-yellow-500/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-sm text-yellow-500">Admin: Initialize Markets</h3>
                            <p className="text-xs text-zinc-400 mt-1">
                                Create the sample markets on-chain. Only needs to be done once after deployment.
                            </p>
                        </div>
                        <button
                            onClick={handleCreateMarkets}
                            disabled={isCreating}
                            className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : walletAddress ? 'Create Markets' : 'Connect Wallet'}
                        </button>
                    </div>
                    {createStatus && (
                        <p className="text-xs font-mono text-zinc-300 bg-zinc-900/50 p-3 rounded-lg">{createStatus}</p>
                    )}
                </div>
            )}

            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Active Markets</h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 text-xs font-bold glass rounded-full hover:bg-white/10 transition-colors">All</button>
                        <button className="px-4 py-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors">Crypto</button>
                        <button className="px-4 py-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors">Politics</button>
                        <button className="px-4 py-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors">Tech</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SAMPLE_MARKETS.map((market) => (
                        <MarketCard key={market.id} market={market} />
                    ))}
                </div>
            </section>
        </div>
    );
}
