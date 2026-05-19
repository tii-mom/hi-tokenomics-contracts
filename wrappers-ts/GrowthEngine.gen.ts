// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a GrowthEngine contract in Tolk.
/* eslint-disable */

import * as c from '@ton/core';
import { beginCell, ContractProvider, Sender, SendMode } from '@ton/core';

// ————————————————————————————————————————————
//   predefined types and functions
//

type RemainingBitsAndRefs = c.Slice

type StoreCallback<T> = (obj: T, b: c.Builder) => void
type LoadCallback<T> = (s: c.Slice) => T

export type CellRef<T> = {
    ref: T
}

function makeCellFrom<T>(self: T, storeFn_T: StoreCallback<T>): c.Cell {
    let b = beginCell();
    storeFn_T(self, b);
    return b.endCell();
}

function loadAndCheckPrefix32(s: c.Slice, expected: number, structName: string): void {
    let prefix = s.loadUint(32);
    if (prefix !== expected) {
        throw new Error(`Incorrect prefix for '${structName}': expected 0x${expected.toString(16).padStart(8, '0')}, got 0x${prefix.toString(16).padStart(8, '0')}`);
    }
}

function formatPrefix(prefixNum: number, prefixLen: number): string {
    return prefixLen % 4 ? `0b${prefixNum.toString(2).padStart(prefixLen, '0')}` : `0x${prefixNum.toString(16).padStart(prefixLen / 4, '0')}`;
}

function loadAndCheckPrefix(s: c.Slice, expected: number, prefixLen: number, structName: string): void {
    let prefix = s.loadUint(prefixLen);
    if (prefix !== expected) {
        throw new Error(`Incorrect prefix for '${structName}': expected ${formatPrefix(expected, prefixLen)}, got ${formatPrefix(prefix, prefixLen)}`);
    }
}

function lookupPrefix(s: c.Slice, expected: number, prefixLen: number): boolean {
    return s.remainingBits >= prefixLen && s.preloadUint(prefixLen) === expected;
}

function throwNonePrefixMatch(fieldPath: string): never {
    throw new Error(`Incorrect prefix for '${fieldPath}': none of variants matched`);
}

function storeCellRef<T>(cell: CellRef<T>, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    let b_ref = c.beginCell();
    storeFn_T(cell.ref, b_ref);
    b.storeRef(b_ref.endCell());
}

function loadCellRef<T>(s: c.Slice, loadFn_T: LoadCallback<T>): CellRef<T> {
    let s_ref = s.loadRef().beginParse();
    return { ref: loadFn_T(s_ref) };
}

function storeTolkRemaining(v: RemainingBitsAndRefs, b: c.Builder): void {
    b.storeSlice(v);
}

function loadTolkRemaining(s: c.Slice): RemainingBitsAndRefs {
    let rest = s.clone();
    s.loadBits(s.remainingBits);
    while (s.remainingRefs) {
        s.loadRef();
    }
    return rest;
}

function storeTolkNullable<T>(v: T | null, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    if (v === null) {
        b.storeUint(0, 1);
    } else {
        b.storeUint(1, 1);
        storeFn_T(v, b);
    }
}

function createDictionaryValue<V>(loadFn_V: LoadCallback<V>, storeFn_V: StoreCallback<V>): c.DictionaryValue<V> {
    return {
        serialize(self: V, b: c.Builder) {
            storeFn_V(self, b);
        },
        parse(s: c.Slice): V {
            const value = loadFn_V(s);
            s.endParse();
            return value;
        }
    }
}

// ————————————————————————————————————————————
//   parse get methods result from a TVM stack
//

class StackReader {
    constructor(private tuple: c.TupleItem[]) {
    }

    static fromGetMethod(expectedN: number, getMethodResult: { stack: c.TupleReader }): StackReader {
        let tuple = [] as c.TupleItem[];
        while (getMethodResult.stack.remaining) {
            tuple.push(getMethodResult.stack.pop());
        }
        if (tuple.length !== expectedN) {
            throw new Error(`expected ${expectedN} stack width, got ${tuple.length}`);
        }
        return new StackReader(tuple);
    }

    private popExpecting<ItemT>(itemType: string): ItemT {
        const item = this.tuple.shift();
        if (item?.type === itemType) {
            return item as ItemT;
        }
        throw new Error(`not '${itemType}' on a stack`);
    }

    private popCellLike(): c.Cell {
        const item = this.tuple.shift();
        if (item && (item.type === 'cell' || item.type === 'slice' || item.type === 'builder')) {
            return item.cell;
        }
        throw new Error(`not cell/slice on a stack`);
    }

    readBigInt(): bigint {
        return this.popExpecting<c.TupleItemInt>('int').value;
    }

    readBoolean(): boolean {
        return this.popExpecting<c.TupleItemInt>('int').value !== 0n;
    }

    readCell(): c.Cell {
        return this.popCellLike();
    }

