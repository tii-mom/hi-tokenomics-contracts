// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a MerkleRewardVault contract in Tolk.
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
type uint256 = bigint

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
 > struct (0x48490401) CreateRewardBatch {
 >     batchId: uint64
 >     root: uint256
 >     totalHi: coins
 >     metadataHash: uint256
 >     poolType: uint8
 >     requiredGrowthLevel: uint8
 > }
 */
export interface CreateRewardBatch {
    readonly $: 'CreateRewardBatch'
    batchId: uint64
    root: uint256
    totalHi: coins
    metadataHash: uint256
    poolType: uint8
    requiredGrowthLevel: uint8
}

export const CreateRewardBatch = {
    PREFIX: 0x48490401,

    create(args: {
        batchId: uint64
        root: uint256
        totalHi: coins
        metadataHash: uint256
        poolType: uint8
        requiredGrowthLevel: uint8
    }): CreateRewardBatch {
        return {
            $: 'CreateRewardBatch',
            ...args
        }
    },
    fromSlice(s: c.Slice): CreateRewardBatch {
        loadAndCheckPrefix32(s, 0x48490401, 'CreateRewardBatch');
        return {
            $: 'CreateRewardBatch',
            batchId: s.loadUintBig(64),
            root: s.loadUintBig(256),
            totalHi: s.loadCoins(),
            metadataHash: s.loadUintBig(256),
            poolType: s.loadUintBig(8),
            requiredGrowthLevel: s.loadUintBig(8),
        }
    },
    store(self: CreateRewardBatch, b: c.Builder): void {
        b.storeUint(0x48490401, 32);
        b.storeUint(self.batchId, 64);
        b.storeUint(self.root, 256);
        b.storeCoins(self.totalHi);
        b.storeUint(self.metadataHash, 256);
        b.storeUint(self.poolType, 8);
        b.storeUint(self.requiredGrowthLevel, 8);
    },
    toCell(self: CreateRewardBatch): c.Cell {
        return makeCellFrom<CreateRewardBatch>(self, CreateRewardBatch.store);
    }
}

/**
 > struct (0x48490402) ClaimReward {
 >     batchId: uint64
 >     amount: coins
 >     proof: cell
 > }
 */
export interface ClaimReward {
    readonly $: 'ClaimReward'
    batchId: uint64
    amount: coins
    proof: c.Cell
}

export const ClaimReward = {
    PREFIX: 0x48490402,

    create(args: {
        batchId: uint64
        amount: coins
        proof: c.Cell
    }): ClaimReward {
        return {
            $: 'ClaimReward',
            ...args
        }
    },
    fromSlice(s: c.Slice): ClaimReward {
        loadAndCheckPrefix32(s, 0x48490402, 'ClaimReward');
        return {
            $: 'ClaimReward',
            batchId: s.loadUintBig(64),
            amount: s.loadCoins(),
            proof: s.loadRef(),
        }
    },
    store(self: ClaimReward, b: c.Builder): void {
        b.storeUint(0x48490402, 32);
        b.storeUint(self.batchId, 64);
        b.storeCoins(self.amount);
        b.storeRef(self.proof);
    },
    toCell(self: ClaimReward): c.Cell {
        return makeCellFrom<ClaimReward>(self, ClaimReward.store);
    }
}

/**
 > struct (0x48490403) SetRewardJettonWallet {
 >     rewardJettonWallet: address
 > }
 */
export interface SetRewardJettonWallet {
    readonly $: 'SetRewardJettonWallet'
    rewardJettonWallet: c.Address
}

