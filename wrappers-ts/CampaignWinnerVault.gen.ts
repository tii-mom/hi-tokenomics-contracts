// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a CampaignWinnerVault contract in Tolk.
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
type uint16 = bigint
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
 > struct (0x48490501) RegisterCampaignWinner {
 >     winner: address
 > }
 */
export interface RegisterCampaignWinner {
    readonly $: 'RegisterCampaignWinner'
    winner: c.Address
}

export const RegisterCampaignWinner = {
    PREFIX: 0x48490501,

    create(args: {
        winner: c.Address
    }): RegisterCampaignWinner {
        return {
            $: 'RegisterCampaignWinner',
            ...args
        }
    },
    fromSlice(s: c.Slice): RegisterCampaignWinner {
        loadAndCheckPrefix32(s, 0x48490501, 'RegisterCampaignWinner');
        return {
            $: 'RegisterCampaignWinner',
            winner: s.loadAddress(),
        }
    },
    store(self: RegisterCampaignWinner, b: c.Builder): void {
        b.storeUint(0x48490501, 32);
        b.storeAddress(self.winner);
    },
    toCell(self: RegisterCampaignWinner): c.Cell {
        return makeCellFrom<RegisterCampaignWinner>(self, RegisterCampaignWinner.store);
    }
}

/**
 > struct (0x48490502) ClaimCampaignWinner {
 > }
 */
export interface ClaimCampaignWinner {
    readonly $: 'ClaimCampaignWinner'
}

export const ClaimCampaignWinner = {
    PREFIX: 0x48490502,

    create(): ClaimCampaignWinner {
        return {
            $: 'ClaimCampaignWinner',
        }
    },
    fromSlice(s: c.Slice): ClaimCampaignWinner {
        loadAndCheckPrefix32(s, 0x48490502, 'ClaimCampaignWinner');
        return {
            $: 'ClaimCampaignWinner',
        }
    },
    store(self: ClaimCampaignWinner, b: c.Builder): void {
        b.storeUint(0x48490502, 32);
    },
    toCell(self: ClaimCampaignWinner): c.Cell {
        return makeCellFrom<ClaimCampaignWinner>(self, ClaimCampaignWinner.store);
    }
}

/**
 > struct (0x48490503) SetCampaignWinnerJettonWallet {
 >     winnerJettonWallet: address
 > }
 */
export interface SetCampaignWinnerJettonWallet {
    readonly $: 'SetCampaignWinnerJettonWallet'
    winnerJettonWallet: c.Address
}

