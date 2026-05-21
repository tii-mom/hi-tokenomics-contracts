import "@acton/env"
import "@acton/io"
import "@wrappers/CampaignWinnerVault.gen"
import "@wrappers/GrowthEngine.gen"
import "@wrappers/MerkleRewardVault.gen"
import "@wrappers/PriceOracle.gen"
import "@wrappers/TeamVestingVault.gen"

fun main() {
    val growth = GrowthEngine.fromAddress(env<address>("HI_GROWTH_ENGINE_ADDRESS")!);
    val oracle = PriceOracle.fromAddress(env<address>("HI_PRICE_ORACLE_ADDRESS")!);
    val team = TeamVestingVault.fromAddress(env<address>("HI_TEAM_VESTING_ADDRESS")!);
    val merkle = MerkleRewardVault.fromAddress(env<address>("HI_MERKLE_REWARD_ADDRESS")!);
    val campaign = CampaignWinnerVault.fromAddress(env<address>("HI_CAMPAIGN_WINNER_ADDRESS")!);

    println("GROWTH_STATE={}", growth.growthState());
    println("ORACLE_GROWTH_CONFIRMED_LEVEL={}", oracle.growthConfirmedLevel());
    println("ORACLE_TEAM_CONFIRMED_LEVEL={}", oracle.teamConfirmedLevel());
    println("ORACLE_GROWTH_CANDIDATE_STATE={}", oracle.growthCandidateState());
    println("ORACLE_TEAM_CANDIDATE_STATE={}", oracle.teamCandidateState());
    println("TEAM_VESTING_STATE={}", team.vestingState());
    println("MERKLE_POOL_STATE={}", merkle.poolState());
    println("CAMPAIGN_VAULT_STATE={}", campaign.vaultState());
    println("CAMPAIGN_GROWTH_CONFIRMED_LEVEL={}", campaign.growthConfirmedLevel());
}
