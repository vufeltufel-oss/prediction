import { ABIDataTypes, BitcoinAbiTypes, OP_NET_ABI } from 'opnet';

export const PredictionMarketEvents = [];

export const PredictionMarketAbi = [
    {
        name: 'createMarket',
        inputs: [{ name: 'endDate', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'marketId', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'buyYes',
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'buyNo',
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
            { name: 'amount', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'resolveMarket',
        inputs: [
            { name: 'marketId', type: ABIDataTypes.UINT256 },
            { name: 'outcome', type: ABIDataTypes.UINT256 },
        ],
        outputs: [{ name: 'success', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketCount',
        inputs: [],
        outputs: [{ name: 'count', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketYesPool',
        inputs: [{ name: 'marketId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'yesPool', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketNoPool',
        inputs: [{ name: 'marketId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'noPool', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketTotalVolume',
        inputs: [{ name: 'marketId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'totalVolume', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketEndDate',
        inputs: [{ name: 'marketId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'endDate', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketResolved',
        inputs: [{ name: 'marketId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'resolved', type: ABIDataTypes.BOOL }],
        type: BitcoinAbiTypes.Function,
    },
    {
        name: 'marketOutcome',
        inputs: [{ name: 'marketId', type: ABIDataTypes.UINT256 }],
        outputs: [{ name: 'outcome', type: ABIDataTypes.UINT256 }],
        type: BitcoinAbiTypes.Function,
    },
    ...PredictionMarketEvents,
    ...OP_NET_ABI,
];

export default PredictionMarketAbi;