    readSlice(): c.Slice {
        return this.popCellLike().beginParse();
    }
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

type uint8 = bigint
type uint64 = bigint

/**
 > type ForwardPayloadRemainder = RemainingBitsAndRefs
 */
export type ForwardPayloadRemainder = RemainingBitsAndRefs

export const ForwardPayloadRemainder = {
    fromSlice(s: c.Slice): ForwardPayloadRemainder {
        return loadTolkRemaining(s);
    },
    store(self: ForwardPayloadRemainder, b: c.Builder): void {
        storeTolkRemaining(self, b);
    },
    toCell(self: ForwardPayloadRemainder): c.Cell {
        return makeCellFrom<ForwardPayloadRemainder>(self, ForwardPayloadRemainder.store);
    }
}

/**
 > struct (0b0) PayloadInline {
 >     value: RemainingBitsAndRefs
 > }
 */
export interface PayloadInline {
    readonly $: 'PayloadInline'
    value: RemainingBitsAndRefs
}

export const PayloadInline = {
    PREFIX: 0b0,

    create(args: {
        value: RemainingBitsAndRefs
    }): PayloadInline {
        return {
            $: 'PayloadInline',
            ...args
        }
    },
    fromSlice(s: c.Slice): PayloadInline {
        loadAndCheckPrefix(s, 0b0, 1, 'PayloadInline');
        return {
            $: 'PayloadInline',
            value: loadTolkRemaining(s),
        }
    },
    store(self: PayloadInline, b: c.Builder): void {
        b.storeUint(0b0, 1);
        storeTolkRemaining(self.value, b);
    },
    toCell(self: PayloadInline): c.Cell {
        return makeCellFrom<PayloadInline>(self, PayloadInline.store);
    }
}

/**
 > struct (0b1) PayloadInRef {
 >     value: Cell<RemainingBitsAndRefs>
 > }
 */
export interface PayloadInRef {
    readonly $: 'PayloadInRef'
    value: CellRef<RemainingBitsAndRefs>
}

export const PayloadInRef = {
    PREFIX: 0b1,

    create(args: {
        value: CellRef<RemainingBitsAndRefs>
    }): PayloadInRef {
        return {
            $: 'PayloadInRef',
            ...args
        }
    },
    fromSlice(s: c.Slice): PayloadInRef {
        loadAndCheckPrefix(s, 0b1, 1, 'PayloadInRef');
        return {
            $: 'PayloadInRef',
            value: loadCellRef<RemainingBitsAndRefs>(s, loadTolkRemaining),
        }
    },
    store(self: PayloadInRef, b: c.Builder): void {
        b.storeUint(0b1, 1);
        storeCellRef<RemainingBitsAndRefs>(self.value, b, storeTolkRemaining);
    },
    toCell(self: PayloadInRef): c.Cell {
        return makeCellFrom<PayloadInRef>(self, PayloadInRef.store);
    }
}

/**
 > struct (0x0f8a7ea5) AskToTransfer {
 >     queryId: uint64
 >     jettonAmount: coins
 >     transferRecipient: address
 >     sendExcessesTo: address?
 >     customPayload: cell?
 >     forwardTonAmount: coins
 >     forwardPayload: ForwardPayloadRemainder
 > }
 */
export interface AskToTransfer {
    readonly $: 'AskToTransfer'
    queryId: uint64
    jettonAmount: coins
    transferRecipient: c.Address
    sendExcessesTo: c.Address | null
    customPayload: c.Cell | null
    forwardTonAmount: coins
    forwardPayload: PayloadInline | PayloadInRef
}

export const AskToTransfer = {
    PREFIX: 0x0f8a7ea5,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        transferRecipient: c.Address
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: PayloadInline | PayloadInRef
    }): AskToTransfer {
        return {
            $: 'AskToTransfer',
            ...args
        }
    },
    fromSlice(s: c.Slice): AskToTransfer {
        loadAndCheckPrefix32(s, 0x0f8a7ea5, 'AskToTransfer');
        return {
            $: 'AskToTransfer',
            queryId: s.loadUintBig(64),
            jettonAmount: s.loadCoins(),
            transferRecipient: s.loadAddress(),
            sendExcessesTo: s.loadMaybeAddress(),
            customPayload: s.loadBoolean() ? s.loadRef() : null,
            forwardTonAmount: s.loadCoins(),
            forwardPayload: lookupPrefix(s, 0b0, 1) ? PayloadInline.fromSlice(s) :
                lookupPrefix(s, 0b1, 1) ? PayloadInRef.fromSlice(s) :
                throwNonePrefixMatch('AskToTransfer.forwardPayload'),
        }
    },
    store(self: AskToTransfer, b: c.Builder): void {
        b.storeUint(0x0f8a7ea5, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeAddress(self.transferRecipient);
        b.storeAddress(self.sendExcessesTo);
        storeTolkNullable<c.Cell>(self.customPayload, b,
            (v,b) => b.storeRef(v)
        );
        b.storeCoins(self.forwardTonAmount);
        switch (self.forwardPayload.$) {
            case 'PayloadInline':
                PayloadInline.store(self.forwardPayload, b);
                break;
            case 'PayloadInRef':
                PayloadInRef.store(self.forwardPayload, b);
                break;
        }
    },
    toCell(self: AskToTransfer): c.Cell {
        return makeCellFrom<AskToTransfer>(self, AskToTransfer.store);
    }
}

/**
 > struct (0xd372158c) TopUpTons {
 > }
 */
export interface TopUpTons {
    readonly $: 'TopUpTons'
}

export const TopUpTons = {
    PREFIX: 0xd372158c,

    create(): TopUpTons {
        return {
            $: 'TopUpTons',
        }
    },
    fromSlice(s: c.Slice): TopUpTons {
        loadAndCheckPrefix32(s, 0xd372158c, 'TopUpTons');
        return {
            $: 'TopUpTons',
        }
    },
    store(self: TopUpTons, b: c.Builder): void {
        b.storeUint(0xd372158c, 32);
    },
    toCell(self: TopUpTons): c.Cell {
        return makeCellFrom<TopUpTons>(self, TopUpTons.store);
    }
}

