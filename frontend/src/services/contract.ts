import { ABIDataTypes, BitcoinAbiTypes, getContract, type BaseContractProperties, type CallResult, type BitcoinInterfaceAbi } from 'opnet';
import { Address } from '@btc-vision/transaction';

/**
 * ABI definition for the PredictionMarket contract.
 * Matches the contract methods with @method() and @returns() decorators.
 * All integer types use UINT256 to match btc-runtime's calldata.readU256().
 */
export const PREDICTION_MARKET_ABI: BitcoinInterfaceAbi = [
    {
        name: 'createMarket',
        inputs: [
            { name: 'endDate', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'buyYes',
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'success', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'buyNo',
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'success', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'resolveMarket',
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
            { name: 'outcome', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'success', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Function,
    },
    // Read-only methods
    {
        name: 'marketCount',
        constant: true,
        inputs: [],
        outputs: [
            { name: 'count', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketYesPool',
        constant: true,
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'yesPool', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketNoPool',
        constant: true,
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'noPool', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketTotalVolume',
        constant: true,
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'totalVolume', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketEndDate',
        constant: true,
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'endDate', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketResolved',
        constant: true,
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'resolved', type: ABIDataTypes.BOOL },
        ],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketOutcome',
        constant: true,
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
        ],
        outputs: [
            { name: 'outcome', type: ABIDataTypes.UINT256 },
        ],
        type: BitcoinAbiTypes.Function,
    },
];

/**
 * Contract address for PredictionMarket on OP_NET Testnet.
 * Set via NEXT_PUBLIC_CONTRACT_ADDRESS environment variable.
 */
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

/**
 * Default fee rate for transactions (sat/vByte)
 */
export const DEFAULT_FEE_RATE = 10;

/**
 * Maximum satoshis allowed per transaction
 */
export const MAX_SAT_PER_TX = 100000n;

/**
 * Interface for the PredictionMarket contract methods.
 * Extends BaseContractProperties for use with getContract<T>().
 */
export interface IPredictionMarketContract extends BaseContractProperties {
    buyYes(marketId: bigint, amount: bigint): Promise<CallResult>;
    buyNo(marketId: bigint, amount: bigint): Promise<CallResult>;
    createMarket(endDate: bigint): Promise<CallResult>;
    resolveMarket(marketId: bigint, outcome: bigint): Promise<CallResult>;
    marketCount(): Promise<CallResult>;
    marketYesPool(marketId: bigint): Promise<CallResult>;
    marketNoPool(marketId: bigint): Promise<CallResult>;
    marketTotalVolume(marketId: bigint): Promise<CallResult>;
    marketEndDate(marketId: bigint): Promise<CallResult>;
    marketResolved(marketId: bigint): Promise<CallResult>;
    marketOutcome(marketId: bigint): Promise<CallResult>;
}

/**
 * Creates a typed PredictionMarket contract instance.
 */
export function getPredictionMarketContract(
    provider: any,
    network: any,
    senderPublicKey?: string,
): IPredictionMarketContract {
    if (!CONTRACT_ADDRESS) {
        throw new Error(
            'Contract address not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local'
        );
    }

    // Convert public key hex string to Address object if provided
    let senderAddress: Address | undefined;
    if (senderPublicKey) {
        try {
            senderAddress = Address.fromString(senderPublicKey);
        } catch {
            // If conversion fails, proceed without sender
            senderAddress = undefined;
        }
    }

    return getContract<IPredictionMarketContract>(
        CONTRACT_ADDRESS,
        PREDICTION_MARKET_ABI,
        provider,
        network,
        senderAddress,
    );
}
