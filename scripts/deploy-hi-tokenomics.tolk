import "@acton/env"
import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@contracts/errors"
import "@contracts/messages"
import "@contracts/tokenomics-storage"
import "@wrappers/CampaignWinnerVault.gen"
import "@wrappers/GrowthEngine.gen"
import "@wrappers/JettonMinter.gen"
import "@wrappers/JettonWallet.gen"
import "@wrappers/MerkleRewardVault.gen"
import "@wrappers/PriceOracle.gen"
import "@wrappers/TeamVestingVault.gen"
import "@wrappers/utils"
import "utils/common"

const HI_UNIT = 1000000000

const GROWTH_ENGINE_HI = 5000000000 * HI_UNIT
const MERKLE_REWARD_HI = 1600000000 * HI_UNIT
const CAMPAIGN_WINNER_HI = 400000000 * HI_UNIT
const TEAM_HI = 1200000000 * HI_UNIT
const PROJECT_FUND_HI = 1000000000 * HI_UNIT
const LIQUIDITY_HI = 500000000 * HI_UNIT
const INVESTOR_HI = 300000000 * HI_UNIT

fun main() {
    val deployer = promptJettonWallet("HI_DEPLOYER", "Select HI deployer wallet");
    val admin = promptJettonAddress("HI_ADMIN_ADDRESS", "Enter HI admin address", deployer.address);
    val oracleAdmin = promptJettonAddress(
        "HI_ORACLE_ADMIN_ADDRESS",
        "Enter HI oracle admin address",
        admin,
    );
    val ecosystemAdmin = promptJettonAddress(
        "HI_ECOSYSTEM_ADMIN_ADDRESS",
        "Enter HI ecosystem admin address",
        admin,
    );
    val migrationWallet1 = promptJettonAddress(
        "HI_MIGRATION_WALLET_1",
        "Enter HI migration wallet 1",
        admin,
    );
    val migrationWallet2 = promptJettonAddress(
        "HI_MIGRATION_WALLET_2",
        "Enter HI migration wallet 2",
        admin,
    );
    val teamWallet = promptJettonAddressRequired("HI_TEAM_WALLET", "Enter HI team wallet");
    val projectFundWallet = promptJettonAddressRequired(
        "HI_PROJECT_FUND_WALLET",
        "Enter HI project-fund wallet",
    );
    val liquidityWallet = promptJettonAddressRequired(
        "HI_LIQUIDITY_WALLET",
        "Enter HI liquidity wallet",
    );
    val investorWallet = promptJettonAddressRequired(
        "HI_INVESTOR_WALLET",
        "Enter HI investor wallet",
    );

    val migration = GrowthMigrationConfig { migrationWallet1, migrationWallet2 }.toCell();

    val minter = deployJettonMinter(deployer, promptJettonMinterStorage(admin));
    val oracle = deployPriceOracle(deployer, oracleAdmin);
    val growth = deployGrowthEngine(deployer, admin, oracle.address, projectFundWallet, migration);
    val team = deployTeamVesting(deployer, admin, oracle.address, teamWallet, migration);
    val rewards = deployRewards(deployer, ecosystemAdmin, oracle.address, migration);
    val campaignWinner = deployCampaignWinner(deployer, admin, oracle.address, migration);

    oracle
        .sendSetOracleTargets(
            oracleAdmin,
            growth.address,
            team.address,
            rewards.address,
            { value: ton("0.05") },
        )
        .waitForFirstTransaction();
    oracle
        .sendSetCampaignWinnerTarget(
            oracleAdmin,
            campaignWinner.address,
            { value: ton("0.05") },
        )
        .waitForFirstTransaction();

    val growthJettonWallet = minter.getWalletAddress(growth.address);
    val teamJettonWallet = minter.getWalletAddress(team.address);
    val rewardJettonWallet = minter.getWalletAddress(rewards.address);
    val campaignWinnerJettonWallet = minter.getWalletAddress(campaignWinner.address);

    growth
        .sendSetGrowthJettonWallet(admin, growthJettonWallet, { value: deployMsgValue() })
        .waitForFirstTransaction();
    team
        .sendSetTeamJettonWallet(admin, teamJettonWallet, { value: deployMsgValue() })
        .waitForFirstTransaction();
    rewards
        .sendSetRewardJettonWallet(ecosystemAdmin, rewardJettonWallet, { value: deployMsgValue() })
        .waitForFirstTransaction();
    campaignWinner
        .sendSetCampaignWinnerJettonWallet(
            admin,
            campaignWinnerJettonWallet,
            { value: deployMsgValue() },
        )
        .waitForFirstTransaction();

    mintHi(minter, admin, growth.address, GROWTH_ENGINE_HI);
    mintHi(minter, admin, rewards.address, MERKLE_REWARD_HI);
    mintHi(minter, admin, campaignWinner.address, CAMPAIGN_WINNER_HI);
    mintHi(minter, admin, team.address, TEAM_HI);
    mintHi(minter, admin, projectFundWallet, PROJECT_FUND_HI);
    mintHi(minter, admin, liquidityWallet, LIQUIDITY_HI);
    mintHi(minter, admin, investorWallet, INVESTOR_HI);

    assertPreDropAllocation(minter, growth.address, GROWTH_ENGINE_HI, "HI_GROWTH_ENGINE");
    assertPreDropAllocation(minter, rewards.address, MERKLE_REWARD_HI, "HI_MERKLE_REWARD");
    assertPreDropAllocation(
        minter,
        campaignWinner.address,
        CAMPAIGN_WINNER_HI,
        "HI_CAMPAIGN_WINNER",
    );
    assertPreDropAllocation(minter, team.address, TEAM_HI, "HI_TEAM_VESTING");
    assertPreDropAllocation(minter, projectFundWallet, PROJECT_FUND_HI, "HI_PROJECT_FUND");
    assertPreDropAllocation(minter, liquidityWallet, LIQUIDITY_HI, "HI_LIQUIDITY");
    assertPreDropAllocation(minter, investorWallet, INVESTOR_HI, "HI_INVESTOR");

    val minterData = minter.getJettonData();
    assert (minterData.totalSupply == 10000000000 * HI_UNIT) throw Errors.InvalidMessage;
    assert (minterData.mintable) throw Errors.InvalidMessage;
    assert (minterData.adminAddress != null) throw Errors.InvalidMessage;
    assert (minterData.adminAddress! == admin) throw Errors.InvalidMessage;
    println("HI_POST_MINT_TOTAL_SUPPLY={}", minterData.totalSupply);
    println("HI_POST_MINT_MINTABLE={}", minterData.mintable);
    println("HI_POST_MINT_ADMIN_ADDRESS={}", minterData.adminAddress);
    minter.sendDropMinterAdmin(admin, 1, { value: deployMsgValue() }).waitForFirstTransaction();
    val postDropData = minter.getJettonData();
    assert (postDropData.totalSupply == 10000000000 * HI_UNIT) throw Errors.InvalidMessage;
    assert (!postDropData.mintable) throw Errors.InvalidMessage;
    assert (postDropData.adminAddress == null) throw Errors.InvalidMessage;
    println("HI_POST_DROP_TOTAL_SUPPLY={}", postDropData.totalSupply);
    println("HI_POST_DROP_MINTABLE={}", postDropData.mintable);
    println("HI_POST_DROP_ADMIN_ADDRESS={}", postDropData.adminAddress);

    println("HI_MINTER_ADDRESS={}", minter.address);
    println("HI_PRICE_ORACLE_ADDRESS={}", oracle.address);
    println("HI_GROWTH_ENGINE_ADDRESS={}", growth.address);
    println("HI_TEAM_VESTING_ADDRESS={}", team.address);
    println("HI_MERKLE_REWARD_ADDRESS={}", rewards.address);
    println("HI_CAMPAIGN_WINNER_ADDRESS={}", campaignWinner.address);
    println("HI_GROWTH_JETTON_WALLET={}", growthJettonWallet);
    println("HI_TEAM_JETTON_WALLET={}", teamJettonWallet);
    println("HI_REWARD_JETTON_WALLET={}", rewardJettonWallet);
    println("HI_CAMPAIGN_WINNER_JETTON_WALLET={}", campaignWinnerJettonWallet);
    printJettonMinterInfo(minter, "HI");
    printJettonWalletInfo(minter, growth.address, "HI_GROWTH_ENGINE");
    printJettonWalletInfo(minter, rewards.address, "HI_MERKLE_REWARD");
    printJettonWalletInfo(minter, campaignWinner.address, "HI_CAMPAIGN_WINNER");
    printJettonWalletInfo(minter, team.address, "HI_TEAM_VESTING");
    printJettonWalletInfo(minter, projectFundWallet, "HI_PROJECT_FUND");
    printJettonWalletInfo(minter, liquidityWallet, "HI_LIQUIDITY");
    printJettonWalletInfo(minter, investorWallet, "HI_INVESTOR");
}

