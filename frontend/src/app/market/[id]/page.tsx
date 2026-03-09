'use client';

import React, { useState, use } from 'react';
import { SAMPLE_MARKETS } from '@/services/mockData';
import { useWallet } from '@/components/providers/WalletProviderWrapper';
import {
    getPredictionMarketContract,
    CONTRACT_ADDRESS,
    DEFAULT_FEE_RATE,
    MAX_SAT_PER_TX,
} from '@/services/contract';

export default function MarketDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const market = SAMPLE_MARKETS.find(m => m.id === id);
    const [amount, setAmount] = useState('');
    const [side, setSide] = useState<'YES' | 'NO'>('YES');
    const [isTrading, setIsTrading] = useState(false);
    const [txResult, setTxResult] = useState<string | null>(null);

    const { walletAddress, publicKey, provider, signer, network, connect } = useWallet();

    if (!market) return <div className="py-20 text-center text-zinc-500">Market not found</div>;

    const yesProb = (market.yesPool / (market.yesPool + market.noPool)) * 100;
    const noProb = 100 - yesProb;

    const handleTrade = async () => {
        // Validate wallet connection
        if (!walletAddress) {
            connect();
            return;
        }

        // Validate provider & signer
        if (!provider) {
            alert('Wallet provider not ready. Try reconnecting your wallet.');
            return;
        }

        // Validate contract address
        if (!CONTRACT_ADDRESS) {
            alert(
                'Contract not deployed yet.\n\n' +
                'Deploy the PredictionMarket contract to OP_NET Testnet and set ' +
                'NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local'
            );
            return;
        }

        // Validate amount
        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setIsTrading(true);
        setTxResult(null);

        try {
            // Get the contract instance
            const contract = getPredictionMarketContract(provider, network, publicKey || undefined);

            // Convert BTC amount to satoshis (bigint)
            const satoshis = BigInt(Math.floor(parseFloat(amount) * 1e8));
            const marketId = BigInt(parseInt(id));

            console.log(`Executing ${side === 'YES' ? 'buyYes' : 'buyNo'} | market: ${marketId} | amount: ${satoshis} sats`);

            // Step 1: Simulate the contract call
            const simulation = side === 'YES'
                ? await contract.buyYes(marketId, satoshis)
                : await contract.buyNo(marketId, satoshis);

            // Check if simulation indicates a revert
            if ('revert' in simulation && (simulation as any).revert) {
                throw new Error(`Transaction would fail: ${(simulation as any).revert}`);
            }

            console.log('Simulation successful, sending transaction...');

            // Step 2: Send the actual transaction via the wallet signer
            const txParams: any = {
                signer: signer || null,
                refundTo: walletAddress,
                maximumAllowedSatToSpend: MAX_SAT_PER_TX,
                feeRate: DEFAULT_FEE_RATE,
                network: network,
            };

            const tx = await simulation.sendTransaction(txParams);
            const txId = tx?.transactionId || tx?.toString() || 'Transaction sent';
            setTxResult(txId);
            console.log('Transaction broadcast:', txId);

        } catch (err: any) {
            console.error('Trade execution failed:', err);
            const message = err?.message || String(err);
            alert(`Trade failed: ${message}`);
        } finally {
            setIsTrading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
                        <span>Active Market</span>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    </div>
                    <h1 className="text-3xl font-bold leading-tight">{market.title}</h1>
                    <p className="text-zinc-400 leading-relaxed max-w-2xl">{market.description}</p>
                </div>

                <div className="glass rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase font-bold">YES Price</span>
                        <span className="text-2xl font-mono text-success">${(yesProb / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase font-bold">NO Price</span>
                        <span className="text-2xl font-mono text-danger">${(noProb / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase font-bold">Volume</span>
                        <span className="text-2xl font-mono font-medium">${(market.totalVolume / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase font-bold">End Date</span>
                        <span className="text-xl font-medium">{new Date(market.endDate).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Probability visualization */}
                <div className="glass rounded-2xl p-8 flex flex-col gap-6">
                    <h3 className="font-bold text-sm">Probability</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-success font-bold">YES {yesProb.toFixed(1)}%</span>
                            <span className="text-danger font-bold">NO {noProb.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden flex">
                            <div
                                className="h-full bg-success transition-all duration-500"
                                style={{ width: `${yesProb}%` }}
                            />
                            <div
                                className="h-full bg-danger transition-all duration-500"
                                style={{ width: `${noProb}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="glass rounded-2xl p-6 flex flex-col gap-6 border-primary/20 bg-primary/5">
                    <h2 className="text-xl font-bold">Place Order</h2>

                    {!walletAddress && (
                        <div className="text-center py-4">
                            <p className="text-zinc-400 text-sm mb-3">Connect your wallet to trade</p>
                            <button
                                onClick={connect}
                                className="px-6 py-2 bg-primary rounded-lg font-bold text-sm"
                            >
                                Connect Wallet
                            </button>
                        </div>
                    )}

                    {walletAddress && (
                        <>
                            <div className="flex bg-zinc-900/50 p-1 rounded-xl">
                                <button
                                    onClick={() => setSide('YES')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${side === 'YES' ? 'bg-success text-white shadow-lg shadow-success/20' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    YES
                                </button>
                                <button
                                    onClick={() => setSide('NO')}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${side === 'NO' ? 'bg-danger text-white shadow-lg shadow-danger/20' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    NO
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="text-xs text-zinc-400 font-bold uppercase">Amount (BTC)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.001"
                                        step="0.0001"
                                        min="0"
                                        className="w-full bg-zinc-900 border border-card-border focus:border-primary outline-none py-4 px-4 rounded-xl font-mono text-lg transition-all"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-sm">BTC</div>
                                </div>
                                {/* Quick amount buttons */}
                                <div className="flex gap-2">
                                    {['0.001', '0.005', '0.01', '0.05'].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className="flex-1 py-1.5 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-card-border">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-zinc-500">Avg Price</span>
                                    <span>${(side === 'YES' ? yesProb / 100 : noProb / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-zinc-500">Shares to Receive</span>
                                    <span className="text-primary font-bold font-mono">
                                        {amount && parseFloat(amount) > 0
                                            ? (parseFloat(amount) * 1e8 / (side === 'YES' ? yesProb / 100 : noProb / 100)).toFixed(0)
                                            : '0'
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-zinc-500">Amount (sats)</span>
                                    <span className="font-mono">
                                        {amount ? Math.floor(parseFloat(amount) * 1e8).toLocaleString() : '0'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleTrade}
                                disabled={isTrading || !amount || parseFloat(amount || '0') <= 0}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all animate-glow disabled:opacity-50 disabled:cursor-not-allowed ${side === 'YES' ? 'bg-success shadow-success/20' : 'bg-danger shadow-danger/20'}`}
                            >
                                {isTrading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : `Buy ${side} Shares`}
                            </button>

                            {txResult && (
                                <div className="p-3 bg-success/10 border border-success/20 rounded-xl">
                                    <p className="text-xs text-success font-bold mb-1">Transaction Sent!</p>
                                    <p className="text-xs text-zinc-400 font-mono break-all">{txResult}</p>
                                </div>
                            )}

                            {!CONTRACT_ADDRESS && (
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <p className="text-xs text-yellow-500 font-bold mb-1">Contract Not Deployed</p>
                                    <p className="text-xs text-zinc-400">
                                        Deploy the PredictionMarket contract and set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="glass rounded-2xl p-6 flex flex-col gap-4">
                    <h3 className="font-bold text-sm border-b border-card-border pb-2">Market Rules</h3>
                    <ul className="flex flex-col gap-3 text-xs text-zinc-400">
                        <li className="flex gap-2">
                            <span className="text-primary">*</span>
                            <span>This is a binary market. One outcome will resolve to 100%, the other to 0%.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary">*</span>
                            <span>Prices reflect pool ratios: priceYes = yesPool / totalPool.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary">*</span>
                            <span>Running on OP_NET Testnet (Bitcoin L1).</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