export const SetRewardJettonWallet = {
    PREFIX: 0x48490403,

    create(args: {
        rewardJettonWallet: c.Address
    }): SetRewardJettonWallet {
        return {
            $: 'SetRewardJettonWallet',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetRewardJettonWallet {
        loadAndCheckPrefix32(s, 0x48490403, 'SetRewardJettonWallet');
        return {
            $: 'SetRewardJettonWallet',
            rewardJettonWallet: s.loadAddress(),
        }
    },
    store(self: SetRewardJettonWallet, b: c.Builder): void {
        b.storeUint(0x48490403, 32);
        b.storeAddress(self.rewardJettonWallet);
    },
    toCell(self: SetRewardJettonWallet): c.Cell {
        return makeCellFrom<SetRewardJettonWallet>(self, SetRewardJettonWallet.store);
    }
}

/**
 > struct (0x48490404) SetRewardGrowthLevel {
 >     growthConfirmedLevel: uint8
 > }
 */
export interface SetRewardGrowthLevel {
    readonly $: 'SetRewardGrowthLevel'
    growthConfirmedLevel: uint8
}

export const SetRewardGrowthLevel = {
    PREFIX: 0x48490404,

    create(args: {
        growthConfirmedLevel: uint8
    }): SetRewardGrowthLevel {
        return {
            $: 'SetRewardGrowthLevel',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetRewardGrowthLevel {
        loadAndCheckPrefix32(s, 0x48490404, 'SetRewardGrowthLevel');
        return {
            $: 'SetRewardGrowthLevel',
            growthConfirmedLevel: s.loadUintBig(8),
        }
    },
    store(self: SetRewardGrowthLevel, b: c.Builder): void {
        b.storeUint(0x48490404, 32);
        b.storeUint(self.growthConfirmedLevel, 8);
    },
    toCell(self: SetRewardGrowthLevel): c.Cell {
        return makeCellFrom<SetRewardGrowthLevel>(self, SetRewardGrowthLevel.store);
    }
}

/**
 > struct (0x48490405) SetRewardMigrationTarget {
 >     targetContract: address
 > }
 */
export interface SetRewardMigrationTarget {
    readonly $: 'SetRewardMigrationTarget'
    targetContract: c.Address
}

export const SetRewardMigrationTarget = {
    PREFIX: 0x48490405,

    create(args: {
        targetContract: c.Address
    }): SetRewardMigrationTarget {
        return {
            $: 'SetRewardMigrationTarget',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetRewardMigrationTarget {
        loadAndCheckPrefix32(s, 0x48490405, 'SetRewardMigrationTarget');
        return {
            $: 'SetRewardMigrationTarget',
            targetContract: s.loadAddress(),
        }
    },
    store(self: SetRewardMigrationTarget, b: c.Builder): void {
        b.storeUint(0x48490405, 32);
        b.storeAddress(self.targetContract);
    },
    toCell(self: SetRewardMigrationTarget): c.Cell {
        return makeCellFrom<SetRewardMigrationTarget>(self, SetRewardMigrationTarget.store);
    }
}

/**
 > struct (0x48490406) TransferRewardUncommittedHiToContract {
 >     amount: coins
 > }
 */
export interface TransferRewardUncommittedHiToContract {
    readonly $: 'TransferRewardUncommittedHiToContract'
    amount: coins
}

export const TransferRewardUncommittedHiToContract = {
    PREFIX: 0x48490406,

    create(args: {
        amount: coins
    }): TransferRewardUncommittedHiToContract {
        return {
            $: 'TransferRewardUncommittedHiToContract',
            ...args
        }
    },
    fromSlice(s: c.Slice): TransferRewardUncommittedHiToContract {
        loadAndCheckPrefix32(s, 0x48490406, 'TransferRewardUncommittedHiToContract');
        return {
            $: 'TransferRewardUncommittedHiToContract',
            amount: s.loadCoins(),
        }
    },
    store(self: TransferRewardUncommittedHiToContract, b: c.Builder): void {
        b.storeUint(0x48490406, 32);
        b.storeCoins(self.amount);
    },
    toCell(self: TransferRewardUncommittedHiToContract): c.Cell {
        return makeCellFrom<TransferRewardUncommittedHiToContract>(self, TransferRewardUncommittedHiToContract.store);
    }
}

/**
 > struct (0x48490407) SetRewardMigrationTargetAllowed {
 >     targetContract: address
 >     allowed: bool
 > }
 */
export interface SetRewardMigrationTargetAllowed {
    readonly $: 'SetRewardMigrationTargetAllowed'
    targetContract: c.Address
    allowed: boolean
}

export const SetRewardMigrationTargetAllowed = {
    PREFIX: 0x48490407,

    create(args: {
        targetContract: c.Address
        allowed: boolean
    }): SetRewardMigrationTargetAllowed {
        return {
            $: 'SetRewardMigrationTargetAllowed',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetRewardMigrationTargetAllowed {
        loadAndCheckPrefix32(s, 0x48490407, 'SetRewardMigrationTargetAllowed');
        return {
            $: 'SetRewardMigrationTargetAllowed',
            targetContract: s.loadAddress(),
            allowed: s.loadBoolean(),
        }
    },
    store(self: SetRewardMigrationTargetAllowed, b: c.Builder): void {
        b.storeUint(0x48490407, 32);
        b.storeAddress(self.targetContract);
        b.storeBit(self.allowed);
    },
    toCell(self: SetRewardMigrationTargetAllowed): c.Cell {
        return makeCellFrom<SetRewardMigrationTargetAllowed>(self, SetRewardMigrationTargetAllowed.store);
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
 > struct MerkleRewardBatch {
 >     root: uint256
 >     totalHi: coins
 >     claimedHi: coins
 >     metadataHash: uint256
 >     poolType: uint8
 >     requiredGrowthLevel: uint8
 > }
 */
export interface MerkleRewardBatch {
    readonly $: 'MerkleRewardBatch'
    root: uint256
    totalHi: coins
    claimedHi: coins
    metadataHash: uint256
    poolType: uint8
    requiredGrowthLevel: uint8
}

export const MerkleRewardBatch = {
    create(args: {
        root: uint256
        totalHi: coins
        claimedHi: coins
        metadataHash: uint256
        poolType: uint8
        requiredGrowthLevel: uint8
    }): MerkleRewardBatch {
        return {
            $: 'MerkleRewardBatch',
            ...args
        }
    },
    fromSlice(s: c.Slice): MerkleRewardBatch {
        return {
            $: 'MerkleRewardBatch',
            root: s.loadUintBig(256),
            totalHi: s.loadCoins(),
            claimedHi: s.loadCoins(),
            metadataHash: s.loadUintBig(256),
            poolType: s.loadUintBig(8),
            requiredGrowthLevel: s.loadUintBig(8),
        }
    },
    store(self: MerkleRewardBatch, b: c.Builder): void {
        b.storeUint(self.root, 256);
        b.storeCoins(self.totalHi);
        b.storeCoins(self.claimedHi);
        b.storeUint(self.metadataHash, 256);
        b.storeUint(self.poolType, 8);
        b.storeUint(self.requiredGrowthLevel, 8);
    },
    toCell(self: MerkleRewardBatch): c.Cell {
        return makeCellFrom<MerkleRewardBatch>(self, MerkleRewardBatch.store);
    }
}

/**
 > struct PendingRewardTransfer {
 >     kind: uint8
 >     batchId: uint64
 >     claimant: address
 >     amount: coins
 > }
 */
export interface PendingRewardTransfer {
    readonly $: 'PendingRewardTransfer'
    kind: uint8
    batchId: uint64
    claimant: c.Address
    amount: coins
}

export const PendingRewardTransfer = {
    create(args: {
        kind: uint8
        batchId: uint64
        claimant: c.Address
        amount: coins
    }): PendingRewardTransfer {
        return {
            $: 'PendingRewardTransfer',
            ...args
        }
    },
    fromSlice(s: c.Slice): PendingRewardTransfer {
        return {
            $: 'PendingRewardTransfer',
            kind: s.loadUintBig(8),
            batchId: s.loadUintBig(64),
            claimant: s.loadAddress(),
            amount: s.loadCoins(),
        }
    },
    store(self: PendingRewardTransfer, b: c.Builder): void {
        b.storeUint(self.kind, 8);
        b.storeUint(self.batchId, 64);
        b.storeAddress(self.claimant);
        b.storeCoins(self.amount);
    },
    toCell(self: PendingRewardTransfer): c.Cell {
        return makeCellFrom<PendingRewardTransfer>(self, PendingRewardTransfer.store);
    }
}

/**
 > struct MerkleRewardStorage {
 >     config: Cell<MerkleRewardConfig>
 >     counters: Cell<MerkleRewardCounters>
 >     maps: Cell<MerkleRewardMaps>
 >     oracle: address
 >     rewardJettonWallet: address?
 >     migrationTarget: address?
 >     growthConfirmedLevel: uint8
 >     nextQueryId: uint64
 > }
 */
export interface MerkleRewardStorage {
    readonly $: 'MerkleRewardStorage'
    config: CellRef<MerkleRewardConfig>
    counters: CellRef<MerkleRewardCounters>
    maps: CellRef<MerkleRewardMaps>
    oracle: c.Address
    rewardJettonWallet: c.Address | null
    migrationTarget: c.Address | null
    growthConfirmedLevel: uint8
    nextQueryId: uint64
}

export const MerkleRewardStorage = {
    create(args: {
        config: CellRef<MerkleRewardConfig>
        counters: CellRef<MerkleRewardCounters>
        maps: CellRef<MerkleRewardMaps>
        oracle: c.Address
        rewardJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        growthConfirmedLevel: uint8
        nextQueryId: uint64
    }): MerkleRewardStorage {
        return {
            $: 'MerkleRewardStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): MerkleRewardStorage {
        return {
            $: 'MerkleRewardStorage',
            config: loadCellRef<MerkleRewardConfig>(s, MerkleRewardConfig.fromSlice),
            counters: loadCellRef<MerkleRewardCounters>(s, MerkleRewardCounters.fromSlice),
            maps: loadCellRef<MerkleRewardMaps>(s, MerkleRewardMaps.fromSlice),
            oracle: s.loadAddress(),
            rewardJettonWallet: s.loadMaybeAddress(),
            migrationTarget: s.loadMaybeAddress(),
            growthConfirmedLevel: s.loadUintBig(8),
            nextQueryId: s.loadUintBig(64),
        }
    },
    store(self: MerkleRewardStorage, b: c.Builder): void {
        storeCellRef<MerkleRewardConfig>(self.config, b, MerkleRewardConfig.store);
        storeCellRef<MerkleRewardCounters>(self.counters, b, MerkleRewardCounters.store);
        storeCellRef<MerkleRewardMaps>(self.maps, b, MerkleRewardMaps.store);
        b.storeAddress(self.oracle);
        b.storeAddress(self.rewardJettonWallet);
        b.storeAddress(self.migrationTarget);
        b.storeUint(self.growthConfirmedLevel, 8);
        b.storeUint(self.nextQueryId, 64);
    },
    toCell(self: MerkleRewardStorage): c.Cell {
        return makeCellFrom<MerkleRewardStorage>(self, MerkleRewardStorage.store);
    }
}

/**
 > struct MerkleRewardCounters {
 >     ecosystemTotalHi: coins
 >     universalTotalHi: coins
 >     redPacketTotalHi: coins
 >     migratedHi: coins
 > }
 */
export interface MerkleRewardCounters {
    readonly $: 'MerkleRewardCounters'
    ecosystemTotalHi: coins
    universalTotalHi: coins
    redPacketTotalHi: coins
    migratedHi: coins
}

export const MerkleRewardCounters = {
    create(args: {
        ecosystemTotalHi: coins
        universalTotalHi: coins
        redPacketTotalHi: coins
        migratedHi: coins
    }): MerkleRewardCounters {
        return {
            $: 'MerkleRewardCounters',
            ...args
        }
    },
    fromSlice(s: c.Slice): MerkleRewardCounters {
        return {
            $: 'MerkleRewardCounters',
            ecosystemTotalHi: s.loadCoins(),
            universalTotalHi: s.loadCoins(),
            redPacketTotalHi: s.loadCoins(),
            migratedHi: s.loadCoins(),
        }
    },
    store(self: MerkleRewardCounters, b: c.Builder): void {
        b.storeCoins(self.ecosystemTotalHi);
        b.storeCoins(self.universalTotalHi);
        b.storeCoins(self.redPacketTotalHi);
        b.storeCoins(self.migratedHi);
    },
    toCell(self: MerkleRewardCounters): c.Cell {
        return makeCellFrom<MerkleRewardCounters>(self, MerkleRewardCounters.store);
    }
}

/**
 > struct MerkleRewardMaps {
 >     batches: map<uint64, MerkleRewardBatch>
 >     claimed: map<uint256, bool>
 >     pendingTransfers: map<uint64, PendingRewardTransfer>
 >     migrationAllowlist: map<address, bool>
 > }
 */
export interface MerkleRewardMaps {
    readonly $: 'MerkleRewardMaps'
    batches: c.Dictionary<uint64, MerkleRewardBatch>
    claimed: c.Dictionary<uint256, boolean>
    pendingTransfers: c.Dictionary<uint64, PendingRewardTransfer>
    migrationAllowlist: c.Dictionary<c.Address, boolean>
}

export const MerkleRewardMaps = {
    create(args: {
        batches: c.Dictionary<uint64, MerkleRewardBatch>
        claimed: c.Dictionary<uint256, boolean>
        pendingTransfers: c.Dictionary<uint64, PendingRewardTransfer>
        migrationAllowlist: c.Dictionary<c.Address, boolean>
    }): MerkleRewardMaps {
        return {
            $: 'MerkleRewardMaps',
            ...args
        }
    },
    fromSlice(s: c.Slice): MerkleRewardMaps {
        return {
            $: 'MerkleRewardMaps',
            batches: c.Dictionary.load<uint64, MerkleRewardBatch>(c.Dictionary.Keys.BigUint(64), createDictionaryValue<MerkleRewardBatch>(MerkleRewardBatch.fromSlice, MerkleRewardBatch.store), s),
            claimed: c.Dictionary.load<uint256, boolean>(c.Dictionary.Keys.BigUint(256), c.Dictionary.Values.Bool(), s),
            pendingTransfers: c.Dictionary.load<uint64, PendingRewardTransfer>(c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingRewardTransfer>(PendingRewardTransfer.fromSlice, PendingRewardTransfer.store), s),
            migrationAllowlist: c.Dictionary.load<c.Address, boolean>(c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool(), s),
        }
    },
    store(self: MerkleRewardMaps, b: c.Builder): void {
        b.storeDict<uint64, MerkleRewardBatch>(self.batches, c.Dictionary.Keys.BigUint(64), createDictionaryValue<MerkleRewardBatch>(MerkleRewardBatch.fromSlice, MerkleRewardBatch.store));
        b.storeDict<uint256, boolean>(self.claimed, c.Dictionary.Keys.BigUint(256), c.Dictionary.Values.Bool());
        b.storeDict<uint64, PendingRewardTransfer>(self.pendingTransfers, c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingRewardTransfer>(PendingRewardTransfer.fromSlice, PendingRewardTransfer.store));
        b.storeDict<c.Address, boolean>(self.migrationAllowlist, c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool());
    },
    toCell(self: MerkleRewardMaps): c.Cell {
        return makeCellFrom<MerkleRewardMaps>(self, MerkleRewardMaps.store);
    }
}

/**
 > struct MerkleRewardConfig {
 >     admin: address
 >     migration: Cell<GrowthMigrationConfig>
 > }
 */
export interface MerkleRewardConfig {
    readonly $: 'MerkleRewardConfig'
    admin: c.Address
    migration: CellRef<GrowthMigrationConfig>
}

export const MerkleRewardConfig = {
    create(args: {
        admin: c.Address
        migration: CellRef<GrowthMigrationConfig>
    }): MerkleRewardConfig {
        return {
            $: 'MerkleRewardConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): MerkleRewardConfig {
        return {
            $: 'MerkleRewardConfig',
            admin: s.loadAddress(),
            migration: loadCellRef<GrowthMigrationConfig>(s, GrowthMigrationConfig.fromSlice),
        }
    },
    store(self: MerkleRewardConfig, b: c.Builder): void {
        b.storeAddress(self.admin);
        storeCellRef<GrowthMigrationConfig>(self.migration, b, GrowthMigrationConfig.store);
    },
    toCell(self: MerkleRewardConfig): c.Cell {
        return makeCellFrom<MerkleRewardConfig>(self, MerkleRewardConfig.store);
    }
}

// ————————————————————————————————————————————
//    class MerkleRewardVault
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

export class MerkleRewardVault implements c.Contract {
    static CodeCell = c.Cell.fromBase64('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');

    static Errors = {
        'Errors.InvalidMessage': 49,
        'Errors.NotAdmin': 100,
        'Errors.InsufficientInventory': 204,
        'Errors.NoClaimableAmount': 205,
        'Errors.InvalidLevel': 206,
        'Errors.BatchExists': 210,
        'Errors.BatchMissing': 211,
        'Errors.AlreadyClaimed': 212,
        'Errors.InvalidProof': 213,
        'Errors.InsufficientAttachedTon': 214,
        'Errors.JettonWalletNotConfigured': 215,
        'Errors.InvalidPoolType': 219,
        'Errors.MigrationTargetNotAllowed': 220,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new MerkleRewardVault(address);
    }

    static fromStorage(emptyStorage: {
        config: CellRef<MerkleRewardConfig>
        counters: CellRef<MerkleRewardCounters>
        maps: CellRef<MerkleRewardMaps>
        oracle: c.Address
        rewardJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        growthConfirmedLevel: uint8
        nextQueryId: uint64
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? MerkleRewardVault.CodeCell,
            data: MerkleRewardStorage.toCell(MerkleRewardStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new MerkleRewardVault(address, initialState);
    }

    static createCellOfCreateRewardBatch(body: {
        batchId: uint64
        root: uint256
        totalHi: coins
        metadataHash: uint256
        poolType: uint8
        requiredGrowthLevel: uint8
    }) {
        return CreateRewardBatch.toCell(CreateRewardBatch.create(body));
    }

    static createCellOfClaimReward(body: {
        batchId: uint64
        amount: coins
        proof: c.Cell
    }) {
        return ClaimReward.toCell(ClaimReward.create(body));
    }

    static createCellOfSetRewardJettonWallet(body: {
        rewardJettonWallet: c.Address
    }) {
        return SetRewardJettonWallet.toCell(SetRewardJettonWallet.create(body));
    }

    static createCellOfSetRewardGrowthLevel(body: {
        growthConfirmedLevel: uint8
    }) {
        return SetRewardGrowthLevel.toCell(SetRewardGrowthLevel.create(body));
    }

    static createCellOfSetRewardMigrationTargetAllowed(body: {
        targetContract: c.Address
        allowed: boolean
    }) {
        return SetRewardMigrationTargetAllowed.toCell(SetRewardMigrationTargetAllowed.create(body));
    }

    static createCellOfSetRewardMigrationTarget(body: {
        targetContract: c.Address
    }) {
        return SetRewardMigrationTarget.toCell(SetRewardMigrationTarget.create(body));
    }

    static createCellOfTransferRewardUncommittedHiToContract(body: {
        amount: coins
    }) {
        return TransferRewardUncommittedHiToContract.toCell(TransferRewardUncommittedHiToContract.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendCreateRewardBatch(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        batchId: uint64
        root: uint256
        totalHi: coins
        metadataHash: uint256
        poolType: uint8
        requiredGrowthLevel: uint8
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: CreateRewardBatch.toCell(CreateRewardBatch.create(body)),
            ...extraOptions
        });
    }

    async sendClaimReward(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        batchId: uint64
        amount: coins
        proof: c.Cell
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ClaimReward.toCell(ClaimReward.create(body)),
            ...extraOptions
        });
    }

    async sendSetRewardJettonWallet(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        rewardJettonWallet: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetRewardJettonWallet.toCell(SetRewardJettonWallet.create(body)),
            ...extraOptions
        });
    }

    async sendSetRewardGrowthLevel(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        growthConfirmedLevel: uint8
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetRewardGrowthLevel.toCell(SetRewardGrowthLevel.create(body)),
            ...extraOptions
        });
    }

    async sendSetRewardMigrationTargetAllowed(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
        allowed: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetRewardMigrationTargetAllowed.toCell(SetRewardMigrationTargetAllowed.create(body)),
            ...extraOptions
        });
    }

    async sendSetRewardMigrationTarget(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetRewardMigrationTarget.toCell(SetRewardMigrationTarget.create(body)),
            ...extraOptions
        });
    }

    async sendTransferRewardUncommittedHiToContract(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TransferRewardUncommittedHiToContract.toCell(TransferRewardUncommittedHiToContract.create(body)),
            ...extraOptions
        });
    }

    async getBatchState(provider: ContractProvider, batchId: uint64): Promise<[
        uint256,
        coins,
        coins,
        uint256,
        uint8,
        uint8,
    ]> {
        const r = StackReader.fromGetMethod(6, await provider.get('batch_state', [
            { type: 'int', value: batchId },
        ]));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }

    async getHasClaimed(provider: ContractProvider, batchId: uint64, claimant: c.Address): Promise<boolean> {
        const r = StackReader.fromGetMethod(1, await provider.get('has_claimed', [
            { type: 'int', value: batchId },
            { type: 'slice', cell: makeCellFrom<c.Address>(claimant,
                (v,b) => b.storeAddress(v)
            ) },
        ]));
        return r.readBoolean();
    }

    async getPoolState(provider: ContractProvider): Promise<[
        coins,
        coins,
        coins,
        coins,
        uint8,
    ]> {
        const r = StackReader.fromGetMethod(5, await provider.get('pool_state', []));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }
}