export const SetCampaignWinnerJettonWallet = {
    PREFIX: 0x48490503,

    create(args: {
        winnerJettonWallet: c.Address
    }): SetCampaignWinnerJettonWallet {
        return {
            $: 'SetCampaignWinnerJettonWallet',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetCampaignWinnerJettonWallet {
        loadAndCheckPrefix32(s, 0x48490503, 'SetCampaignWinnerJettonWallet');
        return {
            $: 'SetCampaignWinnerJettonWallet',
            winnerJettonWallet: s.loadAddress(),
        }
    },
    store(self: SetCampaignWinnerJettonWallet, b: c.Builder): void {
        b.storeUint(0x48490503, 32);
        b.storeAddress(self.winnerJettonWallet);
    },
    toCell(self: SetCampaignWinnerJettonWallet): c.Cell {
        return makeCellFrom<SetCampaignWinnerJettonWallet>(self, SetCampaignWinnerJettonWallet.store);
    }
}

/**
 > struct (0x48490504) SetCampaignMigrationTarget {
 >     targetContract: address
 > }
 */
export interface SetCampaignMigrationTarget {
    readonly $: 'SetCampaignMigrationTarget'
    targetContract: c.Address
}

export const SetCampaignMigrationTarget = {
    PREFIX: 0x48490504,

    create(args: {
        targetContract: c.Address
    }): SetCampaignMigrationTarget {
        return {
            $: 'SetCampaignMigrationTarget',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetCampaignMigrationTarget {
        loadAndCheckPrefix32(s, 0x48490504, 'SetCampaignMigrationTarget');
        return {
            $: 'SetCampaignMigrationTarget',
            targetContract: s.loadAddress(),
        }
    },
    store(self: SetCampaignMigrationTarget, b: c.Builder): void {
        b.storeUint(0x48490504, 32);
        b.storeAddress(self.targetContract);
    },
    toCell(self: SetCampaignMigrationTarget): c.Cell {
        return makeCellFrom<SetCampaignMigrationTarget>(self, SetCampaignMigrationTarget.store);
    }
}

/**
 > struct (0x48490505) TransferCampaignUncommittedHiToContract {
 >     amount: coins
 > }
 */
export interface TransferCampaignUncommittedHiToContract {
    readonly $: 'TransferCampaignUncommittedHiToContract'
    amount: coins
}

export const TransferCampaignUncommittedHiToContract = {
    PREFIX: 0x48490505,

    create(args: {
        amount: coins
    }): TransferCampaignUncommittedHiToContract {
        return {
            $: 'TransferCampaignUncommittedHiToContract',
            ...args
        }
    },
    fromSlice(s: c.Slice): TransferCampaignUncommittedHiToContract {
        loadAndCheckPrefix32(s, 0x48490505, 'TransferCampaignUncommittedHiToContract');
        return {
            $: 'TransferCampaignUncommittedHiToContract',
            amount: s.loadCoins(),
        }
    },
    store(self: TransferCampaignUncommittedHiToContract, b: c.Builder): void {
        b.storeUint(0x48490505, 32);
        b.storeCoins(self.amount);
    },
    toCell(self: TransferCampaignUncommittedHiToContract): c.Cell {
        return makeCellFrom<TransferCampaignUncommittedHiToContract>(self, TransferCampaignUncommittedHiToContract.store);
    }
}

/**
 > struct (0x48490506) SetCampaignMigrationTargetAllowed {
 >     targetContract: address
 >     allowed: bool
 > }
 */
export interface SetCampaignMigrationTargetAllowed {
    readonly $: 'SetCampaignMigrationTargetAllowed'
    targetContract: c.Address
    allowed: boolean
}

export const SetCampaignMigrationTargetAllowed = {
    PREFIX: 0x48490506,

    create(args: {
        targetContract: c.Address
        allowed: boolean
    }): SetCampaignMigrationTargetAllowed {
        return {
            $: 'SetCampaignMigrationTargetAllowed',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetCampaignMigrationTargetAllowed {
        loadAndCheckPrefix32(s, 0x48490506, 'SetCampaignMigrationTargetAllowed');
        return {
            $: 'SetCampaignMigrationTargetAllowed',
            targetContract: s.loadAddress(),
            allowed: s.loadBoolean(),
        }
    },
    store(self: SetCampaignMigrationTargetAllowed, b: c.Builder): void {
        b.storeUint(0x48490506, 32);
        b.storeAddress(self.targetContract);
        b.storeBit(self.allowed);
    },
    toCell(self: SetCampaignMigrationTargetAllowed): c.Cell {
        return makeCellFrom<SetCampaignMigrationTargetAllowed>(self, SetCampaignMigrationTargetAllowed.store);
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
 > struct CampaignWinnerPosition {
 >     entryLevel: uint8
 >     claimedHi: coins
 > }
 */
export interface CampaignWinnerPosition {
    readonly $: 'CampaignWinnerPosition'
    entryLevel: uint8
    claimedHi: coins
}

export const CampaignWinnerPosition = {
    create(args: {
        entryLevel: uint8
        claimedHi: coins
    }): CampaignWinnerPosition {
        return {
            $: 'CampaignWinnerPosition',
            ...args
        }
    },
    fromSlice(s: c.Slice): CampaignWinnerPosition {
        return {
            $: 'CampaignWinnerPosition',
            entryLevel: s.loadUintBig(8),
            claimedHi: s.loadCoins(),
        }
    },
    store(self: CampaignWinnerPosition, b: c.Builder): void {
        b.storeUint(self.entryLevel, 8);
        b.storeCoins(self.claimedHi);
    },
    toCell(self: CampaignWinnerPosition): c.Cell {
        return makeCellFrom<CampaignWinnerPosition>(self, CampaignWinnerPosition.store);
    }
}

/**
 > struct PendingCampaignWinnerTransfer {
 >     kind: uint8
 >     winner: address
 >     amount: coins
 > }
 */
export interface PendingCampaignWinnerTransfer {
    readonly $: 'PendingCampaignWinnerTransfer'
    kind: uint8
    winner: c.Address
    amount: coins
}

export const PendingCampaignWinnerTransfer = {
    create(args: {
        kind: uint8
        winner: c.Address
        amount: coins
    }): PendingCampaignWinnerTransfer {
        return {
            $: 'PendingCampaignWinnerTransfer',
            ...args
        }
    },
    fromSlice(s: c.Slice): PendingCampaignWinnerTransfer {
        return {
            $: 'PendingCampaignWinnerTransfer',
            kind: s.loadUintBig(8),
            winner: s.loadAddress(),
            amount: s.loadCoins(),
        }
    },
    store(self: PendingCampaignWinnerTransfer, b: c.Builder): void {
        b.storeUint(self.kind, 8);
        b.storeAddress(self.winner);
        b.storeCoins(self.amount);
    },
    toCell(self: PendingCampaignWinnerTransfer): c.Cell {
        return makeCellFrom<PendingCampaignWinnerTransfer>(self, PendingCampaignWinnerTransfer.store);
    }
}

/**
 > struct CampaignWinnerConfig {
 >     admin: address
 >     migration: Cell<GrowthMigrationConfig>
 > }
 */
export interface CampaignWinnerConfig {
    readonly $: 'CampaignWinnerConfig'
    admin: c.Address
    migration: CellRef<GrowthMigrationConfig>
}

export const CampaignWinnerConfig = {
    create(args: {
        admin: c.Address
        migration: CellRef<GrowthMigrationConfig>
    }): CampaignWinnerConfig {
        return {
            $: 'CampaignWinnerConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): CampaignWinnerConfig {
        return {
            $: 'CampaignWinnerConfig',
            admin: s.loadAddress(),
            migration: loadCellRef<GrowthMigrationConfig>(s, GrowthMigrationConfig.fromSlice),
        }
    },
    store(self: CampaignWinnerConfig, b: c.Builder): void {
        b.storeAddress(self.admin);
        storeCellRef<GrowthMigrationConfig>(self.migration, b, GrowthMigrationConfig.store);
    },
    toCell(self: CampaignWinnerConfig): c.Cell {
        return makeCellFrom<CampaignWinnerConfig>(self, CampaignWinnerConfig.store);
    }
}

/**
 > struct CampaignWinnerStorage {
 >     config: Cell<CampaignWinnerConfig>
 >     counters: Cell<CampaignWinnerCounters>
 >     maps: Cell<CampaignWinnerMaps>
 >     oracle: address
 >     winnerJettonWallet: address?
 >     migrationTarget: address?
 >     growthConfirmedLevel: uint8
 >     nextQueryId: uint64
 > }
 */
export interface CampaignWinnerStorage {
    readonly $: 'CampaignWinnerStorage'
    config: CellRef<CampaignWinnerConfig>
    counters: CellRef<CampaignWinnerCounters>
    maps: CellRef<CampaignWinnerMaps>
    oracle: c.Address
    winnerJettonWallet: c.Address | null
    migrationTarget: c.Address | null
    growthConfirmedLevel: uint8
    nextQueryId: uint64
}

export const CampaignWinnerStorage = {
    create(args: {
        config: CellRef<CampaignWinnerConfig>
        counters: CellRef<CampaignWinnerCounters>
        maps: CellRef<CampaignWinnerMaps>
        oracle: c.Address
        winnerJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        growthConfirmedLevel: uint8
        nextQueryId: uint64
    }): CampaignWinnerStorage {
        return {
            $: 'CampaignWinnerStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): CampaignWinnerStorage {
        return {
            $: 'CampaignWinnerStorage',
            config: loadCellRef<CampaignWinnerConfig>(s, CampaignWinnerConfig.fromSlice),
            counters: loadCellRef<CampaignWinnerCounters>(s, CampaignWinnerCounters.fromSlice),
            maps: loadCellRef<CampaignWinnerMaps>(s, CampaignWinnerMaps.fromSlice),
            oracle: s.loadAddress(),
            winnerJettonWallet: s.loadMaybeAddress(),
            migrationTarget: s.loadMaybeAddress(),
            growthConfirmedLevel: s.loadUintBig(8),
            nextQueryId: s.loadUintBig(64),
        }
    },
    store(self: CampaignWinnerStorage, b: c.Builder): void {
        storeCellRef<CampaignWinnerConfig>(self.config, b, CampaignWinnerConfig.store);
        storeCellRef<CampaignWinnerCounters>(self.counters, b, CampaignWinnerCounters.store);
        storeCellRef<CampaignWinnerMaps>(self.maps, b, CampaignWinnerMaps.store);
        b.storeAddress(self.oracle);
        b.storeAddress(self.winnerJettonWallet);
        b.storeAddress(self.migrationTarget);
        b.storeUint(self.growthConfirmedLevel, 8);
        b.storeUint(self.nextQueryId, 64);
    },
    toCell(self: CampaignWinnerStorage): c.Cell {
        return makeCellFrom<CampaignWinnerStorage>(self, CampaignWinnerStorage.store);
    }
}

/**
 > struct CampaignWinnerCounters {
 >     winnerCount: uint16
 >     totalClaimedHi: coins
 >     migratedHi: coins
 > }
 */
export interface CampaignWinnerCounters {
    readonly $: 'CampaignWinnerCounters'
    winnerCount: uint16
    totalClaimedHi: coins
    migratedHi: coins
}

export const CampaignWinnerCounters = {
    create(args: {
        winnerCount: uint16
        totalClaimedHi: coins
        migratedHi: coins
    }): CampaignWinnerCounters {
        return {
            $: 'CampaignWinnerCounters',
            ...args
        }
    },
    fromSlice(s: c.Slice): CampaignWinnerCounters {
        return {
            $: 'CampaignWinnerCounters',
            winnerCount: s.loadUintBig(16),
            totalClaimedHi: s.loadCoins(),
            migratedHi: s.loadCoins(),
        }
    },
    store(self: CampaignWinnerCounters, b: c.Builder): void {
        b.storeUint(self.winnerCount, 16);
        b.storeCoins(self.totalClaimedHi);
        b.storeCoins(self.migratedHi);
    },
    toCell(self: CampaignWinnerCounters): c.Cell {
        return makeCellFrom<CampaignWinnerCounters>(self, CampaignWinnerCounters.store);
    }
}

/**
 > struct CampaignWinnerMaps {
 >     winners: map<address, CampaignWinnerPosition>
 >     pendingTransfers: map<uint64, PendingCampaignWinnerTransfer>
 >     migrationAllowlist: map<address, bool>
 > }
 */
export interface CampaignWinnerMaps {
    readonly $: 'CampaignWinnerMaps'
    winners: c.Dictionary<c.Address, CampaignWinnerPosition>
    pendingTransfers: c.Dictionary<uint64, PendingCampaignWinnerTransfer>
    migrationAllowlist: c.Dictionary<c.Address, boolean>
}

export const CampaignWinnerMaps = {
    create(args: {
        winners: c.Dictionary<c.Address, CampaignWinnerPosition>
        pendingTransfers: c.Dictionary<uint64, PendingCampaignWinnerTransfer>
        migrationAllowlist: c.Dictionary<c.Address, boolean>
    }): CampaignWinnerMaps {
        return {
            $: 'CampaignWinnerMaps',
            ...args
        }
    },
    fromSlice(s: c.Slice): CampaignWinnerMaps {
        return {
            $: 'CampaignWinnerMaps',
            winners: c.Dictionary.load<c.Address, CampaignWinnerPosition>(c.Dictionary.Keys.Address(), createDictionaryValue<CampaignWinnerPosition>(CampaignWinnerPosition.fromSlice, CampaignWinnerPosition.store), s),
            pendingTransfers: c.Dictionary.load<uint64, PendingCampaignWinnerTransfer>(c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingCampaignWinnerTransfer>(PendingCampaignWinnerTransfer.fromSlice, PendingCampaignWinnerTransfer.store), s),
            migrationAllowlist: c.Dictionary.load<c.Address, boolean>(c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool(), s),
        }
    },
    store(self: CampaignWinnerMaps, b: c.Builder): void {
        b.storeDict<c.Address, CampaignWinnerPosition>(self.winners, c.Dictionary.Keys.Address(), createDictionaryValue<CampaignWinnerPosition>(CampaignWinnerPosition.fromSlice, CampaignWinnerPosition.store));
        b.storeDict<uint64, PendingCampaignWinnerTransfer>(self.pendingTransfers, c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingCampaignWinnerTransfer>(PendingCampaignWinnerTransfer.fromSlice, PendingCampaignWinnerTransfer.store));
        b.storeDict<c.Address, boolean>(self.migrationAllowlist, c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool());
    },
    toCell(self: CampaignWinnerMaps): c.Cell {
        return makeCellFrom<CampaignWinnerMaps>(self, CampaignWinnerMaps.store);
    }
}

// ————————————————————————————————————————————
//    class CampaignWinnerVault
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

export class CampaignWinnerVault implements c.Contract {
    static CodeCell = c.Cell.fromBase64('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');

    static Errors = {
        'Errors.InvalidMessage': 49,
        'Errors.NotAdmin': 100,
        'Errors.InsufficientInventory': 204,
        'Errors.NoClaimableAmount': 205,
        'Errors.InvalidLevel': 206,
        'Errors.InsufficientAttachedTon': 214,
        'Errors.JettonWalletNotConfigured': 215,
        'Errors.WinnerExists': 216,
        'Errors.WinnerMissing': 217,
        'Errors.WinnerLimitExceeded': 218,
        'Errors.MigrationTargetNotAllowed': 220,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new CampaignWinnerVault(address);
    }

    static fromStorage(emptyStorage: {
        config: CellRef<CampaignWinnerConfig>
        counters: CellRef<CampaignWinnerCounters>
        maps: CellRef<CampaignWinnerMaps>
        oracle: c.Address
        winnerJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        growthConfirmedLevel: uint8
        nextQueryId: uint64
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? CampaignWinnerVault.CodeCell,
            data: CampaignWinnerStorage.toCell(CampaignWinnerStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new CampaignWinnerVault(address, initialState);
    }

    static createCellOfRegisterCampaignWinner(body: {
        winner: c.Address
    }) {
        return RegisterCampaignWinner.toCell(RegisterCampaignWinner.create(body));
    }

    static createCellOfClaimCampaignWinner(body: {
    }) {
        return ClaimCampaignWinner.toCell(ClaimCampaignWinner.create());
    }

    static createCellOfSetCampaignWinnerJettonWallet(body: {
        winnerJettonWallet: c.Address
    }) {
        return SetCampaignWinnerJettonWallet.toCell(SetCampaignWinnerJettonWallet.create(body));
    }

    static createCellOfSetGrowthConfirmedLevel(body: {
        growthConfirmedLevel: uint8
    }) {
        return SetGrowthConfirmedLevel.toCell(SetGrowthConfirmedLevel.create(body));
    }

    static createCellOfSetCampaignMigrationTargetAllowed(body: {
        targetContract: c.Address
        allowed: boolean
    }) {
        return SetCampaignMigrationTargetAllowed.toCell(SetCampaignMigrationTargetAllowed.create(body));
    }

    static createCellOfSetCampaignMigrationTarget(body: {
        targetContract: c.Address
    }) {
        return SetCampaignMigrationTarget.toCell(SetCampaignMigrationTarget.create(body));
    }

    static createCellOfTransferCampaignUncommittedHiToContract(body: {
        amount: coins
    }) {
        return TransferCampaignUncommittedHiToContract.toCell(TransferCampaignUncommittedHiToContract.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendRegisterCampaignWinner(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        winner: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: RegisterCampaignWinner.toCell(RegisterCampaignWinner.create(body)),
            ...extraOptions
        });
    }

    async sendClaimCampaignWinner(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ClaimCampaignWinner.toCell(ClaimCampaignWinner.create()),
            ...extraOptions
        });
    }

    async sendSetCampaignWinnerJettonWallet(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        winnerJettonWallet: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetCampaignWinnerJettonWallet.toCell(SetCampaignWinnerJettonWallet.create(body)),
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

    async sendSetCampaignMigrationTargetAllowed(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
        allowed: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetCampaignMigrationTargetAllowed.toCell(SetCampaignMigrationTargetAllowed.create(body)),
            ...extraOptions
        });
    }

    async sendSetCampaignMigrationTarget(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetCampaignMigrationTarget.toCell(SetCampaignMigrationTarget.create(body)),
            ...extraOptions
        });
    }

    async sendTransferCampaignUncommittedHiToContract(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TransferCampaignUncommittedHiToContract.toCell(TransferCampaignUncommittedHiToContract.create(body)),
            ...extraOptions
        });
    }

    async getWinnerState(provider: ContractProvider, winner: c.Address): Promise<[
        boolean,
        uint8,
        coins,
        coins,
    ]> {
        const r = StackReader.fromGetMethod(4, await provider.get('winner_state', [
            { type: 'slice', cell: makeCellFrom<c.Address>(winner,
                (v,b) => b.storeAddress(v)
            ) },
        ]));
        return [
            r.readBoolean(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }

    async getVaultState(provider: ContractProvider): Promise<[
        uint8,
        uint16,
        coins,
        coins,
    ]> {
        const r = StackReader.fromGetMethod(4, await provider.get('vault_state', []));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }

    async getClaimable(provider: ContractProvider, winner: c.Address): Promise<coins> {
        const r = StackReader.fromGetMethod(1, await provider.get('claimable', [
            { type: 'slice', cell: makeCellFrom<c.Address>(winner,
                (v,b) => b.storeAddress(v)
            ) },
        ]));
        return r.readBigInt();
    }

    async getGrowthConfirmedLevel(provider: ContractProvider): Promise<uint8> {
        const r = StackReader.fromGetMethod(1, await provider.get('growth_confirmed_level', []));
        return r.readBigInt();
    }
}