/**
 > struct (0x48490102) BuyGrowth {
 >     tonAmount: coins
 > }
 */
export interface BuyGrowth {
    readonly $: 'BuyGrowth'
    tonAmount: coins
}

export const BuyGrowth = {
    PREFIX: 0x48490102,

    create(args: {
        tonAmount: coins
    }): BuyGrowth {
        return {
            $: 'BuyGrowth',
            ...args
        }
    },
    fromSlice(s: c.Slice): BuyGrowth {
        loadAndCheckPrefix32(s, 0x48490102, 'BuyGrowth');
        return {
            $: 'BuyGrowth',
            tonAmount: s.loadCoins(),
        }
    },
    store(self: BuyGrowth, b: c.Builder): void {
        b.storeUint(0x48490102, 32);
        b.storeCoins(self.tonAmount);
    },
    toCell(self: BuyGrowth): c.Cell {
        return makeCellFrom<BuyGrowth>(self, BuyGrowth.store);
    }
}

/**
 > struct (0x48490103) SetGrowthEnabled {
 >     enabled: bool
 > }
 */
export interface SetGrowthEnabled {
    readonly $: 'SetGrowthEnabled'
    enabled: boolean
}

export const SetGrowthEnabled = {
    PREFIX: 0x48490103,

    create(args: {
        enabled: boolean
    }): SetGrowthEnabled {
        return {
            $: 'SetGrowthEnabled',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetGrowthEnabled {
        loadAndCheckPrefix32(s, 0x48490103, 'SetGrowthEnabled');
        return {
            $: 'SetGrowthEnabled',
            enabled: s.loadBoolean(),
        }
    },
    store(self: SetGrowthEnabled, b: c.Builder): void {
        b.storeUint(0x48490103, 32);
        b.storeBit(self.enabled);
    },
    toCell(self: SetGrowthEnabled): c.Cell {
        return makeCellFrom<SetGrowthEnabled>(self, SetGrowthEnabled.store);
    }
}

/**
 > struct (0x48490104) CloseGrowthEngine {
 > }
 */
export interface CloseGrowthEngine {
    readonly $: 'CloseGrowthEngine'
}

export const CloseGrowthEngine = {
    PREFIX: 0x48490104,

    create(): CloseGrowthEngine {
        return {
            $: 'CloseGrowthEngine',
        }
    },
    fromSlice(s: c.Slice): CloseGrowthEngine {
        loadAndCheckPrefix32(s, 0x48490104, 'CloseGrowthEngine');
        return {
            $: 'CloseGrowthEngine',
        }
    },
    store(self: CloseGrowthEngine, b: c.Builder): void {
        b.storeUint(0x48490104, 32);
    },
    toCell(self: CloseGrowthEngine): c.Cell {
        return makeCellFrom<CloseGrowthEngine>(self, CloseGrowthEngine.store);
    }
}

/**
 > struct (0x48490105) ClaimGrowth {
 > }
 */
export interface ClaimGrowth {
    readonly $: 'ClaimGrowth'
}

export const ClaimGrowth = {
    PREFIX: 0x48490105,

    create(): ClaimGrowth {
        return {
            $: 'ClaimGrowth',
        }
    },
    fromSlice(s: c.Slice): ClaimGrowth {
        loadAndCheckPrefix32(s, 0x48490105, 'ClaimGrowth');
        return {
            $: 'ClaimGrowth',
        }
    },
    store(self: ClaimGrowth, b: c.Builder): void {
        b.storeUint(0x48490105, 32);
    },
    toCell(self: ClaimGrowth): c.Cell {
        return makeCellFrom<ClaimGrowth>(self, ClaimGrowth.store);
    }
}

/**
 > struct (0x48490106) SetGrowthConfirmedLevel {
 >     growthConfirmedLevel: uint8
 > }
 */
export interface SetGrowthConfirmedLevel {
    readonly $: 'SetGrowthConfirmedLevel'
    growthConfirmedLevel: uint8
}

export const SetGrowthConfirmedLevel = {
    PREFIX: 0x48490106,

    create(args: {
        growthConfirmedLevel: uint8
    }): SetGrowthConfirmedLevel {
        return {
            $: 'SetGrowthConfirmedLevel',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetGrowthConfirmedLevel {
        loadAndCheckPrefix32(s, 0x48490106, 'SetGrowthConfirmedLevel');
        return {
            $: 'SetGrowthConfirmedLevel',
            growthConfirmedLevel: s.loadUintBig(8),
        }
    },
    store(self: SetGrowthConfirmedLevel, b: c.Builder): void {
        b.storeUint(0x48490106, 32);
        b.storeUint(self.growthConfirmedLevel, 8);
    },
    toCell(self: SetGrowthConfirmedLevel): c.Cell {
        return makeCellFrom<SetGrowthConfirmedLevel>(self, SetGrowthConfirmedLevel.store);
    }
}

/**
 > struct (0x48490107) SweepGrowthProjectFund {
 > }
 */
export interface SweepGrowthProjectFund {
    readonly $: 'SweepGrowthProjectFund'
}

export const SweepGrowthProjectFund = {
    PREFIX: 0x48490107,

    create(): SweepGrowthProjectFund {
        return {
            $: 'SweepGrowthProjectFund',
        }
    },
    fromSlice(s: c.Slice): SweepGrowthProjectFund {
        loadAndCheckPrefix32(s, 0x48490107, 'SweepGrowthProjectFund');
        return {
            $: 'SweepGrowthProjectFund',
        }
    },
    store(self: SweepGrowthProjectFund, b: c.Builder): void {
        b.storeUint(0x48490107, 32);
    },
    toCell(self: SweepGrowthProjectFund): c.Cell {
        return makeCellFrom<SweepGrowthProjectFund>(self, SweepGrowthProjectFund.store);
    }
}

/**
 > struct (0x48490108) WithdrawGrowthTons {
 >     amount: coins
 > }
 */
export interface WithdrawGrowthTons {
    readonly $: 'WithdrawGrowthTons'
    amount: coins
}

export const WithdrawGrowthTons = {
    PREFIX: 0x48490108,

    create(args: {
        amount: coins
    }): WithdrawGrowthTons {
        return {
            $: 'WithdrawGrowthTons',
            ...args
        }
    },
    fromSlice(s: c.Slice): WithdrawGrowthTons {
        loadAndCheckPrefix32(s, 0x48490108, 'WithdrawGrowthTons');
        return {
            $: 'WithdrawGrowthTons',
            amount: s.loadCoins(),
        }
    },
    store(self: WithdrawGrowthTons, b: c.Builder): void {
        b.storeUint(0x48490108, 32);
        b.storeCoins(self.amount);
    },
    toCell(self: WithdrawGrowthTons): c.Cell {
        return makeCellFrom<WithdrawGrowthTons>(self, WithdrawGrowthTons.store);
    }
}

/**
 > struct (0x48490109) SetGrowthJettonWallet {
 >     growthJettonWallet: address
 > }
 */
export interface SetGrowthJettonWallet {
    readonly $: 'SetGrowthJettonWallet'
    growthJettonWallet: c.Address
}

export const SetGrowthJettonWallet = {
    PREFIX: 0x48490109,

    create(args: {
        growthJettonWallet: c.Address
    }): SetGrowthJettonWallet {
        return {
            $: 'SetGrowthJettonWallet',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetGrowthJettonWallet {
        loadAndCheckPrefix32(s, 0x48490109, 'SetGrowthJettonWallet');
        return {
            $: 'SetGrowthJettonWallet',
            growthJettonWallet: s.loadAddress(),
        }
    },
    store(self: SetGrowthJettonWallet, b: c.Builder): void {
        b.storeUint(0x48490109, 32);
        b.storeAddress(self.growthJettonWallet);
    },
    toCell(self: SetGrowthJettonWallet): c.Cell {
        return makeCellFrom<SetGrowthJettonWallet>(self, SetGrowthJettonWallet.store);
    }
}

/**
 > struct (0x4849010a) SetGrowthMigrationTarget {
 >     targetContract: address
 > }
 */
export interface SetGrowthMigrationTarget {
    readonly $: 'SetGrowthMigrationTarget'
    targetContract: c.Address
}

export const SetGrowthMigrationTarget = {
    PREFIX: 0x4849010a,

    create(args: {
        targetContract: c.Address
    }): SetGrowthMigrationTarget {
        return {
            $: 'SetGrowthMigrationTarget',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetGrowthMigrationTarget {
        loadAndCheckPrefix32(s, 0x4849010a, 'SetGrowthMigrationTarget');
        return {
            $: 'SetGrowthMigrationTarget',
            targetContract: s.loadAddress(),
        }
    },
    store(self: SetGrowthMigrationTarget, b: c.Builder): void {
        b.storeUint(0x4849010a, 32);
        b.storeAddress(self.targetContract);
    },
    toCell(self: SetGrowthMigrationTarget): c.Cell {
        return makeCellFrom<SetGrowthMigrationTarget>(self, SetGrowthMigrationTarget.store);
    }
}

/**
 > struct (0x4849010b) TransferGrowthUncommittedHiToContract {
 >     amount: coins
 > }
 */
export interface TransferGrowthUncommittedHiToContract {
    readonly $: 'TransferGrowthUncommittedHiToContract'
    amount: coins
}

export const TransferGrowthUncommittedHiToContract = {
    PREFIX: 0x4849010b,

    create(args: {
        amount: coins
    }): TransferGrowthUncommittedHiToContract {
        return {
            $: 'TransferGrowthUncommittedHiToContract',
            ...args
        }
    },
    fromSlice(s: c.Slice): TransferGrowthUncommittedHiToContract {
        loadAndCheckPrefix32(s, 0x4849010b, 'TransferGrowthUncommittedHiToContract');
        return {
            $: 'TransferGrowthUncommittedHiToContract',
            amount: s.loadCoins(),
        }
    },
    store(self: TransferGrowthUncommittedHiToContract, b: c.Builder): void {
        b.storeUint(0x4849010b, 32);
        b.storeCoins(self.amount);
    },
    toCell(self: TransferGrowthUncommittedHiToContract): c.Cell {
        return makeCellFrom<TransferGrowthUncommittedHiToContract>(self, TransferGrowthUncommittedHiToContract.store);
    }
}

/**
 > struct (0x4849010c) SetGrowthMigrationTargetAllowed {
 >     targetContract: address
 >     allowed: bool
 > }
 */
export interface SetGrowthMigrationTargetAllowed {
    readonly $: 'SetGrowthMigrationTargetAllowed'
    targetContract: c.Address
    allowed: boolean
}

export const SetGrowthMigrationTargetAllowed = {
    PREFIX: 0x4849010c,

    create(args: {
        targetContract: c.Address
        allowed: boolean
    }): SetGrowthMigrationTargetAllowed {
        return {
            $: 'SetGrowthMigrationTargetAllowed',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetGrowthMigrationTargetAllowed {
        loadAndCheckPrefix32(s, 0x4849010c, 'SetGrowthMigrationTargetAllowed');
        return {
            $: 'SetGrowthMigrationTargetAllowed',
            targetContract: s.loadAddress(),
            allowed: s.loadBoolean(),
        }
    },
    store(self: SetGrowthMigrationTargetAllowed, b: c.Builder): void {
        b.storeUint(0x4849010c, 32);
        b.storeAddress(self.targetContract);
        b.storeBit(self.allowed);
    },
    toCell(self: SetGrowthMigrationTargetAllowed): c.Cell {
        return makeCellFrom<SetGrowthMigrationTargetAllowed>(self, SetGrowthMigrationTargetAllowed.store);
    }
}

/**
 > struct PurchasePosition {
 >     totalLockedHi: coins
 >     claimedHi: coins
 >     entryLevel: uint8
 >     missedHi: coins
 > }
 */
export interface PurchasePosition {
    readonly $: 'PurchasePosition'
    totalLockedHi: coins
    claimedHi: coins
    entryLevel: uint8
    missedHi: coins
}

export const PurchasePosition = {
    create(args: {
        totalLockedHi: coins
        claimedHi: coins
        entryLevel: uint8
        missedHi: coins
    }): PurchasePosition {
        return {
            $: 'PurchasePosition',
            ...args
        }
    },
    fromSlice(s: c.Slice): PurchasePosition {
        return {
            $: 'PurchasePosition',
            totalLockedHi: s.loadCoins(),
            claimedHi: s.loadCoins(),
            entryLevel: s.loadUintBig(8),
            missedHi: s.loadCoins(),
        }
    },
    store(self: PurchasePosition, b: c.Builder): void {
        b.storeCoins(self.totalLockedHi);
        b.storeCoins(self.claimedHi);
        b.storeUint(self.entryLevel, 8);
        b.storeCoins(self.missedHi);
    },
    toCell(self: PurchasePosition): c.Cell {
        return makeCellFrom<PurchasePosition>(self, PurchasePosition.store);
    }
}

/**
 > struct PendingSaleTransfer {
 >     kind: uint8
 >     owner: address
 >     hiAmount: coins
 >     tonAmount: coins
 >     lockedPurchaseHi: coins
 >     missedHi: coins
 > }
 */
export interface PendingSaleTransfer {
    readonly $: 'PendingSaleTransfer'
    kind: uint8
    owner: c.Address
    hiAmount: coins
    tonAmount: coins
    lockedPurchaseHi: coins
    missedHi: coins
}

export const PendingSaleTransfer = {
    create(args: {
        kind: uint8
        owner: c.Address
        hiAmount: coins
        tonAmount: coins
        lockedPurchaseHi: coins
        missedHi: coins
    }): PendingSaleTransfer {
        return {
            $: 'PendingSaleTransfer',
            ...args
        }
    },
    fromSlice(s: c.Slice): PendingSaleTransfer {
        return {
            $: 'PendingSaleTransfer',
            kind: s.loadUintBig(8),
            owner: s.loadAddress(),
            hiAmount: s.loadCoins(),
            tonAmount: s.loadCoins(),
            lockedPurchaseHi: s.loadCoins(),
            missedHi: s.loadCoins(),
        }
    },
    store(self: PendingSaleTransfer, b: c.Builder): void {
        b.storeUint(self.kind, 8);
        b.storeAddress(self.owner);
        b.storeCoins(self.hiAmount);
        b.storeCoins(self.tonAmount);
        b.storeCoins(self.lockedPurchaseHi);
        b.storeCoins(self.missedHi);
    },
    toCell(self: PendingSaleTransfer): c.Cell {
        return makeCellFrom<PendingSaleTransfer>(self, PendingSaleTransfer.store);
    }
}

/**
 > struct GrowthMigrationConfig {
 >     migrationWallet1: address
 >     migrationWallet2: address
 > }
 */
export interface GrowthMigrationConfig {
    readonly $: 'GrowthMigrationConfig'
    migrationWallet1: c.Address
    migrationWallet2: c.Address
}

export const GrowthMigrationConfig = {
    create(args: {
        migrationWallet1: c.Address
        migrationWallet2: c.Address
    }): GrowthMigrationConfig {
        return {
            $: 'GrowthMigrationConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): GrowthMigrationConfig {
        return {
            $: 'GrowthMigrationConfig',
            migrationWallet1: s.loadAddress(),
            migrationWallet2: s.loadAddress(),
        }
    },
    store(self: GrowthMigrationConfig, b: c.Builder): void {
        b.storeAddress(self.migrationWallet1);
        b.storeAddress(self.migrationWallet2);
    },
    toCell(self: GrowthMigrationConfig): c.Cell {
        return makeCellFrom<GrowthMigrationConfig>(self, GrowthMigrationConfig.store);
    }
}

/**
 > struct GrowthEngineConfig {
 >     admin: address
 >     projectFundWallet: address
 >     migration: Cell<GrowthMigrationConfig>
 > }
 */
export interface GrowthEngineConfig {
    readonly $: 'GrowthEngineConfig'
    admin: c.Address
    projectFundWallet: c.Address
    migration: CellRef<GrowthMigrationConfig>
}

export const GrowthEngineConfig = {
    create(args: {
        admin: c.Address
        projectFundWallet: c.Address
        migration: CellRef<GrowthMigrationConfig>
    }): GrowthEngineConfig {
        return {
            $: 'GrowthEngineConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): GrowthEngineConfig {
        return {
            $: 'GrowthEngineConfig',
            admin: s.loadAddress(),
            projectFundWallet: s.loadAddress(),
            migration: loadCellRef<GrowthMigrationConfig>(s, GrowthMigrationConfig.fromSlice),
        }
    },
    store(self: GrowthEngineConfig, b: c.Builder): void {
        b.storeAddress(self.admin);
        b.storeAddress(self.projectFundWallet);
        storeCellRef<GrowthMigrationConfig>(self.migration, b, GrowthMigrationConfig.store);
    },
    toCell(self: GrowthEngineConfig): c.Cell {
        return makeCellFrom<GrowthEngineConfig>(self, GrowthEngineConfig.store);
    }
}

/**
 > struct GrowthEngineStorage {
 >     config: Cell<GrowthEngineConfig>
 >     counters: Cell<GrowthEngineCounters>
 >     maps: Cell<GrowthEngineMaps>
 >     oracle: address
 >     growthJettonWallet: address?
 >     migrationTarget: address?
 >     growthEnabled: bool
 >     permanentlyClosed: bool
 >     growthConfirmedLevel: uint8
 >     nextQueryId: uint64
 > }
 */
export interface GrowthEngineStorage {
    readonly $: 'GrowthEngineStorage'
    config: CellRef<GrowthEngineConfig>
    counters: CellRef<GrowthEngineCounters>
    maps: CellRef<GrowthEngineMaps>
    oracle: c.Address
    growthJettonWallet: c.Address | null
    migrationTarget: c.Address | null
    growthEnabled: boolean
    permanentlyClosed: boolean
    growthConfirmedLevel: uint8
    nextQueryId: uint64
}

export const GrowthEngineStorage = {
    create(args: {
        config: CellRef<GrowthEngineConfig>
        counters: CellRef<GrowthEngineCounters>
        maps: CellRef<GrowthEngineMaps>
        oracle: c.Address
        growthJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        growthEnabled: boolean
        permanentlyClosed: boolean
        growthConfirmedLevel: uint8
        nextQueryId: uint64
    }): GrowthEngineStorage {
        return {
            $: 'GrowthEngineStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): GrowthEngineStorage {
        return {
            $: 'GrowthEngineStorage',
            config: loadCellRef<GrowthEngineConfig>(s, GrowthEngineConfig.fromSlice),
            counters: loadCellRef<GrowthEngineCounters>(s, GrowthEngineCounters.fromSlice),
            maps: loadCellRef<GrowthEngineMaps>(s, GrowthEngineMaps.fromSlice),
            oracle: s.loadAddress(),
            growthJettonWallet: s.loadMaybeAddress(),
            migrationTarget: s.loadMaybeAddress(),
            growthEnabled: s.loadBoolean(),
            permanentlyClosed: s.loadBoolean(),
            growthConfirmedLevel: s.loadUintBig(8),
            nextQueryId: s.loadUintBig(64),
        }
    },
    store(self: GrowthEngineStorage, b: c.Builder): void {
        storeCellRef<GrowthEngineConfig>(self.config, b, GrowthEngineConfig.store);
        storeCellRef<GrowthEngineCounters>(self.counters, b, GrowthEngineCounters.store);
        storeCellRef<GrowthEngineMaps>(self.maps, b, GrowthEngineMaps.store);
        b.storeAddress(self.oracle);
        b.storeAddress(self.growthJettonWallet);
        b.storeAddress(self.migrationTarget);
        b.storeBit(self.growthEnabled);
        b.storeBit(self.permanentlyClosed);
        b.storeUint(self.growthConfirmedLevel, 8);
        b.storeUint(self.nextQueryId, 64);
    },
    toCell(self: GrowthEngineStorage): c.Cell {
        return makeCellFrom<GrowthEngineStorage>(self, GrowthEngineStorage.store);
    }
}

/**
 > struct GrowthEngineMaps {
 >     purchasedTon: map<address, coins>
 >     positions: map<address, PurchasePosition>
 >     pendingTransfers: map<uint64, PendingSaleTransfer>
 >     migrationAllowlist: map<address, bool>
 > }
 */
export interface GrowthEngineMaps {
    readonly $: 'GrowthEngineMaps'
    purchasedTon: c.Dictionary<c.Address, coins>
    positions: c.Dictionary<c.Address, PurchasePosition>
    pendingTransfers: c.Dictionary<uint64, PendingSaleTransfer>
    migrationAllowlist: c.Dictionary<c.Address, boolean>
}

export const GrowthEngineMaps = {
    create(args: {
        purchasedTon: c.Dictionary<c.Address, coins>
        positions: c.Dictionary<c.Address, PurchasePosition>
        pendingTransfers: c.Dictionary<uint64, PendingSaleTransfer>
        migrationAllowlist: c.Dictionary<c.Address, boolean>
    }): GrowthEngineMaps {
        return {
            $: 'GrowthEngineMaps',
            ...args
        }
    },
    fromSlice(s: c.Slice): GrowthEngineMaps {
        return {
            $: 'GrowthEngineMaps',
            purchasedTon: c.Dictionary.load<c.Address, coins>(c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4), s),
            positions: c.Dictionary.load<c.Address, PurchasePosition>(c.Dictionary.Keys.Address(), createDictionaryValue<PurchasePosition>(PurchasePosition.fromSlice, PurchasePosition.store), s),
            pendingTransfers: c.Dictionary.load<uint64, PendingSaleTransfer>(c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingSaleTransfer>(PendingSaleTransfer.fromSlice, PendingSaleTransfer.store), s),
            migrationAllowlist: c.Dictionary.load<c.Address, boolean>(c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool(), s),
        }
    },
    store(self: GrowthEngineMaps, b: c.Builder): void {
        b.storeDict<c.Address, coins>(self.purchasedTon, c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4));
        b.storeDict<c.Address, PurchasePosition>(self.positions, c.Dictionary.Keys.Address(), createDictionaryValue<PurchasePosition>(PurchasePosition.fromSlice, PurchasePosition.store));
        b.storeDict<uint64, PendingSaleTransfer>(self.pendingTransfers, c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingSaleTransfer>(PendingSaleTransfer.fromSlice, PendingSaleTransfer.store));
        b.storeDict<c.Address, boolean>(self.migrationAllowlist, c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool());
    },
    toCell(self: GrowthEngineMaps): c.Cell {
        return makeCellFrom<GrowthEngineMaps>(self, GrowthEngineMaps.store);
    }
}

/**
 > struct GrowthEngineCounters {
 >     growthPoolTotalHi: coins
 >     growthSoldHi: coins
 >     growthClaimedHi: coins
 >     growthMissedHi: coins
 >     growthMigratedHi: coins
 > }
 */
export interface GrowthEngineCounters {
    readonly $: 'GrowthEngineCounters'
    growthPoolTotalHi: coins
    growthSoldHi: coins
    growthClaimedHi: coins
    growthMissedHi: coins
    growthMigratedHi: coins
}

export const GrowthEngineCounters = {
    create(args: {
        growthPoolTotalHi: coins
        growthSoldHi: coins
        growthClaimedHi: coins
        growthMissedHi: coins
        growthMigratedHi: coins
    }): GrowthEngineCounters {
        return {
            $: 'GrowthEngineCounters',
            ...args
        }
    },
    fromSlice(s: c.Slice): GrowthEngineCounters {
        return {
            $: 'GrowthEngineCounters',
            growthPoolTotalHi: s.loadCoins(),
            growthSoldHi: s.loadCoins(),
            growthClaimedHi: s.loadCoins(),
            growthMissedHi: s.loadCoins(),
            growthMigratedHi: s.loadCoins(),
        }
    },
    store(self: GrowthEngineCounters, b: c.Builder): void {
        b.storeCoins(self.growthPoolTotalHi);
        b.storeCoins(self.growthSoldHi);
        b.storeCoins(self.growthClaimedHi);
        b.storeCoins(self.growthMissedHi);
        b.storeCoins(self.growthMigratedHi);
    },
    toCell(self: GrowthEngineCounters): c.Cell {
        return makeCellFrom<GrowthEngineCounters>(self, GrowthEngineCounters.store);
    }
}

// ————————————————————————————————————————————
//    class GrowthEngine
//

interface ExtraSendOptions {
    bounce?: boolean                    // default: false
    sendMode?: SendMode                 // default: SendMode.PAY_GAS_SEPARATELY
    extraCurrencies?: c.ExtraCurrency   // default: empty dict
}

interface DeployedAddrOptions {
    workchain?: number                  // default: 0 (basechain)
    toShard?: { fixedPrefixLength: number; closeTo: c.Address }
    overrideContractCode?: c.Cell
}

function calculateDeployedAddress(code: c.Cell, data: c.Cell, options: DeployedAddrOptions): c.Address {
    const stateInitCell = beginCell().store(c.storeStateInit({
        code,
        data,
        splitDepth: options.toShard?.fixedPrefixLength,
        special: null,
        libraries: null,
    })).endCell();

    let addrHash = stateInitCell.hash();
    if (options.toShard) {
        const shardDepth = options.toShard.fixedPrefixLength;
        addrHash = beginCell()
            .storeBits(new c.BitString(options.toShard.closeTo.hash, 0, shardDepth))
            .storeBits(new c.BitString(stateInitCell.hash(), shardDepth, 256 - shardDepth))
            .endCell()
            .beginParse().loadBuffer(32);
    }

    return new c.Address(options.workchain ?? 0, addrHash);
}

export class GrowthEngine implements c.Contract {
    static CodeCell = c.Cell.fromBase64('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');

    static Errors = {
        'Errors.InvalidMessage': 49,
        'Errors.NotAdmin': 100,
        'Errors.SaleClosed': 200,
        'Errors.BelowMinimum': 201,
        'Errors.WalletCapExceeded': 202,
        'Errors.PoolPaused': 203,
        'Errors.InsufficientInventory': 204,
        'Errors.NoClaimableAmount': 205,
        'Errors.InvalidLevel': 206,
        'Errors.InsufficientAttachedTon': 214,
        'Errors.JettonWalletNotConfigured': 215,
        'Errors.MigrationTargetNotAllowed': 220,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new GrowthEngine(address);
    }

    static fromStorage(emptyStorage: {
        config: CellRef<GrowthEngineConfig>
        counters: CellRef<GrowthEngineCounters>
        maps: CellRef<GrowthEngineMaps>
        oracle: c.Address
        growthJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        growthEnabled: boolean
        permanentlyClosed: boolean
        growthConfirmedLevel: uint8
        nextQueryId: uint64
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? GrowthEngine.CodeCell,
            data: GrowthEngineStorage.toCell(GrowthEngineStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new GrowthEngine(address, initialState);
    }

    static createCellOfBuyGrowth(body: {
        tonAmount: coins
    }) {
        return BuyGrowth.toCell(BuyGrowth.create(body));
    }

    static createCellOfClaimGrowth(body: {
    }) {
        return ClaimGrowth.toCell(ClaimGrowth.create());
    }

    static createCellOfSetGrowthEnabled(body: {
        enabled: boolean
    }) {
        return SetGrowthEnabled.toCell(SetGrowthEnabled.create(body));
    }

    static createCellOfSetGrowthConfirmedLevel(body: {
        growthConfirmedLevel: uint8
    }) {
        return SetGrowthConfirmedLevel.toCell(SetGrowthConfirmedLevel.create(body));
    }

    static createCellOfCloseGrowthEngine(body: {
    }) {
        return CloseGrowthEngine.toCell(CloseGrowthEngine.create());
    }

    static createCellOfSweepGrowthProjectFund(body: {
    }) {
        return SweepGrowthProjectFund.toCell(SweepGrowthProjectFund.create());
    }

    static createCellOfWithdrawGrowthTons(body: {
        amount: coins
    }) {
        return WithdrawGrowthTons.toCell(WithdrawGrowthTons.create(body));
    }

    static createCellOfSetGrowthJettonWallet(body: {
        growthJettonWallet: c.Address
    }) {
        return SetGrowthJettonWallet.toCell(SetGrowthJettonWallet.create(body));
    }

    static createCellOfSetGrowthMigrationTargetAllowed(body: {
        targetContract: c.Address
        allowed: boolean
    }) {
        return SetGrowthMigrationTargetAllowed.toCell(SetGrowthMigrationTargetAllowed.create(body));
    }

    static createCellOfSetGrowthMigrationTarget(body: {
        targetContract: c.Address
    }) {
        return SetGrowthMigrationTarget.toCell(SetGrowthMigrationTarget.create(body));
    }

    static createCellOfTransferGrowthUncommittedHiToContract(body: {
        amount: coins
    }) {
        return TransferGrowthUncommittedHiToContract.toCell(TransferGrowthUncommittedHiToContract.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendBuyGrowth(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        tonAmount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: BuyGrowth.toCell(BuyGrowth.create(body)),
            ...extraOptions
        });
    }

    async sendClaimGrowth(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ClaimGrowth.toCell(ClaimGrowth.create()),
            ...extraOptions
        });
    }

    async sendSetGrowthEnabled(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        enabled: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetGrowthEnabled.toCell(SetGrowthEnabled.create(body)),
            ...extraOptions
        });
    }

    async sendSetGrowthConfirmedLevel(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        growthConfirmedLevel: uint8
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetGrowthConfirmedLevel.toCell(SetGrowthConfirmedLevel.create(body)),
            ...extraOptions
        });
    }

    async sendCloseGrowthEngine(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: CloseGrowthEngine.toCell(CloseGrowthEngine.create()),
            ...extraOptions
        });
    }

    async sendSweepGrowthProjectFund(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SweepGrowthProjectFund.toCell(SweepGrowthProjectFund.create()),
            ...extraOptions
        });
    }

    async sendWithdrawGrowthTons(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: WithdrawGrowthTons.toCell(WithdrawGrowthTons.create(body)),
            ...extraOptions
        });
    }

    async sendSetGrowthJettonWallet(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        growthJettonWallet: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetGrowthJettonWallet.toCell(SetGrowthJettonWallet.create(body)),
            ...extraOptions
        });
    }

    async sendSetGrowthMigrationTargetAllowed(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
        allowed: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetGrowthMigrationTargetAllowed.toCell(SetGrowthMigrationTargetAllowed.create(body)),
            ...extraOptions
        });
    }

    async sendSetGrowthMigrationTarget(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetGrowthMigrationTarget.toCell(SetGrowthMigrationTarget.create(body)),
            ...extraOptions
        });
    }

    async sendTransferGrowthUncommittedHiToContract(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TransferGrowthUncommittedHiToContract.toCell(TransferGrowthUncommittedHiToContract.create(body)),
            ...extraOptions
        });
    }

    async getBuyerState(provider: ContractProvider, owner: c.Address): Promise<[
        coins,
        coins,
        uint8,
        coins,
        coins,
    ]> {
        const r = StackReader.fromGetMethod(5, await provider.get('buyer_state', [
            { type: 'slice', cell: makeCellFrom<c.Address>(owner,
                (v,b) => b.storeAddress(v)
            ) },
        ]));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }

    async getGrowthState(provider: ContractProvider): Promise<[
        uint8,
        coins,
        coins,
        coins,
        coins,
        coins,
    ]> {
        const r = StackReader.fromGetMethod(6, await provider.get('growth_state', []));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }
}
