import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/PriceOracle.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ORACLE_ADMIN", "Select HI oracle admin wallet");
    val oracle = PriceOracle.fromAddress(
        promptJettonAddressRequired("HI_PRICE_ORACLE_ADDRESS", "Enter PriceOracle address"),
    );
    val campaignWinner = promptJettonAddressRequired(
        "HI_CAMPAIGN_WINNER_ADDRESS",
        "Enter CampaignWinnerVault address",
    );
    val value = promptJettonCoins("HI_ORACLE_MSG_VALUE", "Enter attached nanotons", "50000000");
    val res = oracle.sendSetCampaignWinnerTarget(admin.address, campaignWinner, { value });
    println(res.waitForTrace());
    println("HI_ORACLE_GROWTH_CONFIRMED_LEVEL={}", oracle.growthConfirmedLevel());
    println("HI_ORACLE_TEAM_CONFIRMED_LEVEL={}", oracle.teamConfirmedLevel());
}
