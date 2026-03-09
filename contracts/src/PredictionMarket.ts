import { u256 } from '@btc-vision/as-bignum/assembly';
import {
    OP_NET,
    Blockchain,
    Calldata,
    BytesWriter,
    StoredU256,
    StoredU256Array,
    SafeMath,
    Revert,
    EMPTY_POINTER,
} from '@btc-vision/btc-runtime/runtime';

@final
export class PredictionMarket extends OP_NET {
    // Storage pointers
    private marketCountPointer: u16 = Blockchain.nextPointer;
    private yesPoolPointer: u16 = Blockchain.nextPointer;
    private noPoolPointer: u16 = Blockchain.nextPointer;
    private totalVolumePointer: u16 = Blockchain.nextPointer;
    private endDatePointer: u16 = Blockchain.nextPointer;
    private resolvedPointer: u16 = Blockchain.nextPointer;
    private outcomePointer: u16 = Blockchain.nextPointer;

    // Scalar storage (eager init is OK for simple StoredU256)
    private marketCountStore: StoredU256 = new StoredU256(this.marketCountPointer, EMPTY_POINTER);

    // Lazy initialized arrays — NOT created during start(), only on first access
    private _yesPool: StoredU256Array | null = null;
    private get yesPool(): StoredU256Array {
        if (this._yesPool === null) this._yesPool = new StoredU256Array(this.yesPoolPointer, EMPTY_POINTER);
        return this._yesPool as StoredU256Array;
    }

    private _noPool: StoredU256Array | null = null;
    private get noPool(): StoredU256Array {
        if (this._noPool === null) this._noPool = new StoredU256Array(this.noPoolPointer, EMPTY_POINTER);
        return this._noPool as StoredU256Array;
    }

    private _totalVolume: StoredU256Array | null = null;
    private get totalVolume(): StoredU256Array {
        if (this._totalVolume === null) this._totalVolume = new StoredU256Array(this.totalVolumePointer, EMPTY_POINTER);
        return this._totalVolume as StoredU256Array;
    }

    private _endDate: StoredU256Array | null = null;
    private get endDateArr(): StoredU256Array {
        if (this._endDate === null) this._endDate = new StoredU256Array(this.endDatePointer, EMPTY_POINTER);
        return this._endDate as StoredU256Array;
    }

    private _resolved: StoredU256Array | null = null;
    private get resolvedArr(): StoredU256Array {
        if (this._resolved === null) this._resolved = new StoredU256Array(this.resolvedPointer, EMPTY_POINTER);
        return this._resolved as StoredU256Array;
    }

    private _outcome: StoredU256Array | null = null;
    private get outcomeArr(): StoredU256Array {
        if (this._outcome === null) this._outcome = new StoredU256Array(this.outcomePointer, EMPTY_POINTER);
        return this._outcome as StoredU256Array;
    }

    public constructor() {
        super();
    }

    public override onDeployment(_calldata: Calldata): void {
        this.marketCountStore.value = u256.Zero;
    }

    // ====== Write Methods ======

