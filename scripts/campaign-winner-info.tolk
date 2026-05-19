import "@acton/io"
import "@wrappers/CampaignWinnerVault.gen"
import "utils/common"

fun main() {
    val vault = CampaignWinnerVault.fromAddress(
        promptJettonAddressRequired(
            "HI_CAMPAIGN_WINNER_ADDRESS",
            "Enter CampaignWinnerVault address",
        ),
    );
    val winner = promptJettonAddressRequired("HI_CAMPAIGN_WINNER", "Enter winner address");
    println("HI_CAMPAIGN_WINNER_STATE={}", vault.winnerState(winner));
    println("HI_CAMPAIGN_VAULT_STATE={}", vault.vaultState());
    println("HI_CAMPAIGN_GROWTH_CONFIRMED_LEVEL={}", vault.growthConfirmedLevel());
}
