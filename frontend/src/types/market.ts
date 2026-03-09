export interface Market {
    id: string;
    title: string;
    description: string;
    endDate: string;
    status: 'OPEN' | 'CLOSED' | 'RESOLVED';
    yesPool: number;
    noPool: number;
    totalVolume: number;
    outcome?: 'YES' | 'NO';
}

export interface UserPosition {
    marketId: string;
    marketTitle: string;
    side: 'YES' | 'NO';
    amount: number;
    entryPrice: number;
    pnl: number;
}

export interface TradeHistory {
    id: string;
    date: string;
    marketTitle: string;
    side: 'YES' | 'NO';
    amount: number;
    price: number;
}