    @method(
        { name: 'endDate', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'marketId', type: ABIDataTypes.UINT256 })
    public createMarket(calldata: Calldata): BytesWriter {
        const endDate = calldata.readU256();
        const id = this.marketCountStore.value;

        // Initialize market data arrays
        this.yesPool.push(u256.Zero);
        this.noPool.push(u256.Zero);
        this.totalVolume.push(u256.Zero);
        this.endDateArr.push(endDate);
        this.resolvedArr.push(u256.Zero);
        this.outcomeArr.push(u256.Zero);

        // Increment market counter
        this.marketCountStore.value = SafeMath.add(id, u256.One);

        this.saveAll();

        const writer = new BytesWriter(32);
        writer.writeU256(id);
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public buyYes(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        const amount = calldata.readU256();

        this.validateMarketExists(marketIdNum);

        const res = this.resolvedArr.get(marketIdNum);
        if (res != u256.Zero) throw new Revert('Market already resolved');

        // Update yes pool
        const currentPool = this.yesPool.get(marketIdNum);
        this.yesPool.set(marketIdNum, SafeMath.add(currentPool, amount));

        // Update total volume
        const currentTotal = this.totalVolume.get(marketIdNum);
        this.totalVolume.set(marketIdNum, SafeMath.add(currentTotal, amount));

        this.yesPool.save();
        this.totalVolume.save();

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
        { name: 'amount', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public buyNo(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        const amount = calldata.readU256();

        this.validateMarketExists(marketIdNum);

        const res = this.resolvedArr.get(marketIdNum);
        if (res != u256.Zero) throw new Revert('Market already resolved');

        // Update no pool
        const currentPool = this.noPool.get(marketIdNum);
        this.noPool.set(marketIdNum, SafeMath.add(currentPool, amount));

        // Update total volume
        const currentTotal = this.totalVolume.get(marketIdNum);
        this.totalVolume.set(marketIdNum, SafeMath.add(currentTotal, amount));

        this.noPool.save();
        this.totalVolume.save();

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
        { name: 'outcome', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'success', type: ABIDataTypes.BOOL })
    public resolveMarket(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        const outcomeVal = calldata.readU256();

        this.validateMarketExists(marketIdNum);

        // Only deployer can resolve
        this.onlyDeployer(Blockchain.tx.sender);

        this.resolvedArr.set(marketIdNum, u256.One);
        this.outcomeArr.set(marketIdNum, outcomeVal);

        this.resolvedArr.save();
        this.outcomeArr.save();

        const writer = new BytesWriter(1);
        writer.writeBoolean(true);
        return writer;
    }

    // ====== Read Methods ======

    @method()
    @returns({ name: 'count', type: ABIDataTypes.UINT256 })
    public marketCount(calldata: Calldata): BytesWriter {
        const writer = new BytesWriter(32);
        writer.writeU256(this.marketCountStore.value);
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'yesPool', type: ABIDataTypes.UINT256 })
    public marketYesPool(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        this.validateMarketExists(marketIdNum);

        const writer = new BytesWriter(32);
        writer.writeU256(this.yesPool.get(marketIdNum));
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'noPool', type: ABIDataTypes.UINT256 })
    public marketNoPool(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        this.validateMarketExists(marketIdNum);

        const writer = new BytesWriter(32);
        writer.writeU256(this.noPool.get(marketIdNum));
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'totalVolume', type: ABIDataTypes.UINT256 })
    public marketTotalVolume(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        this.validateMarketExists(marketIdNum);

        const writer = new BytesWriter(32);
        writer.writeU256(this.totalVolume.get(marketIdNum));
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'endDate', type: ABIDataTypes.UINT256 })
    public marketEndDate(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        this.validateMarketExists(marketIdNum);

        const writer = new BytesWriter(32);
        writer.writeU256(this.endDateArr.get(marketIdNum));
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'resolved', type: ABIDataTypes.BOOL })
    public marketResolved(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        this.validateMarketExists(marketIdNum);

        const writer = new BytesWriter(1);
        writer.writeBoolean(this.resolvedArr.get(marketIdNum) != u256.Zero);
        return writer;
    }

    @method(
        { name: 'marketId', type: ABIDataTypes.UINT256 },
    )
    @returns({ name: 'outcome', type: ABIDataTypes.UINT256 })
    public marketOutcome(calldata: Calldata): BytesWriter {
        const marketIdNum = calldata.readU256().toI32();
        this.validateMarketExists(marketIdNum);

        const writer = new BytesWriter(32);
        writer.writeU256(this.outcomeArr.get(marketIdNum));
        return writer;
    }

    // ====== Helpers ======

    private validateMarketExists(marketIdNum: i32): void {
        const count = this.marketCountStore.value.toI32();
        if (marketIdNum >= count || marketIdNum < 0) throw new Revert('Market does not exist');
    }

    private saveAll(): void {
        this.yesPool.save();
        this.noPool.save();
        this.totalVolume.save();
        this.endDateArr.save();
        this.resolvedArr.save();
        this.outcomeArr.save();
    }
}
