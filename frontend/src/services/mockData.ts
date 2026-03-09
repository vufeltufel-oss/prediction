import { Market } from "@/types/market";

export const SAMPLE_MARKETS: Market[] = [
    {
        id: "0",
        title: "Will BTC reach $150k before 2026?",
        description: "This market resolves to YES if the price of Bitcoin (BTC) reaches or exceeds $150,000 USD on any major exchange before January 1, 2026. Otherwise, it resolves to NO.",
        endDate: "2025-12-31",
        status: "OPEN",
        yesPool: 450000,
        noPool: 550000,
        totalVolume: 1000000
    },
    {
        id: "1",
        title: "Will OpenAI release GPT-6 in 2026?",
        description: "This market resolves to YES if OpenAI officially releases a model named GPT-6 or explicitly marketed as the direct successor to GPT-5 during the calendar year 2026.",
        endDate: "2026-12-31",
        status: "OPEN",
        yesPool: 300000,
        noPool: 700000,
        totalVolume: 1000000
    },
    {
        id: "2",
        title: "Will Trump win the 2028 election?",
        description: "This market resolves to YES if Donald J. Trump is elected President of the United States in the 2028 general election.",
        endDate: "2028-11-05",
        status: "OPEN",
        yesPool: 520000,
        noPool: 480000,
        totalVolume: 1000000
    }
];
