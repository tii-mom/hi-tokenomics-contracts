// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a TeamVestingVault contract in Tolk.
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
type uint32 = bigint
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
 > struct (0x48490301) SyncTeamPriceLevel {
 >     teamConfirmedLevel: uint8
 >     confirmedAt: uint32
 > }
 */
export interface SyncTeamPriceLevel {
    readonly $: 'SyncTeamPriceLevel'
    teamConfirmedLevel: uint8
    confirmedAt: uint32
}

export const SyncTeamPriceLevel = {
    PREFIX: 0x48490301,

    create(args: {
        teamConfirmedLevel: uint8
        confirmedAt: uint32
    }): SyncTeamPriceLevel {
        return {
            $: 'SyncTeamPriceLevel',
            ...args
        }
    },
    fromSlice(s: c.Slice): SyncTeamPriceLevel {
        loadAndCheckPrefix32(s, 0x48490301, 'SyncTeamPriceLevel');
        return {
            $: 'SyncTeamPriceLevel',
            teamConfirmedLevel: s.loadUintBig(8),
            confirmedAt: s.loadUintBig(32),
        }
    },
    store(self: SyncTeamPriceLevel, b: c.Builder): void {
        b.storeUint(0x48490301, 32);
        b.storeUint(self.teamConfirmedLevel, 8);
        b.storeUint(self.confirmedAt, 32);
    },
    toCell(self: SyncTeamPriceLevel): c.Cell {
        return makeCellFrom<SyncTeamPriceLevel>(self, SyncTeamPriceLevel.store);
    }
}

/**
 > struct (0x48490302) ClaimTeam {
 > }
 */
export interface ClaimTeam {
    readonly $: 'ClaimTeam'
}

export const ClaimTeam = {
    PREFIX: 0x48490302,

    create(): ClaimTeam {
        return {
            $: 'ClaimTeam',
        }
    },
    fromSlice(s: c.Slice): ClaimTeam {
        loadAndCheckPrefix32(s, 0x48490302, 'ClaimTeam');
        return {
            $: 'ClaimTeam',
        }
    },
    store(self: ClaimTeam, b: c.Builder): void {
        b.storeUint(0x48490302, 32);
    },
    toCell(self: ClaimTeam): c.Cell {
        return makeCellFrom<ClaimTeam>(self, ClaimTeam.store);
    }
}

/**
 > struct (0x48490303) SetTeamJettonWallet {
 >     teamJettonWallet: address
 > }
 */
export interface SetTeamJettonWallet {
    readonly $: 'SetTeamJettonWallet'
    teamJettonWallet: c.Address
}