fun deployCampaignWinner(
    deployer: ActonWallet,
    admin: address,
    oracle: address,
    migration: Cell<GrowthMigrationConfig>,
): CampaignWinnerVault {
    val vault = CampaignWinnerVault.fromStorage({
        config: CampaignWinnerConfig { admin, migration }.toCell(),
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
        oracle,
        winnerJettonWallet: null,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    vault.deploy(deployer.address, { value: deployMsgValue() }).waitForFirstTransaction();
    return vault;
}

fun deployPriceOracle(deployer: ActonWallet, admin: address): PriceOracle {
    val oracle = PriceOracle.fromStorage({
        admin,
        confirmationDelay: oracleConfirmationDelay(),
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
    oracle.deploy(deployer.address, { value: deployMsgValue() }).waitForFirstTransaction();
    return oracle;
}

fun deployGrowthEngine(
    deployer: ActonWallet,
    admin: address,
    oracle: address,
    projectFundWallet: address,
    migration: Cell<GrowthMigrationConfig>,
): GrowthEngine {
    val growth = GrowthEngine.fromStorage({
        config: GrowthEngineConfig { admin, projectFundWallet, migration }.toCell(),
        counters: GrowthEngineCounters {
            growthPoolTotalHi: GROWTH_ENGINE_HI,
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
        oracle,
        growthJettonWallet: null,
        migrationTarget: null,
        growthEnabled: true,
        permanentlyClosed: false,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    growth.deploy(deployer.address, { value: deployMsgValue() }).waitForFirstTransaction();
    return growth;
}

fun deployTeamVesting(
    deployer: ActonWallet,
    admin: address,
    oracle: address,
    teamWallet: address,
    migration: Cell<GrowthMigrationConfig>,
): TeamVestingVault {
    val vault = TeamVestingVault.fromStorage({
        config: TeamVestingConfig { admin, teamWallet, migration }.toCell(),
        counters: TeamVestingCounters {
            totalHi: TEAM_HI,
            claimedHi: 0,
            migratedHi: 0,
        }.toCell(),
        maps: TeamVestingMaps {
            pendingTransfers: [],
            migrationAllowlist: [],
        }.toCell(),
        oracle,
        teamJettonWallet: null,
        migrationTarget: null,
        teamConfirmedLevel: 0,
        nextQueryId: 1,
    });
    vault.deploy(deployer.address, { value: deployMsgValue() }).waitForFirstTransaction();
    return vault;
}

fun deployRewards(
    deployer: ActonWallet,
    admin: address,
    oracle: address,
    migration: Cell<GrowthMigrationConfig>,
): MerkleRewardVault {
    val vault = MerkleRewardVault.fromStorage({
        config: MerkleRewardConfig { admin, migration }.toCell(),
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
        oracle,
        rewardJettonWallet: null,
        migrationTarget: null,
        growthConfirmedLevel: 0,
        nextQueryId: 1,
    });
    vault.deploy(deployer.address, { value: deployMsgValue() }).waitForFirstTransaction();
    return vault;
}

fun mintHi(minter: JettonMinter, admin: address, recipient: address, amount: coins) {
    println("HI_MINT_RECIPIENT={}", recipient);
    val forwardPayload = beginCell().storeUint(0, 1).toSlice();
    println(
        minter
            .sendMintNewJettons(
                admin,
                0,
                recipient,
                mintTotalTonAmount(),
                InternalTransferStep {
                    queryId: 0,
                    jettonAmount: amount,
                    transferInitiator: null,
                    sendExcessesTo: null,
                    forwardTonAmount: mintForwardTonAmount(),
                    forwardPayload,
                },
                { value: mintTotalTonAmount() + ton("0.015") },
            )
            .waitForTrace(),
    );
}

fun assertPreDropAllocation(minter: JettonMinter, owner: address, expected: coins, label: string) {
    val wallet = JettonWallet { address: minter.getWalletAddress(owner) };
    val actual = wallet.getJettonBalance();
    println("{} PRE_DROP_BALANCE={}", label, actual);
    assert (actual == expected) throw Errors.InvalidMessage;
}

fun deployMsgValue(): coins {
    return env<coins>("HI_DEPLOY_MSG_VALUE") ?? ton("0.05");
}

fun mintForwardTonAmount(): coins {
    return env<coins>("HI_MINT_FORWARD_TON_AMOUNT") ?? 0;
}

fun mintTotalTonAmount(): coins {
    return env<coins>("HI_MINT_TOTAL_TON_AMOUNT") ?? ton("0.08");
}

fun oracleConfirmationDelay(): uint32 {
    return (env<int>("HI_ORACLE_CONFIRMATION_DELAY") ?? 86400) as uint32;
}
