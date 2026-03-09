'use client';

import { UnisatSigner } from '@btc-vision/transaction';
import { networks } from '@btc-vision/bitcoin';
import { JSONRpcProvider } from 'opnet';

/**
 * Custom signer that uses OP Wallet (window.opnet) instead of UniSat (window.unisat).
 * OP Wallet implements the same Unisat interface, so we just override the getter.
 */
export class OPNetSigner extends UnisatSigner {
    get unisat(): any {
        if (typeof window === 'undefined') {
            throw new Error('Window not found');
        }
        const module = (window as any).opnet || (window as any).unisat;
        if (!module) {
            throw new Error('OP Wallet extension not found. Install it from the Chrome Web Store.');
        }
        return module;
    }
}

/**
 * Get the OP Wallet object from window.
 */
export function getWalletProvider(): any | null {
    if (typeof window === 'undefined') return null;
    return (window as any).opnet || (window as any).unisat || null;
}

/**
 * Check if OP Wallet is installed.
 */
export function isWalletInstalled(): boolean {
    return !!getWalletProvider();
}

/**
 * Connect to OP Wallet and return accounts.
 */
export async function connectWallet(): Promise<string[]> {
    const wallet = getWalletProvider();
    if (!wallet) {
        window.open(
            'https://chromewebstore.google.com/detail/opwallet/pmbjpcmaaladnfpacpmhmnfmpklgbdjb',
            '_blank',
        );
        throw new Error('OP Wallet not installed');
    }
    return wallet.requestAccounts();
}

/**
 * Get connected accounts.
 */
export async function getAccounts(): Promise<string[]> {
    const wallet = getWalletProvider();
    if (!wallet) return [];
    try {
        return await wallet.getAccounts();
    } catch {
        return [];
    }
}

/**
 * Get public key from wallet.
 */
export async function getPublicKey(): Promise<string | null> {
    const wallet = getWalletProvider();
    if (!wallet) return null;
    try {
        return await wallet.getPublicKey();
    } catch {
        return null;
    }
}

/**
 * Get wallet balance.
 */
export async function getBalance(): Promise<{
    confirmed: number;
    unconfirmed: number;
    total: number;
} | null> {
    const wallet = getWalletProvider();
    if (!wallet) return null;
    try {
        return await wallet.getBalance();
    } catch {
        return null;
    }
}

/**
 * Create a JSONRpcProvider for OP_NET based on connected chain.
 */
export async function createProvider(): Promise<JSONRpcProvider | null> {
    const wallet = getWalletProvider();
    if (!wallet) return null;

    try {
        const chain = await wallet.getChain();
        const chainEnum = chain?.enum;

        // Map chain enum to RPC URL and network
        switch (chainEnum) {
            case 'BITCOIN_MAINNET':
                return new JSONRpcProvider({ url: 'https://mainnet.opnet.org', network: networks.bitcoin });
            case 'BITCOIN_TESTNET':
                return new JSONRpcProvider({ url: 'https://testnet.opnet.org', network: networks.testnet });
            case 'BITCOIN_REGTEST':
                return new JSONRpcProvider({ url: 'https://regtest.opnet.org', network: networks.regtest });
            default: {
                const rpcUrl = process.env.NEXT_PUBLIC_OPNET_RPC_URL || 'https://testnet.opnet.org';
                return new JSONRpcProvider({ url: rpcUrl, network: networks.testnet });
            }
        }
    } catch {
        const rpcUrl = process.env.NEXT_PUBLIC_OPNET_RPC_URL || 'https://testnet.opnet.org';
        return new JSONRpcProvider({ url: rpcUrl, network: networks.testnet });
    }
}

/**
 * Get the bitcoinjs-lib Network object based on the connected wallet chain.
 * This is the correct format needed by opnet SDK's getContract().
 */
export async function getBitcoinNetwork(): Promise<typeof networks.testnet> {
    const wallet = getWalletProvider();
    if (!wallet) return networks.testnet;

    try {
        const chain = await wallet.getChain();
        const chainEnum = chain?.enum;

        switch (chainEnum) {
            case 'BITCOIN_MAINNET':
                return networks.bitcoin;
            case 'BITCOIN_TESTNET':
                return networks.testnet;
            case 'BITCOIN_REGTEST':
                return networks.regtest;
            default:
                return networks.testnet;
        }
    } catch {
        return networks.testnet;
    }
}

/**
 * Create a signer for OP Wallet.
 */
export async function createSigner(): Promise<OPNetSigner> {
    const signer = new OPNetSigner();
    await signer.init();
    return signer;
}