export const SetTeamJettonWallet = {
    PREFIX: 0x48490303,

    create(args: {
        teamJettonWallet: c.Address
    }): SetTeamJettonWallet {
        return {
            $: 'SetTeamJettonWallet',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetTeamJettonWallet {
        loadAndCheckPrefix32(s, 0x48490303, 'SetTeamJettonWallet');
        return {
            $: 'SetTeamJettonWallet',
            teamJettonWallet: s.loadAddress(),
        }
    },
    store(self: SetTeamJettonWallet, b: c.Builder): void {
        b.storeUint(0x48490303, 32);
        b.storeAddress(self.teamJettonWallet);
    },
    toCell(self: SetTeamJettonWallet): c.Cell {
        return makeCellFrom<SetTeamJettonWallet>(self, SetTeamJettonWallet.store);
    }
}

/**
 > struct (0x48490304) SetTeamMigrationTarget {
 >     targetContract: address
 > }
 */
export interface SetTeamMigrationTarget {
    readonly $: 'SetTeamMigrationTarget'
    targetContract: c.Address
}

export const SetTeamMigrationTarget = {
    PREFIX: 0x48490304,

    create(args: {
        targetContract: c.Address
    }): SetTeamMigrationTarget {
        return {
            $: 'SetTeamMigrationTarget',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetTeamMigrationTarget {
        loadAndCheckPrefix32(s, 0x48490304, 'SetTeamMigrationTarget');
        return {
            $: 'SetTeamMigrationTarget',
            targetContract: s.loadAddress(),
        }
    },
    store(self: SetTeamMigrationTarget, b: c.Builder): void {
        b.storeUint(0x48490304, 32);
        b.storeAddress(self.targetContract);
    },
    toCell(self: SetTeamMigrationTarget): c.Cell {
        return makeCellFrom<SetTeamMigrationTarget>(self, SetTeamMigrationTarget.store);
    }
}

/**
 > struct (0x48490305) TransferTeamUncommittedHiToContract {
 >     amount: coins
 > }
 */
export interface TransferTeamUncommittedHiToContract {
    readonly $: 'TransferTeamUncommittedHiToContract'
    amount: coins
}

export const TransferTeamUncommittedHiToContract = {
    PREFIX: 0x48490305,

    create(args: {
        amount: coins
    }): TransferTeamUncommittedHiToContract {
        return {
            $: 'TransferTeamUncommittedHiToContract',
            ...args
        }
    },
    fromSlice(s: c.Slice): TransferTeamUncommittedHiToContract {
        loadAndCheckPrefix32(s, 0x48490305, 'TransferTeamUncommittedHiToContract');
        return {
            $: 'TransferTeamUncommittedHiToContract',
            amount: s.loadCoins(),
        }
    },
    store(self: TransferTeamUncommittedHiToContract, b: c.Builder): void {
        b.storeUint(0x48490305, 32);
        b.storeCoins(self.amount);
    },
    toCell(self: TransferTeamUncommittedHiToContract): c.Cell {
        return makeCellFrom<TransferTeamUncommittedHiToContract>(self, TransferTeamUncommittedHiToContract.store);
    }
}

/**
 > struct (0x48490306) SetTeamMigrationTargetAllowed {
 >     targetContract: address
 >     allowed: bool
 > }
 */
export interface SetTeamMigrationTargetAllowed {
    readonly $: 'SetTeamMigrationTargetAllowed'
    targetContract: c.Address
    allowed: boolean
}

export const SetTeamMigrationTargetAllowed = {
    PREFIX: 0x48490306,

    create(args: {
        targetContract: c.Address
        allowed: boolean
    }): SetTeamMigrationTargetAllowed {
        return {
            $: 'SetTeamMigrationTargetAllowed',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetTeamMigrationTargetAllowed {
        loadAndCheckPrefix32(s, 0x48490306, 'SetTeamMigrationTargetAllowed');
        return {
            $: 'SetTeamMigrationTargetAllowed',
            targetContract: s.loadAddress(),
            allowed: s.loadBoolean(),
        }
    },
    store(self: SetTeamMigrationTargetAllowed, b: c.Builder): void {
        b.storeUint(0x48490306, 32);
        b.storeAddress(self.targetContract);
        b.storeBit(self.allowed);
    },
    toCell(self: SetTeamMigrationTargetAllowed): c.Cell {
        return makeCellFrom<SetTeamMigrationTargetAllowed>(self, SetTeamMigrationTargetAllowed.store);
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
 > struct TeamVestingConfig {
 >     admin: address
 >     teamWallet: address
 >     migration: Cell<GrowthMigrationConfig>
 > }
 */
export interface TeamVestingConfig {
    readonly $: 'TeamVestingConfig'
    admin: c.Address
    teamWallet: c.Address
    migration: CellRef<GrowthMigrationConfig>
}

export const TeamVestingConfig = {
    create(args: {
        admin: c.Address
        teamWallet: c.Address
        migration: CellRef<GrowthMigrationConfig>
    }): TeamVestingConfig {
        return {
            $: 'TeamVestingConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): TeamVestingConfig {
        return {
            $: 'TeamVestingConfig',
            admin: s.loadAddress(),
            teamWallet: s.loadAddress(),
            migration: loadCellRef<GrowthMigrationConfig>(s, GrowthMigrationConfig.fromSlice),
        }
    },
    store(self: TeamVestingConfig, b: c.Builder): void {
        b.storeAddress(self.admin);
        b.storeAddress(self.teamWallet);
        storeCellRef<GrowthMigrationConfig>(self.migration, b, GrowthMigrationConfig.store);
    },
    toCell(self: TeamVestingConfig): c.Cell {
        return makeCellFrom<TeamVestingConfig>(self, TeamVestingConfig.store);
    }
}

/**
 > struct TeamVestingStorage {
 >     config: Cell<TeamVestingConfig>
 >     counters: Cell<TeamVestingCounters>
 >     maps: Cell<TeamVestingMaps>
 >     oracle: address
 >     teamJettonWallet: address?
 >     migrationTarget: address?
 >     teamConfirmedLevel: uint8
 >     nextQueryId: uint64
 > }
 */
export interface TeamVestingStorage {
    readonly $: 'TeamVestingStorage'
    config: CellRef<TeamVestingConfig>
    counters: CellRef<TeamVestingCounters>
    maps: CellRef<TeamVestingMaps>
    oracle: c.Address
    teamJettonWallet: c.Address | null
    migrationTarget: c.Address | null
    teamConfirmedLevel: uint8
    nextQueryId: uint64
}

export const TeamVestingStorage = {
    create(args: {
        config: CellRef<TeamVestingConfig>
        counters: CellRef<TeamVestingCounters>
        maps: CellRef<TeamVestingMaps>
        oracle: c.Address
        teamJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        teamConfirmedLevel: uint8
        nextQueryId: uint64
    }): TeamVestingStorage {
        return {
            $: 'TeamVestingStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): TeamVestingStorage {
        return {
            $: 'TeamVestingStorage',
            config: loadCellRef<TeamVestingConfig>(s, TeamVestingConfig.fromSlice),
            counters: loadCellRef<TeamVestingCounters>(s, TeamVestingCounters.fromSlice),
            maps: loadCellRef<TeamVestingMaps>(s, TeamVestingMaps.fromSlice),
            oracle: s.loadAddress(),
            teamJettonWallet: s.loadMaybeAddress(),
            migrationTarget: s.loadMaybeAddress(),
            teamConfirmedLevel: s.loadUintBig(8),
            nextQueryId: s.loadUintBig(64),
        }
    },
    store(self: TeamVestingStorage, b: c.Builder): void {
        storeCellRef<TeamVestingConfig>(self.config, b, TeamVestingConfig.store);
        storeCellRef<TeamVestingCounters>(self.counters, b, TeamVestingCounters.store);
        storeCellRef<TeamVestingMaps>(self.maps, b, TeamVestingMaps.store);
        b.storeAddress(self.oracle);
        b.storeAddress(self.teamJettonWallet);
        b.storeAddress(self.migrationTarget);
        b.storeUint(self.teamConfirmedLevel, 8);
        b.storeUint(self.nextQueryId, 64);
    },
    toCell(self: TeamVestingStorage): c.Cell {
        return makeCellFrom<TeamVestingStorage>(self, TeamVestingStorage.store);
    }
}

/**
 > struct TeamVestingCounters {
 >     totalHi: coins
 >     claimedHi: coins
 >     migratedHi: coins
 > }
 */
export interface TeamVestingCounters {
    readonly $: 'TeamVestingCounters'
    totalHi: coins
    claimedHi: coins
    migratedHi: coins
}

export const TeamVestingCounters = {
    create(args: {
        totalHi: coins
        claimedHi: coins
        migratedHi: coins
    }): TeamVestingCounters {
        return {
            $: 'TeamVestingCounters',
            ...args
        }
    },
    fromSlice(s: c.Slice): TeamVestingCounters {
        return {
            $: 'TeamVestingCounters',
            totalHi: s.loadCoins(),
            claimedHi: s.loadCoins(),
            migratedHi: s.loadCoins(),
        }
    },
    store(self: TeamVestingCounters, b: c.Builder): void {
        b.storeCoins(self.totalHi);
        b.storeCoins(self.claimedHi);
        b.storeCoins(self.migratedHi);
    },
    toCell(self: TeamVestingCounters): c.Cell {
        return makeCellFrom<TeamVestingCounters>(self, TeamVestingCounters.store);
    }
}

/**
 > struct PendingTeamTransfer {
 >     kind: uint8
 >     amount: coins
 > }
 */
export interface PendingTeamTransfer {
    readonly $: 'PendingTeamTransfer'
    kind: uint8
    amount: coins
}

export const PendingTeamTransfer = {
    create(args: {
        kind: uint8
        amount: coins
    }): PendingTeamTransfer {
        return {
            $: 'PendingTeamTransfer',
            ...args
        }
    },
    fromSlice(s: c.Slice): PendingTeamTransfer {
        return {
            $: 'PendingTeamTransfer',
            kind: s.loadUintBig(8),
            amount: s.loadCoins(),
        }
    },
    store(self: PendingTeamTransfer, b: c.Builder): void {
        b.storeUint(self.kind, 8);
        b.storeCoins(self.amount);
    },
    toCell(self: PendingTeamTransfer): c.Cell {
        return makeCellFrom<PendingTeamTransfer>(self, PendingTeamTransfer.store);
    }
}

/**
 > struct TeamVestingMaps {
 >     pendingTransfers: map<uint64, PendingTeamTransfer>
 >     migrationAllowlist: map<address, bool>
 > }
 */
export interface TeamVestingMaps {
    readonly $: 'TeamVestingMaps'
    pendingTransfers: c.Dictionary<uint64, PendingTeamTransfer>
    migrationAllowlist: c.Dictionary<c.Address, boolean>
}

export const TeamVestingMaps = {
    create(args: {
        pendingTransfers: c.Dictionary<uint64, PendingTeamTransfer>
        migrationAllowlist: c.Dictionary<c.Address, boolean>
    }): TeamVestingMaps {
        return {
            $: 'TeamVestingMaps',
            ...args
        }
    },
    fromSlice(s: c.Slice): TeamVestingMaps {
        return {
            $: 'TeamVestingMaps',
            pendingTransfers: c.Dictionary.load<uint64, PendingTeamTransfer>(c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingTeamTransfer>(PendingTeamTransfer.fromSlice, PendingTeamTransfer.store), s),
            migrationAllowlist: c.Dictionary.load<c.Address, boolean>(c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool(), s),
        }
    },
    store(self: TeamVestingMaps, b: c.Builder): void {
        b.storeDict<uint64, PendingTeamTransfer>(self.pendingTransfers, c.Dictionary.Keys.BigUint(64), createDictionaryValue<PendingTeamTransfer>(PendingTeamTransfer.fromSlice, PendingTeamTransfer.store));
        b.storeDict<c.Address, boolean>(self.migrationAllowlist, c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool());
    },
    toCell(self: TeamVestingMaps): c.Cell {
        return makeCellFrom<TeamVestingMaps>(self, TeamVestingMaps.store);
    }
}

// ————————————————————————————————————————————
//    class TeamVestingVault
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

export class TeamVestingVault implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgECDgEABCwAART/APSkE/S88sgLAQIBYgIDA/jQ+JGOY9MfMe1E0NTU1ALQ+gD6APoA0QPQ9AT0BNEH1ywgfFP1LPK/1ws/UwGAQPQO8rHTB/oA0QHAAZIToZQVoUQU4lmAQPRbMMhQA/oCAfoCWPoCyQHI9AAU9ADJAsjME8zMzsntVOAg1ywiQkgYDOMC1ywiQkgYHOMCBAUGAGOh9u3aiaGoY6moY/SQY/SgY/SgY64WDkOh9ABj9AH0AGOiBaH0AfQAY/QAY6JDUVYCJQCGMe1E0NTU1PpI+lD6UNMH+JIlxwXy4GQI1wsHIMIA8uDOIMEF8uDOUgK8jhMGyMwVzBPM+lL6VPpUywfOye1Ukl8I4gBeMe1E0NTU1PpI+lAxJND6SPpIMdQx0fiSxwXy4GQF+kgwBMjME8zM+lL6VM7J7VQE9InXJ45aMe1E0NTU1PpI+lD6UDH4kibQ+kgx+kgx1NHQ+kj6SNFSIscFklt/lMcFwwDi8uBkBvpIMCPQ9AQx9ATRUhCBAQv0Cm+hMfLg3AXIzBTMEsz6UvpU+lTOye1U4NcsIkJIGDTjAtcsIkJIGCzjAtcsIkJIGBQxBwgJCgAISEkDBADsMe1E0NTU1PpI+lD6UNMH1ws/J9D6SPpIMdQx0fiSxwXy4GQI+kjXCgAG0PQE9ATRB5rIz4NAB4EBC/RBjhpSF4EBC/RZMCNus5ZSMscFwwCSMXDikm0z3uIFyPQAFfQAyQbIzBXMFcz6UhP6VPpUywfLP8ntVAH+Me1E0NTU1PpI+lD6UNMH1ws/+JIo0PpIMfpIMdTR0PpI+kjRUiLHBZJbf5THBcMA4vLgZPiXghAO5rKAvvLg1lMibvJxJtD0BDH0BNFSEIEBC/QKb6Ex8uDcB9D6APoA+gDRC/oAMCDCAPLgzSDBAfLgzFG7oMhQA/oCAfoCAQsBDOMCxwDysQwA+voCyfiXKdD6SPpIMdQx0VNmbvLQ1ySkCtD0BPQE0cjPhAov+gJUIHOAQPRDyPQA9ADJbYsEyM+QPin6lhjLP1AP+gIc+lIS+lQc9ADPhCATzsnIz4WIG/pSWPoCcc8LahnMyYAR+wAGyMwXzBTM+lIS+lQT+lTLB8s/ye1UAfww7UTQ1NTU+kj6UPpQ0wfXCz8n0PpI+kgx1DHR+JLHBfLgZPiXghAO5rKAvvLg1ibQ+gD6APoA0QnQ+gD6ADH6ADHRJKirASGhIMIA8uDNZqDIUAP6Alj6AlAI+gLJ+Jcp0PpIMfpI1DHRKtD6SPpIMdQx0VN3bvLQ1yWkC9ANAMj0BPQE0cjPhAYu+gJUIIOAQPRDyPQA9ADJbYsEyM+QPin6lhnLP1AO+gIU+lIS+lQb9ADPhCAUzsnIz4WIGvpSAfoCcc8LahjMyYAR+wAHyMwWzBbMEvpS+lQT+lTLB8s/ye1U');

    static Errors = {
        'Errors.InvalidMessage': 49,
        'Errors.NotAdmin': 100,
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
        return new TeamVestingVault(address);
    }

    static fromStorage(emptyStorage: {
        config: CellRef<TeamVestingConfig>
        counters: CellRef<TeamVestingCounters>
        maps: CellRef<TeamVestingMaps>
        oracle: c.Address
        teamJettonWallet: c.Address | null
        migrationTarget: c.Address | null
        teamConfirmedLevel: uint8
        nextQueryId: uint64
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? TeamVestingVault.CodeCell,
            data: TeamVestingStorage.toCell(TeamVestingStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new TeamVestingVault(address, initialState);
    }

    static createCellOfSyncTeamPriceLevel(body: {
        teamConfirmedLevel: uint8
        confirmedAt: uint32
    }) {
        return SyncTeamPriceLevel.toCell(SyncTeamPriceLevel.create(body));
    }

    static createCellOfClaimTeam(body: {
    }) {
        return ClaimTeam.toCell(ClaimTeam.create());
    }

    static createCellOfSetTeamJettonWallet(body: {
        teamJettonWallet: c.Address
    }) {
        return SetTeamJettonWallet.toCell(SetTeamJettonWallet.create(body));
    }

    static createCellOfSetTeamMigrationTargetAllowed(body: {
        targetContract: c.Address
        allowed: boolean
    }) {
        return SetTeamMigrationTargetAllowed.toCell(SetTeamMigrationTargetAllowed.create(body));
    }

    static createCellOfSetTeamMigrationTarget(body: {
        targetContract: c.Address
    }) {
        return SetTeamMigrationTarget.toCell(SetTeamMigrationTarget.create(body));
    }

    static createCellOfTransferTeamUncommittedHiToContract(body: {
        amount: coins
    }) {
        return TransferTeamUncommittedHiToContract.toCell(TransferTeamUncommittedHiToContract.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendSyncTeamPriceLevel(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        teamConfirmedLevel: uint8
        confirmedAt: uint32
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SyncTeamPriceLevel.toCell(SyncTeamPriceLevel.create(body)),
            ...extraOptions
        });
    }

    async sendClaimTeam(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ClaimTeam.toCell(ClaimTeam.create()),
            ...extraOptions
        });
    }

    async sendSetTeamJettonWallet(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        teamJettonWallet: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetTeamJettonWallet.toCell(SetTeamJettonWallet.create(body)),
            ...extraOptions
        });
    }

    async sendSetTeamMigrationTargetAllowed(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
        allowed: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetTeamMigrationTargetAllowed.toCell(SetTeamMigrationTargetAllowed.create(body)),
            ...extraOptions
        });
    }

    async sendSetTeamMigrationTarget(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        targetContract: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetTeamMigrationTarget.toCell(SetTeamMigrationTarget.create(body)),
            ...extraOptions
        });
    }

    async sendTransferTeamUncommittedHiToContract(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TransferTeamUncommittedHiToContract.toCell(TransferTeamUncommittedHiToContract.create(body)),
            ...extraOptions
        });
    }

    async getVestingState(provider: ContractProvider): Promise<[
        uint8,
        coins,
        coins,
    ]> {
        const r = StackReader.fromGetMethod(3, await provider.get('vesting_state', []));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }
}
