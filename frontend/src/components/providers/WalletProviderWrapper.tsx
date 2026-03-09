'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { JSONRpcProvider } from 'opnet';
import type { OPNetSigner } from '@/services/wallet';

interface WalletContextType {
    walletAddress: string | null;
    publicKey: string | null;
    provider: JSONRpcProvider | null;
    signer: OPNetSigner | null;
    balance: { confirmed: number; unconfirmed: number; total: number } | null;
    connecting: boolean;
    network: any;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet(): WalletContextType {
    const ctx = useContext(WalletContext);
    if (!ctx) {
        throw new Error('useWallet must be used within WalletProviderWrapper');
    }
    return ctx;
}

export default function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [provider, setProvider] = useState<JSONRpcProvider | null>(null);
    const [signer, setSigner] = useState<OPNetSigner | null>(null);
    const [balance, setBalance] = useState<{ confirmed: number; unconfirmed: number; total: number } | null>(null);
    const [connecting, setConnecting] = useState(false);
    const [network, setNetwork] = useState<any>(null);

    // Dynamic import to avoid SSR issues with window access
    const getWalletModule = useCallback(async () => {
        return await import('@/services/wallet');
    }, []);

    // Check for existing connection on mount
    useEffect(() => {
        const checkConnection = async () => {
            try {
                const wallet = await getWalletModule();
                if (!wallet.isWalletInstalled()) return;

                const accounts = await wallet.getAccounts();
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);

                    const pk = await wallet.getPublicKey();
                    setPublicKey(pk);

                    const prov = await wallet.createProvider();
                    setProvider(prov);

                    const bal = await wallet.getBalance();
                    setBalance(bal);

                    try {
                        const btcNetwork = await wallet.getBitcoinNetwork();
                        setNetwork(btcNetwork);
                    } catch { /* ignore */ }

                    try {
                        const s = await wallet.createSigner();
                        setSigner(s);
                    } catch (e) {
                        console.warn('Could not create signer:', e);
                    }
                }
            } catch (e) {
                console.warn('Wallet check failed:', e);
            }
        };
        checkConnection();
    }, [getWalletModule]);

    // Listen for account changes
    useEffect(() => {
        const setupListeners = async () => {
            const wallet = await getWalletModule();
            const wp = wallet.getWalletProvider();
            if (!wp?.on) return;

            const handleAccountsChanged = async (accounts: string[]) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    const pk = await wallet.getPublicKey();
                    setPublicKey(pk);
                    const bal = await wallet.getBalance();
                    setBalance(bal);
                    try {
                        const s = await wallet.createSigner();
                        setSigner(s);
                    } catch { /* ignore */ }
                } else {
                    setWalletAddress(null);
                    setPublicKey(null);
                    setSigner(null);
                    setBalance(null);
                }
            };

            wp.on('accountsChanged', handleAccountsChanged);

            return () => {
                wp.removeListener?.('accountsChanged', handleAccountsChanged);
            };
        };

        setupListeners();
    }, [getWalletModule]);

    const connect = useCallback(async () => {
        setConnecting(true);
        try {
            const wallet = await getWalletModule();
            const accounts = await wallet.connectWallet();

            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);

                const pk = await wallet.getPublicKey();
                setPublicKey(pk);

                const prov = await wallet.createProvider();
                setProvider(prov);

                const bal = await wallet.getBalance();
                setBalance(bal);

                try {
                    const chain = await wallet.getWalletProvider()?.getChain();
                    setNetwork(chain);
                } catch { /* ignore */ }

                try {
                    const s = await wallet.createSigner();
                    setSigner(s);
                } catch (e) {
                    console.warn('Signer creation failed:', e);
                }
            }
        } catch (err: any) {
            console.error('Wallet connection failed:', err);
            if (err.message?.includes('not installed')) {
                // wallet.ts already opens the store link
            } else {
                alert(`Failed to connect wallet: ${err.message || err}`);
            }
        } finally {
            setConnecting(false);
        }
    }, [getWalletModule]);

    const disconnect = useCallback(() => {
        setWalletAddress(null);
        setPublicKey(null);
        setSigner(null);
        setProvider(null);
        setBalance(null);
        setNetwork(null);
    }, []);

    return (
        <WalletContext.Provider
            value={{
                walletAddress,
                publicKey,
                provider,
                signer,
                balance,
                connecting,
                network,
                connect,
                disconnect,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
