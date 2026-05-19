import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/CampaignWinnerVault.gen"
import "utils/common"

fun main() {
    val winnerWallet = promptJettonWallet(
        "HI_CAMPAIGN_WINNER_WALLET",
        "Select campaign winner wallet",
    );
    val vault = CampaignWinnerVault.fromAddress(
        promptJettonAddressRequired(
            "HI_CAMPAIGN_WINNER_ADDRESS",
            "Enter CampaignWinnerVault address",
        ),
    );
    val value = promptJettonCoins(
        "HI_CAMPAIGN_CLAIM_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    val res = vault.sendClaimCampaignWinner(winnerWallet.address, { value });
    println(res.waitForTrace());
    println("HI_CAMPAIGN_WINNER_STATE={}", vault.winnerState(winnerWallet.address));
    println("HI_CAMPAIGN_VAULT_STATE={}", vault.vaultState());
}
