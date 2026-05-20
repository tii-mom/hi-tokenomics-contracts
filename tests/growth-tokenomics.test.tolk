import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@acton/types/message"

import "@contracts/errors"
import "@contracts/messages"
import "@contracts/tokenomics-messages"
import "@contracts/tokenomics-storage"
import "@wrappers/CampaignWinnerVault.gen"
import "@wrappers/GrowthEngine.gen"
import "@wrappers/MerkleRewardVault.gen"
import "@wrappers/PriceOracle.gen"
import "@wrappers/TeamVestingVault.gen"
import "@wrappers/utils"

import "test-utils"

const HI = 1000000000
const GROWTH_POOL = 5000000000 * HI
const TEAM_POOL = 1200000000 * HI
const REWARD_POOL = 1600000000 * HI
const WINNER_POOL = 400000000 * HI
const WINNER_ALLOCATION = 5000000 * HI

fun migrationConfig(a: address, b: address): Cell<GrowthMigrationConfig> {
    return GrowthMigrationConfig {
        migrationWallet1: a,
        migrationWallet2: b,
    }.toCell();
}

fun setupGrowth(): (GrowthEngine, Treasury, Treasury, Treasury, Treasury) {
    val admin = testing.treasury("growth-admin");
    val oracle = testing.treasury("growth-oracle");
    val buyer = testing.treasury("growth-buyer");
    val projectFund = testing.treasury("growth-project-fund");
    val migration2 = testing.treasury("growth-migration-2");
    val wallet = testing.treasury("growth-jetton-wallet");
    val growth = GrowthEngine.fromStorage({
        config: GrowthEngineConfig {
            admin: admin.address,
            projectFundWallet: projectFund.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: GrowthEngineCounters {
            growthPoolTotalHi: GROWTH_POOL,
            growthSoldHi: 0,
            growthClaimedHi: 0,
            growthMissedHi: 0,
            growthMigratedHi: 0,
        }.toCell(),
        maps: GrowthEngineMaps {
            purchasedTon: [],
            positions: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        growthJettonWallet: wallet.address,
        migrationTarget: null,
        growthEnabled: true,
        permanentlyClosed: false,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(growth.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: growth.address,
    });
    return (growth, admin, oracle, buyer, projectFund);
}

get fun `test growth engine: level 0 buy uses 10100 HI per TON and releases initial 5 percent`() {
    val (minter, minterAdmin, _) = setupTest();
    val (growth, admin, _, buyer, _) = setupGrowth();
    val growthWallet = mintTo(minter, minterAdmin, growth.address, GROWTH_POOL);
    expect(
        growth.sendSetGrowthJettonWallet(
            admin.address,
            growthWallet.address,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetGrowthJettonWallet>({
        from: admin.address,
        to: growth.address,
    });

    val buyerWallet = userWallet(minter, buyer.address);
    expect(
        growth.sendBuyGrowth(buyer.address, ton("1"), { value: ton("1.15") }),
    ).toHaveSuccessfulTx<BuyGrowth>({
        from: buyer.address,
        to: growth.address,
    });
    expect(buyerWallet.getJettonBalance()).toEqual(505 * HI);
    expect(growth.buyerState(buyer.address).1).toEqual(10100 * HI);
    expect(growth.buyerState(buyer.address).3).toEqual(505 * HI);

    expect(
        growth.sendBuyGrowth(buyer.address, ton("1"), { value: ton("1.149") }),
    ).toHaveFailedTx<BuyGrowth>({
        from: buyer.address,
        to: growth.address,
        exitCode: Errors.InsufficientAttachedTon,
    });
}

get fun `test growth engine: late buy does not catch up level 0 or historical levels`() {
    val (minter, minterAdmin, _) = setupTest();
    val (growth, admin, oracle, buyer, _) = setupGrowth();
    val growthWallet = mintTo(minter, minterAdmin, growth.address, GROWTH_POOL);
    growth.sendSetGrowthJettonWallet(admin.address, growthWallet.address, { value: ton("0.05") });
    val buyerWallet = userWallet(minter, buyer.address);

    expect(
        growth.sendSetGrowthConfirmedLevel(oracle.address, 3, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetGrowthConfirmedLevel>({
        from: oracle.address,
        to: growth.address,
    });
    expect(
        growth.sendBuyGrowth(buyer.address, ton("1"), { value: ton("1.15") }),
    ).toHaveSuccessfulTx<BuyGrowth>({
        from: buyer.address,
        to: growth.address,
    });
    expect(buyerWallet.getJettonBalance()).toEqual(0);
    expect(growth.buyerState(buyer.address).3).toEqual(0);
    expect(growth.buyerState(buyer.address).4).toEqual(0);

    expect(
        growth.sendSetGrowthConfirmedLevel(oracle.address, 4, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetGrowthConfirmedLevel>({
        from: oracle.address,
        to: growth.address,
    });
    expect(growth.buyerState(buyer.address).4).toEqual(1010 * HI);

    expect(
        growth.sendSetGrowthConfirmedLevel(oracle.address, 10, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetGrowthConfirmedLevel>({
        from: oracle.address,
        to: growth.address,
    });
    expect(growth.buyerState(buyer.address).4).toEqual(6565 * HI);
}

get fun `test growth engine: project fund sweep bounce restores uncommitted and missed state`() {
    val (minter, minterAdmin, _) = setupTest();
    val (growth, admin, oracle, buyer, _) = setupGrowth();
    val growthWallet = mintTo(minter, minterAdmin, growth.address, GROWTH_POOL);
    growth.sendSetGrowthJettonWallet(admin.address, growthWallet.address, { value: ton("0.05") });
    growth.sendSetGrowthConfirmedLevel(oracle.address, 3, { value: ton("0.05") });
    growth.sendBuyGrowth(buyer.address, ton("1"), { value: ton("1.15") });
    val before = growth.growthState();

    growth.sendCloseGrowthEngine(admin.address, { value: ton("0.05") });
    val res = testing.processSingleTraceStep(
        admin.address,
        createMessage({
            bounce: true,
            value: ton("0.3"),
            dest: growth.address,
            body: SweepGrowthProjectFund {},
        }),
    );
    expect(growth.growthState().3).toEqual(0);
    expect(growth.growthState().5).toEqual(0);

    val outMsg = res.outMessages.at<AskToTransfer>(0);
    val outBody = outMsg.loadBody();
    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(outBody.toCell().beginParse())
        .endCell();
    val bouncedMsg = createMessage({
        bounce: false,
        value: ton("0.95"),
        dest: growth.address,
        body: bouncedBody,
    }).bounced();
    testing.processSingleTraceStep(growthWallet.address, bouncedMsg);

    expect(growth.growthState().3).toEqual(before.3);
    expect(growth.growthState().5).toEqual(before.5);
    expect(
        growth.sendSweepGrowthProjectFund(admin.address, { value: ton("0.3") }),
    ).toHaveSuccessfulTx<SweepGrowthProjectFund>({
        from: admin.address,
        to: growth.address,
    });
    expect(growth.growthState().3).toEqual(0);
    expect(growth.growthState().5).toEqual(0);
}

get fun `test price oracle: growth and team levels use independent confirmation timers`() {
    testing.setNow(1000);
    val admin = testing.treasury("oracle-admin");
    val caller = testing.treasury("oracle-caller");
    val oracle = PriceOracle.fromStorage({
        admin: admin.address,
        confirmationDelay: 30,
        targets: PriceOracleTargets {
            growthEngine: null,
            teamVestingVault: null,
            merkleRewardVault: null,
            campaignTargets: PriceOracleCampaignTargets { campaignWinnerVault: null }.toCell(),
        }.toCell(),
        growth: PriceOracleGrowthState {
            confirmedLevel: 0,
            candidateLevel: 0,
            levelStartedAt: 0,
            lastPrice: 0,
        }.toCell(),
        team: PriceOracleTeamState {
            confirmedLevel: 0,
            candidateLevel: 0,
            levelStartedAt: 0,
            lastPrice: 0,
        }.toCell(),
    });
    expect(oracle.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: oracle.address,
    });

    expect(
        oracle.sendReportGrowthPrice(admin.address, 396000, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<ReportGrowthPrice>({
        from: admin.address,
        to: oracle.address,
    });
    expect(oracle.sendConfirmGrowthLevel(caller.address, { value: ton("0.05") })).toHaveFailedTx({
        from: caller.address,
        to: oracle.address,
        exitCode: Errors.TimerNotMature,
    });
    testing.setNow(1030);
    expect(
        oracle.sendConfirmGrowthLevel(caller.address, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<ConfirmGrowthLevel>({
        from: caller.address,
        to: oracle.address,
    });
    expect(oracle.growthConfirmedLevel()).toEqual(1);
    expect(oracle.teamConfirmedLevel()).toEqual(0);

    expect(
        oracle.sendReportTeamPrice(admin.address, 100000000, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<ReportTeamPrice>({
        from: admin.address,
        to: oracle.address,
    });
    testing.setNow(1060);
    expect(
        oracle.sendConfirmTeamLevel(caller.address, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<ConfirmTeamLevel>({
        from: caller.address,
        to: oracle.address,
    });
    expect(oracle.teamConfirmedLevel()).toEqual(1);
}

get fun `test team vesting: four team price levels release 300M HI each`() {
    val admin = testing.treasury("team-admin");
    val oracle = testing.treasury("team-oracle");
    val teamWallet = testing.treasury("team-wallet");
    val migration2 = testing.treasury("team-migration-2");
    val jettonWallet = testing.treasury("team-jetton-wallet");
    val team = TeamVestingVault.fromStorage({
        config: TeamVestingConfig {
            admin: admin.address,
            teamWallet: teamWallet.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: TeamVestingCounters {
            totalHi: TEAM_POOL,
            claimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: TeamVestingMaps {
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        teamJettonWallet: jettonWallet.address,
        migrationTarget: null,
        teamConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(team.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: team.address,
    });
    expect(
        team.sendSyncTeamPriceLevel(oracle.address, 1, 0, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SyncTeamPriceLevel>({
        from: oracle.address,
        to: team.address,
    });
    expect(team.vestingState().2).toEqual(300000000 * HI);
}

get fun `test campaign winner: registration follows growth engine unlock schedule`() {
    val admin = testing.treasury("campaign-admin");
    val oracle = testing.treasury("campaign-oracle");
    val winner = testing.treasury("campaign-winner");
    val earlyWinner = testing.treasury("campaign-early-winner");
    val migration2 = testing.treasury("campaign-migration-2");
    val jettonWallet = testing.treasury("campaign-jetton-wallet");
    val vault = CampaignWinnerVault.fromStorage({
        config: CampaignWinnerConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: CampaignWinnerCounters {
            winnerCount: 0,
            totalClaimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: CampaignWinnerMaps {
            winners: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        winnerJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    expect(
        vault.sendRegisterCampaignWinner(
            admin.address,
            earlyWinner.address,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<RegisterCampaignWinner>({
        from: admin.address,
        to: vault.address,
    });
    expect(vault.claimable(earlyWinner.address)).toEqual(WINNER_ALLOCATION * 5 / 100);
    expect(
        vault.sendSetGrowthConfirmedLevel(oracle.address, 1, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetGrowthConfirmedLevel>({
        from: oracle.address,
        to: vault.address,
    });
    expect(vault.claimable(earlyWinner.address)).toEqual(WINNER_ALLOCATION * 15 / 100);
    expect(
        vault.sendSetGrowthConfirmedLevel(oracle.address, 3, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetGrowthConfirmedLevel>({
        from: oracle.address,
        to: vault.address,
    });
    expect(
        vault.sendRegisterCampaignWinner(admin.address, winner.address, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<RegisterCampaignWinner>({
        from: admin.address,
        to: vault.address,
    });
    expect(vault.claimable(winner.address)).toEqual(0);
    expect(
        vault.sendSetGrowthConfirmedLevel(oracle.address, 4, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetGrowthConfirmedLevel>({
        from: oracle.address,
        to: vault.address,
    });
    expect(vault.claimable(winner.address)).toEqual(WINNER_ALLOCATION * 10 / 100);
    expect(
        vault.sendSetGrowthConfirmedLevel(oracle.address, 10, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetGrowthConfirmedLevel>({
        from: oracle.address,
        to: vault.address,
    });
    expect(vault.claimable(winner.address)).toEqual(WINNER_ALLOCATION * 65 / 100);
}

get fun `test merkle reward: required growth level gates claims and tracks ecosystem cap`() {
    val admin = testing.treasury("reward-admin");
    val oracle = testing.treasury("reward-oracle");
    val claimant = testing.treasury("reward-claimant");
    val migration2 = testing.treasury("reward-migration-2");
    val jettonWallet = testing.treasury("reward-jetton-wallet");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });

    val amount = 1000 * HI;
    val batchId = 1 as uint64;
    val root = beginCell()
        .storeUint(batchId, 64)
        .storeAddress(claimant.address)
        .storeCoins(amount)
        .hash();
    val emptyProof = beginCell().storeBool(false).storeBool(false).endCell();
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            batchId,
            root,
            amount,
            0,
            1,
            2,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
    expect(
        vault.sendClaimReward(claimant.address, batchId, amount, emptyProof, { value: ton("0.3") }),
    ).toHaveFailedTx({
        from: claimant.address,
        to: vault.address,
        exitCode: Errors.InvalidLevel,
    });
    expect(
        vault.sendSetRewardGrowthLevel(oracle.address, 2, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<SetRewardGrowthLevel>({
        from: oracle.address,
        to: vault.address,
    });
    expect(
        vault.sendClaimReward(claimant.address, batchId, amount, emptyProof, { value: ton("0.3") }),
    ).toHaveSuccessfulTx<ClaimReward>({
        from: claimant.address,
        to: vault.address,
    });
    expect(vault.hasClaimed(batchId, claimant.address)).toEqual(true);
}

get fun `test merkle reward: deep proof chain should support more than shallow cell limits`() {
    val admin = testing.treasury("reward-admin-deep");
    val oracle = testing.treasury("reward-oracle-deep");
    val claimant = testing.treasury("reward-claimant-deep");
    val migration2 = testing.treasury("reward-migration-2-deep");
    val jettonWallet = testing.treasury("reward-jetton-wallet-deep");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    val batchId = 2;
    val amount = ton("1");
    val leaf = beginCell()
        .storeUint(batchId, 64)
        .storeAddress(claimant.address)
        .storeCoins(amount)
        .hash();
    val sibling1 = beginCell().storeUint(1, 256).hash();
    val sibling2 = beginCell().storeUint(2, 256).hash();
    val sibling3 = beginCell().storeUint(3, 256).hash();
    val root1 = beginCell().storeUint(leaf, 256).storeUint(sibling1, 256).hash();
    val root2 = beginCell().storeUint(sibling2, 256).storeUint(root1, 256).hash();
    val root3 = beginCell().storeUint(root2, 256).storeUint(sibling3, 256).hash();
    val proofTail = beginCell()
        .storeBool(true)
        .storeUint(sibling3, 256)
        .storeBool(false)
        .storeBool(false)
        .endCell();
    val proofMid = beginCell()
        .storeBool(true)
        .storeUint(sibling2, 256)
        .storeBool(true)
        .storeBool(true)
        .storeRef(proofTail)
        .endCell();
    val proof = beginCell()
        .storeBool(true)
        .storeUint(sibling1, 256)
        .storeBool(false)
        .storeBool(true)
        .storeRef(proofMid)
        .endCell();
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            batchId,
            root3,
            amount,
            0,
            1,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
    expect(
        vault.sendClaimReward(claimant.address, batchId, amount, proof, { value: ton("0.3") }),
    ).toHaveSuccessfulTx<ClaimReward>({
        from: claimant.address,
        to: vault.address,
    });
    expect(
        vault.sendClaimReward(claimant.address, batchId, amount, proof, { value: ton("0.3") }),
    ).toHaveFailedTx({
        from: claimant.address,
        to: vault.address,
        exitCode: Errors.AlreadyClaimed,
    });
}

get fun `test merkle reward: invalid and malformed chained proofs should fail`() {
    val admin = testing.treasury("reward-admin-invalid-chain");
    val oracle = testing.treasury("reward-oracle-invalid-chain");
    val claimant = testing.treasury("reward-claimant-invalid-chain");
    val migration2 = testing.treasury("reward-migration-2-invalid-chain");
    val jettonWallet = testing.treasury("reward-jetton-wallet-invalid-chain");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    val batchId = 3;
    val amount = ton("1");
    val leaf = beginCell()
        .storeUint(batchId, 64)
        .storeAddress(claimant.address)
        .storeCoins(amount)
        .hash();
    val sibling = beginCell().storeUint(10, 256).hash();
    val root = beginCell().storeUint(leaf, 256).storeUint(sibling, 256).hash();
    val invalidSibling = beginCell().storeUint(11, 256).hash();
    val invalidProof = beginCell()
        .storeBool(true)
        .storeUint(invalidSibling, 256)
        .storeBool(false)
        .storeBool(false)
        .endCell();
    val malformedProof = beginCell().storeBool(true).endCell();

    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            batchId,
            root,
            amount,
            0,
            1,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
    expect(
        vault.sendClaimReward(
            claimant.address,
            batchId,
            amount,
            invalidProof,
            { value: ton("0.3") },
        ),
    ).toHaveFailedTx({
        from: claimant.address,
        to: vault.address,
        exitCode: Errors.InvalidProof,
    });
    expect(
        vault.sendClaimReward(
            claimant.address,
            batchId,
            amount,
            malformedProof,
            { value: ton("0.3") },
        ),
    ).toHaveFailedTx({
        from: claimant.address,
        to: vault.address,
        exitCode: 9,
    });
}

get fun `test migration: target must be allowlisted before selection`() {
    val target = testing.treasury("migration-target");

    val (growth, growthAdmin, _, _, _) = setupGrowth();
    expect(
        growth.sendSetGrowthMigrationTarget(
            growthAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx({
        from: growthAdmin.address,
        to: growth.address,
        exitCode: Errors.MigrationTargetNotAllowed,
    });
    expect(
        growth.sendSetGrowthMigrationTargetAllowed(
            growthAdmin.address,
            target.address,
            true,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetGrowthMigrationTargetAllowed>({
        from: growthAdmin.address,
        to: growth.address,
    });
    expect(
        growth.sendSetGrowthMigrationTarget(
            growthAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetGrowthMigrationTarget>({
        from: growthAdmin.address,
        to: growth.address,
    });

    val teamAdmin = testing.treasury("migration-team-admin");
    val teamOracle = testing.treasury("migration-team-oracle");
    val teamWallet = testing.treasury("migration-team-wallet");
    val teamMigration2 = testing.treasury("migration-team-migration-2");
    val teamJettonWallet = testing.treasury("migration-team-jetton-wallet");
    val team = TeamVestingVault.fromStorage({
        config: TeamVestingConfig {
            admin: teamAdmin.address,
            teamWallet: teamWallet.address,
            migration: migrationConfig(teamAdmin.address, teamMigration2.address),
        }.toCell(),
        counters: TeamVestingCounters {
            totalHi: TEAM_POOL,
            claimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: TeamVestingMaps {
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: teamOracle.address,
        teamJettonWallet: teamJettonWallet.address,
        migrationTarget: null,
        teamConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(team.deploy(teamAdmin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: team.address,
    });
    expect(
        team.sendSetTeamMigrationTarget(
            teamAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx({
        from: teamAdmin.address,
        to: team.address,
        exitCode: Errors.MigrationTargetNotAllowed,
    });
    expect(
        team.sendSetTeamMigrationTargetAllowed(
            teamAdmin.address,
            target.address,
            true,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetTeamMigrationTargetAllowed>({
        from: teamAdmin.address,
        to: team.address,
    });
    expect(
        team.sendSetTeamMigrationTarget(
            teamAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetTeamMigrationTarget>({
        from: teamAdmin.address,
        to: team.address,
    });
    expect(
        team.sendTransferTeamUncommittedHiToContract(
            teamAdmin.address,
            1 * HI,
            { value: ton("0.3") },
        ),
    ).toHaveFailedTx({
        from: teamAdmin.address,
        to: team.address,
        exitCode: Errors.InsufficientInventory,
    });

    val campaignAdmin = testing.treasury("migration-campaign-admin");
    val campaignOracle = testing.treasury("migration-campaign-oracle");
    val campaignMigration2 = testing.treasury("migration-campaign-migration-2");
    val campaignJettonWallet = testing.treasury("migration-campaign-jetton-wallet");
    val campaign = CampaignWinnerVault.fromStorage({
        config: CampaignWinnerConfig {
            admin: campaignAdmin.address,
            migration: migrationConfig(campaignAdmin.address, campaignMigration2.address),
        }.toCell(),
        counters: CampaignWinnerCounters {
            winnerCount: 0,
            totalClaimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: CampaignWinnerMaps {
            winners: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: campaignOracle.address,
        winnerJettonWallet: campaignJettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(campaign.deploy(campaignAdmin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: campaign.address,
    });
    expect(
        campaign.sendSetCampaignMigrationTarget(
            campaignAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx({
        from: campaignAdmin.address,
        to: campaign.address,
        exitCode: Errors.MigrationTargetNotAllowed,
    });
    expect(
        campaign.sendSetCampaignMigrationTargetAllowed(
            campaignAdmin.address,
            target.address,
            true,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetCampaignMigrationTargetAllowed>({
        from: campaignAdmin.address,
        to: campaign.address,
    });
    expect(
        campaign.sendSetCampaignMigrationTarget(
            campaignAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetCampaignMigrationTarget>({
        from: campaignAdmin.address,
        to: campaign.address,
    });

    val rewardAdmin = testing.treasury("migration-reward-admin");
    val rewardOracle = testing.treasury("migration-reward-oracle");
    val rewardMigration2 = testing.treasury("migration-reward-migration-2");
    val rewardJettonWallet = testing.treasury("migration-reward-jetton-wallet");
    val reward = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: rewardAdmin.address,
            migration: migrationConfig(rewardAdmin.address, rewardMigration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: rewardOracle.address,
        rewardJettonWallet: rewardJettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(reward.deploy(rewardAdmin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: reward.address,
    });
    expect(
        reward.sendSetRewardMigrationTarget(
            rewardAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx({
        from: rewardAdmin.address,
        to: reward.address,
        exitCode: Errors.MigrationTargetNotAllowed,
    });
    expect(
        reward.sendSetRewardMigrationTargetAllowed(
            rewardAdmin.address,
            target.address,
            true,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetRewardMigrationTargetAllowed>({
        from: rewardAdmin.address,
        to: reward.address,
    });
    expect(
        reward.sendSetRewardMigrationTarget(
            rewardAdmin.address,
            target.address,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetRewardMigrationTarget>({
        from: rewardAdmin.address,
        to: reward.address,
    });
}

get fun `test migration: revoked allowlist blocks selected target`() {
    val target = testing.treasury("migration-revoked-target");
    val (growth, growthAdmin, _, _, _) = setupGrowth();
    growth.sendSetGrowthMigrationTargetAllowed(
        growthAdmin.address,
        target.address,
        true,
        { value: ton("0.05") },
    );
    growth.sendSetGrowthMigrationTarget(
        growthAdmin.address,
        target.address,
        { value: ton("0.05") },
    );
    expect(
        growth.sendSetGrowthMigrationTargetAllowed(
            growthAdmin.address,
            target.address,
            false,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<SetGrowthMigrationTargetAllowed>({
        from: growthAdmin.address,
        to: growth.address,
    });
    expect(
        growth.sendTransferGrowthUncommittedHiToContract(
            growthAdmin.address,
            1 * HI,
            { value: ton("0.3") },
        ),
    ).toHaveFailedTx({
        from: growthAdmin.address,
        to: growth.address,
        exitCode: Errors.InvalidMessage,
    });
    growth.sendSetGrowthMigrationTargetAllowed(
        growthAdmin.address,
        target.address,
        true,
        { value: ton("0.05") },
    );
    growth.sendSetGrowthMigrationTarget(
        growthAdmin.address,
        target.address,
        { value: ton("0.05") },
    );
    expect(
        growth.sendTransferGrowthUncommittedHiToContract(
            growthAdmin.address,
            1 * HI,
            { value: ton("0.3") },
        ),
    ).toHaveSuccessfulTx<TransferGrowthUncommittedHiToContract>({
        from: growthAdmin.address,
        to: growth.address,
    });
}

get fun `test reward batch cap accounts for migrated inventory`() {
    val admin = testing.treasury("reward-cap-admin");
    val oracle = testing.treasury("reward-cap-oracle");
    val migration2 = testing.treasury("reward-cap-migration-2");
    val jettonWallet = testing.treasury("reward-cap-jetton-wallet");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: REWARD_POOL - 1000 * HI,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            90,
            beginCell().storeUint(90, 256).hash(),
            1001 * HI,
            0,
            1,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.InsufficientInventory,
    });
}

get fun `test merkle reward: universal lottery is disabled with zero cap`() {
    val admin = testing.treasury("reward-lottery-cap-admin");
    val oracle = testing.treasury("reward-lottery-cap-oracle");
    val migration2 = testing.treasury("reward-lottery-cap-migration-2");
    val jettonWallet = testing.treasury("reward-lottery-cap-jetton-wallet");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    val lotteryCap = 1 * HI;
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            91,
            beginCell().storeUint(91, 256).hash(),
            lotteryCap,
            0,
            2,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.InsufficientInventory,
    });
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            92,
            beginCell().storeUint(92, 256).hash(),
            0,
            0,
            2,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
}

get fun `test merkle reward: red packet cap is 100M HI`() {
    val admin = testing.treasury("reward-red-packet-cap-admin");
    val oracle = testing.treasury("reward-red-packet-cap-oracle");
    val migration2 = testing.treasury("reward-red-packet-cap-migration-2");
    val jettonWallet = testing.treasury("reward-red-packet-cap-jetton-wallet");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    val redPacketCap = 100000000 * HI;
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            93,
            beginCell().storeUint(93, 256).hash(),
            redPacketCap,
            0,
            3,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            94,
            beginCell().storeUint(94, 256).hash(),
            1 * HI,
            0,
            3,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.InsufficientInventory,
    });
}

get fun `test merkle reward: ecosystem uses remaining 1_6B global cap after red packets`() {
    val admin = testing.treasury("reward-global-subcap-admin");
    val oracle = testing.treasury("reward-global-subcap-oracle");
    val migration2 = testing.treasury("reward-global-subcap-migration-2");
    val jettonWallet = testing.treasury("reward-global-subcap-jetton-wallet");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            96,
            beginCell().storeUint(96, 256).hash(),
            100000000 * HI,
            0,
            3,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            97,
            beginCell().storeUint(97, 256).hash(),
            1500000000 * HI,
            0,
            1,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            98,
            beginCell().storeUint(98, 256).hash(),
            1 * HI,
            0,
            1,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.InsufficientInventory,
    });
}

get fun `test campaign registration cap accounts for migrated inventory`() {
    val admin = testing.treasury("campaign-cap-admin");
    val oracle = testing.treasury("campaign-cap-oracle");
    val migration2 = testing.treasury("campaign-cap-migration-2");
    val jettonWallet = testing.treasury("campaign-cap-jetton-wallet");
    val winner = testing.treasury("campaign-cap-winner");
    val vault = CampaignWinnerVault.fromStorage({
        config: CampaignWinnerConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: CampaignWinnerCounters {
            winnerCount: 79,
            totalClaimedHi: 0,
            migratedHi: WINNER_ALLOCATION,
        }.toCell(),
        maps: CampaignWinnerMaps {
            winners: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        winnerJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    expect(
        vault.sendRegisterCampaignWinner(admin.address, winner.address, { value: ton("0.05") }),
    ).toHaveFailedTx<RegisterCampaignWinner>({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.InsufficientInventory,
    });
}

get fun `test campaign winner: exactly 80 five million HI rewards are allowed`() {
    val admin = testing.treasury("campaign-80-admin");
    val oracle = testing.treasury("campaign-80-oracle");
    val migration2 = testing.treasury("campaign-80-migration-2");
    val jettonWallet = testing.treasury("campaign-80-jetton-wallet");
    val winner80 = testing.treasury("campaign-80-winner");
    val winner81 = testing.treasury("campaign-81-winner");
    val vault = CampaignWinnerVault.fromStorage({
        config: CampaignWinnerConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: CampaignWinnerCounters {
            winnerCount: 79,
            totalClaimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: CampaignWinnerMaps {
            winners: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        winnerJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });
    expect(
        vault.sendRegisterCampaignWinner(admin.address, winner80.address, { value: ton("0.05") }),
    ).toHaveSuccessfulTx<RegisterCampaignWinner>({
        from: admin.address,
        to: vault.address,
    });
    expect(vault.vaultState().1).toEqual(80);
    expect(vault.claimable(winner80.address)).toEqual(WINNER_ALLOCATION * 5 / 100);
    expect(
        vault.sendRegisterCampaignWinner(admin.address, winner81.address, { value: ton("0.05") }),
    ).toHaveFailedTx<RegisterCampaignWinner>({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.WinnerLimitExceeded,
    });
}

get fun `test merkle reward: red packet batches can be claimed once and lottery is disabled`() {
    val admin = testing.treasury("reward-lottery-red-packet-admin");
    val oracle = testing.treasury("reward-lottery-red-packet-oracle");
    val claimant = testing.treasury("reward-lottery-red-packet-claimant");
    val migration2 = testing.treasury("reward-lottery-red-packet-migration-2");
    val jettonWallet = testing.treasury("reward-lottery-red-packet-jetton-wallet");
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: admin.address,
            migration: migrationConfig(admin.address, migration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: oracle.address,
        rewardJettonWallet: jettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    expect(vault.deploy(admin.address, { value: ton("0.1") })).toHaveSuccessfulDeploy({
        to: vault.address,
    });

    val lotteryBatchId = 101 as uint64;
    val lotteryAmount = 1 * HI;
    val lotteryRoot = beginCell()
        .storeUint(lotteryBatchId, 64)
        .storeAddress(claimant.address)
        .storeCoins(lotteryAmount)
        .hash();
    val redPacketBatchId = 102 as uint64;
    val redPacketAmount = 500 * HI;
    val redPacketRoot = beginCell()
        .storeUint(redPacketBatchId, 64)
        .storeAddress(claimant.address)
        .storeCoins(redPacketAmount)
        .hash();
    val emptyProof = beginCell().storeBool(false).storeBool(false).endCell();

    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            lotteryBatchId,
            lotteryRoot,
            lotteryAmount,
            0,
            2,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveFailedTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
        exitCode: Errors.InsufficientInventory,
    });
    expect(
        vault.sendCreateRewardBatch(
            admin.address,
            redPacketBatchId,
            redPacketRoot,
            redPacketAmount,
            0,
            3,
            0,
            { value: ton("0.05") },
        ),
    ).toHaveSuccessfulTx<CreateRewardBatch>({
        from: admin.address,
        to: vault.address,
    });
    expect(
        vault.sendClaimReward(
            claimant.address,
            redPacketBatchId,
            redPacketAmount,
            emptyProof,
            { value: ton("0.3") },
        ),
    ).toHaveSuccessfulTx<ClaimReward>({
        from: claimant.address,
        to: vault.address,
    });
    expect(vault.batchState(redPacketBatchId).2).toEqual(redPacketAmount);
    expect(vault.poolState().1).toEqual(0);
    expect(vault.poolState().2).toEqual(redPacketAmount);
    expect(
        vault.sendClaimReward(
            claimant.address,
            redPacketBatchId,
            redPacketAmount,
            emptyProof,
            { value: ton("0.3") },
        ),
    ).toHaveFailedTx({
        from: claimant.address,
        to: vault.address,
        exitCode: Errors.AlreadyClaimed,
    });
}

get fun `test growth buy and claim bounces restore user accounting`() {
    val (growth, _, oracle, buyer, _) = setupGrowth();
    val buyRes = testing.processSingleTraceStep(
        buyer.address,
        createMessage({
            bounce: true,
            value: ton("1.15"),
            dest: growth.address,
            body: BuyGrowth { tonAmount: ton("1") },
        }),
    );
    expect(growth.buyerState(buyer.address).0).toEqual(ton("1"));
    expect(growth.buyerState(buyer.address).1).toEqual(10100 * HI);
    expect(growth.buyerState(buyer.address).3).toEqual(505 * HI);
    val buyOutBody = buyRes.outMessages.at<AskToTransfer>(0).loadBody();
    testing.processSingleTraceStep(
        testing.treasury("growth-jetton-wallet").address,
        createMessage({
            bounce: false,
            value: ton("0.95"),
            dest: growth.address,
            body: beginCell()
                .storeUint(0xffffffff, 32)
                .storeSlice(buyOutBody.toCell().beginParse())
                .endCell(),
        }).bounced(),
    );
    expect(growth.buyerState(buyer.address).0).toEqual(0);
    expect(growth.buyerState(buyer.address).1).toEqual(0);
    expect(growth.buyerState(buyer.address).3).toEqual(0);

    growth.sendBuyGrowth(buyer.address, ton("1"), { value: ton("1.15") });
    growth.sendSetGrowthConfirmedLevel(oracle.address, 1, { value: ton("0.05") });
    val claimRes = testing.processSingleTraceStep(
        buyer.address,
        createMessage({
            bounce: true,
            value: ton("0.3"),
            dest: growth.address,
            body: ClaimGrowth {},
        }),
    );
    expect(growth.buyerState(buyer.address).3).toEqual(1515 * HI);
    val claimOutBody = claimRes.outMessages.at<AskToTransfer>(0).loadBody();
    testing.processSingleTraceStep(
        testing.treasury("growth-jetton-wallet").address,
        createMessage({
            bounce: false,
            value: ton("0.95"),
            dest: growth.address,
            body: beginCell()
                .storeUint(0xffffffff, 32)
                .storeSlice(claimOutBody.toCell().beginParse())
                .endCell(),
        }).bounced(),
    );
    expect(growth.buyerState(buyer.address).3).toEqual(505 * HI);
}

get fun `test campaign and reward claim bounces restore accounting`() {
    val campaignAdmin = testing.treasury("campaign-bounce-admin");
    val campaignOracle = testing.treasury("campaign-bounce-oracle");
    val winner = testing.treasury("campaign-bounce-winner");
    val campaignMigration2 = testing.treasury("campaign-bounce-migration-2");
    val campaignJettonWallet = testing.treasury("campaign-bounce-jetton-wallet");
    val campaign = CampaignWinnerVault.fromStorage({
        config: CampaignWinnerConfig {
            admin: campaignAdmin.address,
            migration: migrationConfig(campaignAdmin.address, campaignMigration2.address),
        }.toCell(),
        counters: CampaignWinnerCounters {
            winnerCount: 0,
            totalClaimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: CampaignWinnerMaps {
            winners: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: campaignOracle.address,
        winnerJettonWallet: campaignJettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    campaign.deploy(campaignAdmin.address, { value: ton("0.1") });
    campaign.sendRegisterCampaignWinner(
        campaignAdmin.address,
        winner.address,
        { value: ton("0.05") },
    );
    val campaignRes = testing.processSingleTraceStep(
        winner.address,
        createMessage({
            bounce: true,
            value: ton("0.3"),
            dest: campaign.address,
            body: ClaimCampaignWinner {},
        }),
    );
    expect(campaign.winnerState(winner.address).2).toEqual(WINNER_ALLOCATION * 5 / 100);
    expect(campaign.vaultState().2).toEqual(WINNER_ALLOCATION * 5 / 100);
    val campaignOutBody = campaignRes.outMessages.at<AskToTransfer>(0).loadBody();
    testing.processSingleTraceStep(
        campaignJettonWallet.address,
        createMessage({
            bounce: false,
            value: ton("0.95"),
            dest: campaign.address,
            body: beginCell()
                .storeUint(0xffffffff, 32)
                .storeSlice(campaignOutBody.toCell().beginParse())
                .endCell(),
        }).bounced(),
    );
    expect(campaign.winnerState(winner.address).2).toEqual(0);
    expect(campaign.vaultState().2).toEqual(0);

    val rewardAdmin = testing.treasury("reward-bounce-admin");
    val rewardOracle = testing.treasury("reward-bounce-oracle");
    val claimant = testing.treasury("reward-bounce-claimant");
    val rewardMigration2 = testing.treasury("reward-bounce-migration-2");
    val rewardJettonWallet = testing.treasury("reward-bounce-jetton-wallet");
    val reward = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: rewardAdmin.address,
            migration: migrationConfig(rewardAdmin.address, rewardMigration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: rewardOracle.address,
        rewardJettonWallet: rewardJettonWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    reward.deploy(rewardAdmin.address, { value: ton("0.1") });
    val batchId = 91;
    val amount = 1000 * HI;
    val root = beginCell()
        .storeUint(batchId, 64)
        .storeAddress(claimant.address)
        .storeCoins(amount)
        .hash();
    val proof = beginCell().storeBool(false).storeBool(false).endCell();
    reward.sendCreateRewardBatch(
        rewardAdmin.address,
        batchId,
        root,
        amount,
        0,
        1,
        0,
        { value: ton("0.05") },
    );
    val rewardRes = testing.processSingleTraceStep(
        claimant.address,
        createMessage({
            bounce: true,
            value: ton("0.3"),
            dest: reward.address,
            body: ClaimReward { batchId, amount, proof },
        }),
    );
    expect(reward.hasClaimed(batchId, claimant.address)).toEqual(true);
    expect(reward.batchState(batchId).2).toEqual(amount);
    val rewardOutBody = rewardRes.outMessages.at<AskToTransfer>(0).loadBody();
    testing.processSingleTraceStep(
        rewardJettonWallet.address,
        createMessage({
            bounce: false,
            value: ton("0.95"),
            dest: reward.address,
            body: beginCell()
                .storeUint(0xffffffff, 32)
                .storeSlice(rewardOutBody.toCell().beginParse())
                .endCell(),
        }).bounced(),
    );
    expect(reward.hasClaimed(batchId, claimant.address)).toEqual(false);
    expect(reward.batchState(batchId).2).toEqual(0);
}

get fun `test migration transfer bounces restore migrated accounting`() {
    val target = testing.treasury("migration-bounce-target");
    val (growth, growthAdmin, _, _, _) = setupGrowth();
    val growthWallet = testing.treasury("migration-bounce-growth-wallet");
    growth.sendSetGrowthJettonWallet(
        growthAdmin.address,
        growthWallet.address,
        { value: ton("0.05") },
    );
    growth.sendSetGrowthMigrationTargetAllowed(
        growthAdmin.address,
        target.address,
        true,
        { value: ton("0.05") },
    );
    growth.sendSetGrowthMigrationTarget(
        growthAdmin.address,
        target.address,
        { value: ton("0.05") },
    );
    val growthRes = testing.processSingleTraceStep(
        growthAdmin.address,
        createMessage({
            bounce: true,
            value: ton("0.3"),
            dest: growth.address,
            body: TransferGrowthUncommittedHiToContract { amount: 1000 * HI },
        }),
    );
    expect(growth.growthState().4).toEqual(1000 * HI);
    val growthOutBody = growthRes.outMessages.at<AskToTransfer>(0).loadBody();
    testing.processSingleTraceStep(
        growthWallet.address,
        createMessage({
            bounce: false,
            value: ton("0.95"),
            dest: growth.address,
            body: beginCell()
                .storeUint(0xffffffff, 32)
                .storeSlice(growthOutBody.toCell().beginParse())
                .endCell(),
        }).bounced(),
    );
    expect(growth.growthState().4).toEqual(0);

    val campaignAdmin = testing.treasury("campaign-migration-bounce-admin");
    val campaignOracle = testing.treasury("campaign-migration-bounce-oracle");
    val campaignMigration2 = testing.treasury("campaign-migration-bounce-migration-2");
    val campaignWallet = testing.treasury("campaign-migration-bounce-wallet");
    val campaign = CampaignWinnerVault.fromStorage({
        config: CampaignWinnerConfig {
            admin: campaignAdmin.address,
            migration: migrationConfig(campaignAdmin.address, campaignMigration2.address),
        }.toCell(),
        counters: CampaignWinnerCounters {
            winnerCount: 0,
            totalClaimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: CampaignWinnerMaps {
            winners: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: campaignOracle.address,
        winnerJettonWallet: campaignWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    campaign.deploy(campaignAdmin.address, { value: ton("0.1") });
    campaign.sendSetCampaignMigrationTargetAllowed(
        campaignAdmin.address,
        target.address,
        true,
        { value: ton("0.05") },
    );
    campaign.sendSetCampaignMigrationTarget(
        campaignAdmin.address,
        target.address,
        { value: ton("0.05") },
    );
    val campaignRes = testing.processSingleTraceStep(
        campaignAdmin.address,
        createMessage({
            bounce: true,
            value: ton("0.3"),
            dest: campaign.address,
            body: TransferCampaignUncommittedHiToContract { amount: 1000 * HI },
        }),
    );
    expect(campaign.vaultState().3).toEqual(1000 * HI);
    val campaignOutBody = campaignRes.outMessages.at<AskToTransfer>(0).loadBody();
    testing.processSingleTraceStep(
        campaignWallet.address,
        createMessage({
            bounce: false,
            value: ton("0.95"),
            dest: campaign.address,
            body: beginCell()
                .storeUint(0xffffffff, 32)
                .storeSlice(campaignOutBody.toCell().beginParse())
                .endCell(),
        }).bounced(),
    );
    expect(campaign.vaultState().3).toEqual(0);

    val rewardAdmin = testing.treasury("reward-migration-bounce-admin");
    val rewardOracle = testing.treasury("reward-migration-bounce-oracle");
    val rewardMigration2 = testing.treasury("reward-migration-bounce-migration-2");
    val rewardWallet = testing.treasury("reward-migration-bounce-wallet");
    val reward = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig {
            admin: rewardAdmin.address,
            migration: migrationConfig(rewardAdmin.address, rewardMigration2.address),
        }.toCell(),
        counters: MerkleRewardCounters {
            ecosystemTotalHi: 0,
            universalTotalHi: 0,
            redPacketTotalHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: MerkleRewardMaps {
            batches: [],
            claimed: [],
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle: rewardOracle.address,
        rewardJettonWallet: rewardWallet.address,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    reward.deploy(rewardAdmin.address, { value: ton("0.1") });
    reward.sendSetRewardMigrationTargetAllowed(
        rewardAdmin.address,
        target.address,
        true,
        { value: ton("0.05") },
    );
    reward.sendSetRewardMigrationTarget(
        rewardAdmin.address,
        target.address,
        { value: ton("0.05") },
    );
    val rewardRes = testing.processSingleTraceStep(
        rewardAdmin.address,
        createMessage({
            bounce: true,
            value: ton("0.3"),
            dest: reward.address,
            body: TransferRewardUncommittedHiToContract { amount: 1000 * HI },
        }),
    );
    expect(reward.poolState().3).toEqual(1000 * HI);
    val rewardOutBody = rewardRes.outMessages.at<AskToTransfer>(0).loadBody();
    testing.processSingleTraceStep(
        rewardWallet.address,
        createMessage({
            bounce: false,
            value: ton("0.95"),
            dest: reward.address,
            body: beginCell()
                .storeUint(0xffffffff, 32)
                .storeSlice(rewardOutBody.toCell().beginParse())
                .endCell(),
        }).bounced(),
    );
    expect(reward.poolState().3).toEqual(0);
}
