import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/CampaignWinnerVault.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_CAMPAIGN_ADMIN", "Select HI campaign admin wallet");
    val vault = CampaignWinnerVault.fromAddress(
        promptJettonAddressRequired(
            "HI_CAMPAIGN_WINNER_ADDRESS",
            "Enter CampaignWinnerVault address",
        ),
    );
    val winner = promptJettonAddressRequired("HI_CAMPAIGN_WINNER", "Enter winner address");
    val value = promptJettonCoins(
        "HI_CAMPAIGN_ADMIN_MSG_VALUE",
        "Enter attached nanotons",
        "50000000",
    );
    val res = vault.sendRegisterCampaignWinner(admin.address, winner, { value });
    println(res.waitForTrace());
    println("HI_CAMPAIGN_WINNER_STATE={}", vault.winnerState(winner));
    println("HI_CAMPAIGN_VAULT_STATE={}", vault.vaultState());
}
