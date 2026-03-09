import { Address, AddressMap, ExtendedAddressMap, SchnorrSignature } from '@btc-vision/transaction';
import { CallResult, OPNetEvent, IOP_NETContract } from 'opnet';

// ------------------------------------------------------------------
// Event Definitions
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Call Results
// ------------------------------------------------------------------

/**
 * @description Represents the result of the createMarket function call.
 */
export type CreateMarket = CallResult<
    {
        marketId: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the buyYes function call.
 */
export type BuyYes = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the buyNo function call.
 */
export type BuyNo = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the resolveMarket function call.
 */
export type ResolveMarket = CallResult<
    {
        success: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the marketCount function call.
 */
export type MarketCount = CallResult<
    {
        count: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the marketYesPool function call.
 */
export type MarketYesPool = CallResult<
    {
        yesPool: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the marketNoPool function call.
 */
export type MarketNoPool = CallResult<
    {
        noPool: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the marketTotalVolume function call.
 */
export type MarketTotalVolume = CallResult<
    {
        totalVolume: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the marketEndDate function call.
 */
export type MarketEndDate = CallResult<
    {
        endDate: bigint;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the marketResolved function call.
 */
export type MarketResolved = CallResult<
    {
        resolved: boolean;
    },
    OPNetEvent<never>[]
>;

/**
 * @description Represents the result of the marketOutcome function call.
 */
export type MarketOutcome = CallResult<
    {
        outcome: bigint;
    },
    OPNetEvent<never>[]
>;

// ------------------------------------------------------------------
// IPredictionMarket
// ------------------------------------------------------------------
export interface IPredictionMarket extends IOP_NETContract {
    createMarket(endDate: bigint): Promise<CreateMarket>;
    buyYes(marketId: bigint, amount: bigint): Promise<BuyYes>;
    buyNo(marketId: bigint, amount: bigint): Promise<BuyNo>;
    resolveMarket(marketId: bigint, outcome: bigint): Promise<ResolveMarket>;
    marketCount(): Promise<MarketCount>;
    marketYesPool(marketId: bigint): Promise<MarketYesPool>;
    marketNoPool(marketId: bigint): Promise<MarketNoPool>;
    marketTotalVolume(marketId: bigint): Promise<MarketTotalVolume>;
    marketEndDate(marketId: bigint): Promise<MarketEndDate>;
    marketResolved(marketId: bigint): Promise<MarketResolved>;
    marketOutcome(marketId: bigint): Promise<MarketOutcome>;
}
