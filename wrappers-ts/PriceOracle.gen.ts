// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a PriceOracle contract in Tolk.
/* eslint-disable */

import * as c from '@ton/core';
import { beginCell, ContractProvider, Sender, SendMode } from '@ton/core';

// ————————————————————————————————————————————
//   predefined types and functions
//

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

function storeTolkNullable<T>(v: T | null, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    if (v === null) {
        b.storeUint(0, 1);
    } else {
        b.storeUint(1, 1);
        storeFn_T(v, b);
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
 > struct (0x48490201) ReportGrowthPrice {
 >     price: uint64
 > }
 */
export interface ReportGrowthPrice {
    readonly $: 'ReportGrowthPrice'
    price: uint64
}

export const ReportGrowthPrice = {
    PREFIX: 0x48490201,

    create(args: {
        price: uint64
    }): ReportGrowthPrice {
        return {
            $: 'ReportGrowthPrice',
            ...args
        }
    },
    fromSlice(s: c.Slice): ReportGrowthPrice {
        loadAndCheckPrefix32(s, 0x48490201, 'ReportGrowthPrice');
        return {
            $: 'ReportGrowthPrice',
            price: s.loadUintBig(64),
        }
    },
    store(self: ReportGrowthPrice, b: c.Builder): void {
        b.storeUint(0x48490201, 32);
        b.storeUint(self.price, 64);
    },
    toCell(self: ReportGrowthPrice): c.Cell {
        return makeCellFrom<ReportGrowthPrice>(self, ReportGrowthPrice.store);
    }
}

/**
 > struct (0x48490202) ConfirmGrowthLevel {
 > }
 */
export interface ConfirmGrowthLevel {
    readonly $: 'ConfirmGrowthLevel'
}

export const ConfirmGrowthLevel = {
    PREFIX: 0x48490202,

    create(): ConfirmGrowthLevel {
        return {
            $: 'ConfirmGrowthLevel',
        }
    },
    fromSlice(s: c.Slice): ConfirmGrowthLevel {
        loadAndCheckPrefix32(s, 0x48490202, 'ConfirmGrowthLevel');
        return {
            $: 'ConfirmGrowthLevel',
        }
    },
    store(self: ConfirmGrowthLevel, b: c.Builder): void {
        b.storeUint(0x48490202, 32);
    },
    toCell(self: ConfirmGrowthLevel): c.Cell {
        return makeCellFrom<ConfirmGrowthLevel>(self, ConfirmGrowthLevel.store);
    }
}

/**
 > struct (0x48490203) SetOracleTargets {
 >     growthEngine: address
 >     teamVestingVault: address
 >     merkleRewardVault: address
 > }
 */
export interface SetOracleTargets {
    readonly $: 'SetOracleTargets'
    growthEngine: c.Address
    teamVestingVault: c.Address
    merkleRewardVault: c.Address
}

export const SetOracleTargets = {
    PREFIX: 0x48490203,

    create(args: {
        growthEngine: c.Address
        teamVestingVault: c.Address
        merkleRewardVault: c.Address
    }): SetOracleTargets {
        return {
            $: 'SetOracleTargets',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetOracleTargets {
        loadAndCheckPrefix32(s, 0x48490203, 'SetOracleTargets');
        return {
            $: 'SetOracleTargets',
            growthEngine: s.loadAddress(),
            teamVestingVault: s.loadAddress(),
            merkleRewardVault: s.loadAddress(),
        }
    },
    store(self: SetOracleTargets, b: c.Builder): void {
        b.storeUint(0x48490203, 32);
        b.storeAddress(self.growthEngine);
        b.storeAddress(self.teamVestingVault);
        b.storeAddress(self.merkleRewardVault);
    },
    toCell(self: SetOracleTargets): c.Cell {
        return makeCellFrom<SetOracleTargets>(self, SetOracleTargets.store);
    }
}

/**
 > struct (0x48490204) SetCampaignWinnerTarget {
 >     campaignWinnerVault: address
 > }
 */
export interface SetCampaignWinnerTarget {
    readonly $: 'SetCampaignWinnerTarget'
    campaignWinnerVault: c.Address
}

export const SetCampaignWinnerTarget = {
    PREFIX: 0x48490204,

    create(args: {
        campaignWinnerVault: c.Address
    }): SetCampaignWinnerTarget {
        return {
            $: 'SetCampaignWinnerTarget',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetCampaignWinnerTarget {
        loadAndCheckPrefix32(s, 0x48490204, 'SetCampaignWinnerTarget');
        return {
            $: 'SetCampaignWinnerTarget',
            campaignWinnerVault: s.loadAddress(),
        }
    },
    store(self: SetCampaignWinnerTarget, b: c.Builder): void {
        b.storeUint(0x48490204, 32);
        b.storeAddress(self.campaignWinnerVault);
    },
    toCell(self: SetCampaignWinnerTarget): c.Cell {
        return makeCellFrom<SetCampaignWinnerTarget>(self, SetCampaignWinnerTarget.store);
    }
}

/**
 > struct (0x48490205) ReportTeamPrice {
 >     price: uint64
 > }
 */
export interface ReportTeamPrice {
    readonly $: 'ReportTeamPrice'
    price: uint64
}

export const ReportTeamPrice = {
    PREFIX: 0x48490205,

    create(args: {
        price: uint64
    }): ReportTeamPrice {
        return {
            $: 'ReportTeamPrice',
            ...args
        }
    },
    fromSlice(s: c.Slice): ReportTeamPrice {
        loadAndCheckPrefix32(s, 0x48490205, 'ReportTeamPrice');
        return {
            $: 'ReportTeamPrice',
            price: s.loadUintBig(64),
        }
    },
    store(self: ReportTeamPrice, b: c.Builder): void {
        b.storeUint(0x48490205, 32);
        b.storeUint(self.price, 64);
    },
    toCell(self: ReportTeamPrice): c.Cell {
        return makeCellFrom<ReportTeamPrice>(self, ReportTeamPrice.store);
    }
}

/**
 > struct (0x48490206) ConfirmTeamLevel {
 > }
 */
export interface ConfirmTeamLevel {
    readonly $: 'ConfirmTeamLevel'
}

export const ConfirmTeamLevel = {
    PREFIX: 0x48490206,

    create(): ConfirmTeamLevel {
        return {
            $: 'ConfirmTeamLevel',
        }
    },
    fromSlice(s: c.Slice): ConfirmTeamLevel {
        loadAndCheckPrefix32(s, 0x48490206, 'ConfirmTeamLevel');
        return {
            $: 'ConfirmTeamLevel',
        }
    },
    store(self: ConfirmTeamLevel, b: c.Builder): void {
        b.storeUint(0x48490206, 32);
    },
    toCell(self: ConfirmTeamLevel): c.Cell {
        return makeCellFrom<ConfirmTeamLevel>(self, ConfirmTeamLevel.store);
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
 > struct PriceOracleCampaignTargets {
 >     campaignWinnerVault: address?
 > }
 */
export interface PriceOracleCampaignTargets {
    readonly $: 'PriceOracleCampaignTargets'
    campaignWinnerVault: c.Address | null
}

export const PriceOracleCampaignTargets = {
    create(args: {
        campaignWinnerVault: c.Address | null
    }): PriceOracleCampaignTargets {
        return {
            $: 'PriceOracleCampaignTargets',
            ...args
        }
    },
    fromSlice(s: c.Slice): PriceOracleCampaignTargets {
        return {
            $: 'PriceOracleCampaignTargets',
            campaignWinnerVault: s.loadMaybeAddress(),
        }
    },
    store(self: PriceOracleCampaignTargets, b: c.Builder): void {
        b.storeAddress(self.campaignWinnerVault);
    },
    toCell(self: PriceOracleCampaignTargets): c.Cell {
        return makeCellFrom<PriceOracleCampaignTargets>(self, PriceOracleCampaignTargets.store);
    }
}

/**
 > struct PriceOracleTargets {
 >     growthEngine: address?
 >     teamVestingVault: address?
 >     merkleRewardVault: address?
 >     campaignTargets: Cell<PriceOracleCampaignTargets>
 > }
 */
export interface PriceOracleTargets {
    readonly $: 'PriceOracleTargets'
    growthEngine: c.Address | null
    teamVestingVault: c.Address | null
    merkleRewardVault: c.Address | null
    campaignTargets: CellRef<PriceOracleCampaignTargets>
}

export const PriceOracleTargets = {
    create(args: {
        growthEngine: c.Address | null
        teamVestingVault: c.Address | null
        merkleRewardVault: c.Address | null
        campaignTargets: CellRef<PriceOracleCampaignTargets>
    }): PriceOracleTargets {
        return {
            $: 'PriceOracleTargets',
            ...args
        }
    },
    fromSlice(s: c.Slice): PriceOracleTargets {
        return {
            $: 'PriceOracleTargets',
            growthEngine: s.loadMaybeAddress(),
            teamVestingVault: s.loadMaybeAddress(),
            merkleRewardVault: s.loadMaybeAddress(),
            campaignTargets: loadCellRef<PriceOracleCampaignTargets>(s, PriceOracleCampaignTargets.fromSlice),
        }
    },
    store(self: PriceOracleTargets, b: c.Builder): void {
        b.storeAddress(self.growthEngine);
        b.storeAddress(self.teamVestingVault);
        b.storeAddress(self.merkleRewardVault);
        storeCellRef<PriceOracleCampaignTargets>(self.campaignTargets, b, PriceOracleCampaignTargets.store);
    },
    toCell(self: PriceOracleTargets): c.Cell {
        return makeCellFrom<PriceOracleTargets>(self, PriceOracleTargets.store);
    }
}

/**
 > struct PriceOracleGrowthState {
 >     confirmedLevel: uint8
 >     candidateLevel: uint8
 >     levelStartedAt: uint32
 >     lastPrice: uint64
 > }
 */
export interface PriceOracleGrowthState {
    readonly $: 'PriceOracleGrowthState'
    confirmedLevel: uint8
    candidateLevel: uint8
    levelStartedAt: uint32
    lastPrice: uint64
}

export const PriceOracleGrowthState = {
    create(args: {
        confirmedLevel: uint8
        candidateLevel: uint8
        levelStartedAt: uint32
        lastPrice: uint64
    }): PriceOracleGrowthState {
        return {
            $: 'PriceOracleGrowthState',
            ...args
        }
    },
    fromSlice(s: c.Slice): PriceOracleGrowthState {
        return {
            $: 'PriceOracleGrowthState',
            confirmedLevel: s.loadUintBig(8),
            candidateLevel: s.loadUintBig(8),
            levelStartedAt: s.loadUintBig(32),
            lastPrice: s.loadUintBig(64),
        }
    },
    store(self: PriceOracleGrowthState, b: c.Builder): void {
        b.storeUint(self.confirmedLevel, 8);
        b.storeUint(self.candidateLevel, 8);
        b.storeUint(self.levelStartedAt, 32);
        b.storeUint(self.lastPrice, 64);
    },
    toCell(self: PriceOracleGrowthState): c.Cell {
        return makeCellFrom<PriceOracleGrowthState>(self, PriceOracleGrowthState.store);
    }
}

/**
 > struct PriceOracleTeamState {
 >     confirmedLevel: uint8
 >     candidateLevel: uint8
 >     levelStartedAt: uint32
 >     lastPrice: uint64
 > }
 */
export interface PriceOracleTeamState {
    readonly $: 'PriceOracleTeamState'
    confirmedLevel: uint8
    candidateLevel: uint8
    levelStartedAt: uint32
    lastPrice: uint64
}

export const PriceOracleTeamState = {
    create(args: {
        confirmedLevel: uint8
        candidateLevel: uint8
        levelStartedAt: uint32
        lastPrice: uint64
    }): PriceOracleTeamState {
        return {
            $: 'PriceOracleTeamState',
            ...args
        }
    },
    fromSlice(s: c.Slice): PriceOracleTeamState {
        return {
            $: 'PriceOracleTeamState',
            confirmedLevel: s.loadUintBig(8),
            candidateLevel: s.loadUintBig(8),
            levelStartedAt: s.loadUintBig(32),
            lastPrice: s.loadUintBig(64),
        }
    },
    store(self: PriceOracleTeamState, b: c.Builder): void {
        b.storeUint(self.confirmedLevel, 8);
        b.storeUint(self.candidateLevel, 8);
        b.storeUint(self.levelStartedAt, 32);
        b.storeUint(self.lastPrice, 64);
    },
    toCell(self: PriceOracleTeamState): c.Cell {
        return makeCellFrom<PriceOracleTeamState>(self, PriceOracleTeamState.store);
    }
}

/**
 > struct PriceOracleStorage {
 >     admin: address
 >     confirmationDelay: uint32
 >     targets: Cell<PriceOracleTargets>
 >     growth: Cell<PriceOracleGrowthState>
 >     team: Cell<PriceOracleTeamState>
 > }
 */
export interface PriceOracleStorage {
    readonly $: 'PriceOracleStorage'
    admin: c.Address
    confirmationDelay: uint32
    targets: CellRef<PriceOracleTargets>
    growth: CellRef<PriceOracleGrowthState>
    team: CellRef<PriceOracleTeamState>
}

export const PriceOracleStorage = {
    create(args: {
        admin: c.Address
        confirmationDelay: uint32
        targets: CellRef<PriceOracleTargets>
        growth: CellRef<PriceOracleGrowthState>
        team: CellRef<PriceOracleTeamState>
    }): PriceOracleStorage {
        return {
            $: 'PriceOracleStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): PriceOracleStorage {
        return {
            $: 'PriceOracleStorage',
            admin: s.loadAddress(),
            confirmationDelay: s.loadUintBig(32),
            targets: loadCellRef<PriceOracleTargets>(s, PriceOracleTargets.fromSlice),
            growth: loadCellRef<PriceOracleGrowthState>(s, PriceOracleGrowthState.fromSlice),
            team: loadCellRef<PriceOracleTeamState>(s, PriceOracleTeamState.fromSlice),
        }
    },
    store(self: PriceOracleStorage, b: c.Builder): void {
        b.storeAddress(self.admin);
        b.storeUint(self.confirmationDelay, 32);
        storeCellRef<PriceOracleTargets>(self.targets, b, PriceOracleTargets.store);
        storeCellRef<PriceOracleGrowthState>(self.growth, b, PriceOracleGrowthState.store);
        storeCellRef<PriceOracleTeamState>(self.team, b, PriceOracleTeamState.store);
    },
    toCell(self: PriceOracleStorage): c.Cell {
        return makeCellFrom<PriceOracleStorage>(self, PriceOracleStorage.store);
    }
}

// ————————————————————————————————————————————
//    class PriceOracle
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

export class PriceOracle implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgECGwEABG0AART/APSkE/S88sgLAQIBYgIDAgLOBAUCASAREgIBIAYHAGNCDAAZcwghAF9eEA4CDAApcwghAdzWUA4CDAA5cwghA7msoA4MAEloIRKgXyAODywM6ATbPiRkTDgINcsIkJIEAzjAtcsIkJIECzjAtcsIkJIEByOOzHtRND6SNYf1PiSJMcF8uBkAdD6UDH6UDH6UDHU0QT6SPpI+kgwAsj6VPpU+lQUzMkCyPpSzszOye1U4NcsIkJIECTjAtcsIkJIEBSAICQoLAOMIMABljCCCAYK4OAgwAKWMIIIDBXA4CDAA5YwgggYK4DgIMAEljCCCDBXAOAgwAWWMIIIYLHo4CDABpYwggjBX+jgIMAHljCCCYLDuOAgwAiWMIILBYOI4CDACZcwghAGCwcQ4MAKloIQDBYOIODywM6AA8DHtRND6SNYf1NT4kiXHBfLgZAHQ0wfTB9Mf0z8x0QfXCz9TAqQgwgqOGzAxAsjLB8sHFssfFcs/yQPI+lISzszMzsntVOAg8AETvpxTIb2VMvgjOAGRMeKVOFtwUgfiAsjLB8sHFssfFcs/yQPI+lISzszMzsntVAD2Me1E0PpI1h/U1NdM+JIlxwXy4GTQ0wfTB9Mf0z8x0QfXCz9TAqQgwgSOHDAxAsjLB8sHFssfFcs/yQPI+lISzswSzMzJ7VTgIPACE76cUyG9lTL4IzgBkTHilThbcFIH4gLIywfLBxbLHxXLP8kDyPpSEs7MEszMye1UAHQx7UTQ+kjWH9T4kiTHBfLgZAHQ+lD6UPpQ1DHRBvpIMMj6VMkCyPpU+lQV+lQUzMkCyPpSzszOye1UBO6P7FvtRND6SNMf1NQB0NMH0wfTH9M/0QOkIMEL8uDOUSK68uDQIPLg0PgjURagvvLg0SDIywdwzwsnEss/ySPQ+lD6UDH6UNTR0PpQ0QjI+lIXyx8VzMwSzsntVCFukTHjDiJukTLjDiBukVvjDuDXLCJCSBA0MQwNDg8AQoIK+vCAyM+FiBP6Ulj6AoIQSEkBBs8LiiHPCwfJgBH7AABEggr68IDIz4WIFPpSUAP6AoIQSEkBBs8LiiLPCwfJgBH7AAA+ggr68IDIz4WIEvpSAfoCghBISQQEzwuKywfJgBH7AAHUjuMw7UTQ+kjTH9TU10zQ0wfTB9Mf0z/RA6QgwQXy4M5RIrry4NAg8uDQ+CNRFqC+8uDR+CMhyMsHcM8LJxPLP8kk0PpQMfpQ+lAx1DHRB8j6UhbLHxTMEswTzMntVCJukl8D4w7gxwDysRAARoIK+vCAyM+FiBT6UlAD+gKCEEhJAwHPC4oSywfLH8mAEfsAAgFIExQACb6IB4AUAgEgFRYCASAZGgIBIBcYADGztjtRNDUMdQx10zQ0wfTBzHTHzHTPzHRgAC2tlPaiaGoY6hjrpmhpg5jpg+mP6Z/owAAJruX4AMAALbGte1E0NQx10zQ0wfTBzHTHzHTPzHRgACmy0TtRNDUMddM0NMHMdMH0x/TP9GA=');

    static Errors = {
        'Errors.InvalidMessage': 49,
        'Errors.NotAdmin': 100,
        'Errors.InvalidLevel': 206,
        'Errors.TimerNotStarted': 208,
        'Errors.TimerNotMature': 209,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new PriceOracle(address);
    }

    static fromStorage(emptyStorage: {
        admin: c.Address
        confirmationDelay: uint32
        targets: CellRef<PriceOracleTargets>
        growth: CellRef<PriceOracleGrowthState>
        team: CellRef<PriceOracleTeamState>
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? PriceOracle.CodeCell,
            data: PriceOracleStorage.toCell(PriceOracleStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new PriceOracle(address, initialState);
    }

    static createCellOfReportGrowthPrice(body: {
        price: uint64
    }) {
        return ReportGrowthPrice.toCell(ReportGrowthPrice.create(body));
    }

    static createCellOfConfirmGrowthLevel(body: {
    }) {
        return ConfirmGrowthLevel.toCell(ConfirmGrowthLevel.create());
    }

    static createCellOfReportTeamPrice(body: {
        price: uint64
    }) {
        return ReportTeamPrice.toCell(ReportTeamPrice.create(body));
    }

    static createCellOfConfirmTeamLevel(body: {
    }) {
        return ConfirmTeamLevel.toCell(ConfirmTeamLevel.create());
    }

    static createCellOfSetOracleTargets(body: {
        growthEngine: c.Address
        teamVestingVault: c.Address
        merkleRewardVault: c.Address
    }) {
        return SetOracleTargets.toCell(SetOracleTargets.create(body));
    }

    static createCellOfSetCampaignWinnerTarget(body: {
        campaignWinnerVault: c.Address
    }) {
        return SetCampaignWinnerTarget.toCell(SetCampaignWinnerTarget.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendReportGrowthPrice(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        price: uint64
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ReportGrowthPrice.toCell(ReportGrowthPrice.create(body)),
            ...extraOptions
        });
    }

    async sendConfirmGrowthLevel(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ConfirmGrowthLevel.toCell(ConfirmGrowthLevel.create()),
            ...extraOptions
        });
    }

    async sendReportTeamPrice(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        price: uint64
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ReportTeamPrice.toCell(ReportTeamPrice.create(body)),
            ...extraOptions
        });
    }

    async sendConfirmTeamLevel(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ConfirmTeamLevel.toCell(ConfirmTeamLevel.create()),
            ...extraOptions
        });
    }

    async sendSetOracleTargets(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        growthEngine: c.Address
        teamVestingVault: c.Address
        merkleRewardVault: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetOracleTargets.toCell(SetOracleTargets.create(body)),
            ...extraOptions
        });
    }

    async sendSetCampaignWinnerTarget(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        campaignWinnerVault: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetCampaignWinnerTarget.toCell(SetCampaignWinnerTarget.create(body)),
            ...extraOptions
        });
    }

    async getGrowthConfirmedLevel(provider: ContractProvider): Promise<uint8> {
        const r = StackReader.fromGetMethod(1, await provider.get('growth_confirmed_level', []));
        return r.readBigInt();
    }

    async getTeamConfirmedLevel(provider: ContractProvider): Promise<uint8> {
        const r = StackReader.fromGetMethod(1, await provider.get('team_confirmed_level', []));
        return r.readBigInt();
    }

    async getGrowthCandidateState(provider: ContractProvider): Promise<[
        uint8,
        uint32,
        uint64,
    ]> {
        const r = StackReader.fromGetMethod(3, await provider.get('growth_candidate_state', []));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }

    async getTeamCandidateState(provider: ContractProvider): Promise<[
        uint8,
        uint32,
        uint64,
    ]> {
        const r = StackReader.fromGetMethod(3, await provider.get('team_candidate_state', []));
        return [
            r.readBigInt(),
            r.readBigInt(),
            r.readBigInt(),
        ];
    }

    async getGrowthThresholdFor(provider: ContractProvider, level: uint8): Promise<uint64> {
        const r = StackReader.fromGetMethod(1, await provider.get('growth_threshold_for', [
            { type: 'int', value: level },
        ]));
        return r.readBigInt();
    }

    async getTeamThresholdFor(provider: ContractProvider, level: uint8): Promise<uint64> {
        const r = StackReader.fromGetMethod(1, await provider.get('team_threshold_for', [
            { type: 'int', value: level },
        ]));
        return r.readBigInt();
    }
}
