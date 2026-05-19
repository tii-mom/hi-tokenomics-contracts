import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/CampaignWinnerVault.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_CAMPAIGN_ADMIN", "Select HI campaign admin wallet");
    val migration = promptJettonWallet("HI_MIGRATION_WALLET", "Select HI migration wallet");
    val vault = CampaignWinnerVault.fromAddress(
        promptJettonAddressRequired(
            "HI_CAMPAIGN_WINNER_ADDRESS",
            "Enter CampaignWinnerVault address",
        ),
    );
    val target = promptJettonAddressRequired(
        "HI_CAMPAIGN_MIGRATION_TARGET",
        "Enter configured target contract",
    );
    val amount = promptJettonCoins(
        "HI_CAMPAIGN_MIGRATION_AMOUNT",
        "Enter HI base units to transfer",
        "1000000000",
    );
    val value = promptJettonCoins(
        "HI_CAMPAIGN_MIGRATION_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    println(
        vault
            .sendSetCampaignMigrationTargetAllowed(
                admin.address,
                target,
                true,
                { value: ton("0.05") },
            )
            .waitForTrace(),
    );
    println(
        vault
            .sendSetCampaignMigrationTarget(migration.address, target, { value: ton("0.05") })
            .waitForTrace(),
    );
    println(
        vault
            .sendTransferCampaignUncommittedHiToContract(migration.address, amount, { value })
            .waitForTrace(),
    );
    println("HI_CAMPAIGN_VAULT_STATE={}", vault.vaultState());
}
