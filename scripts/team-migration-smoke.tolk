import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/TeamVestingVault.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ADMIN", "Select HI admin wallet");
    val migration = promptJettonWallet("HI_MIGRATION_WALLET", "Select HI migration wallet");
    val vault = TeamVestingVault.fromAddress(
        promptJettonAddressRequired("HI_TEAM_VESTING_ADDRESS", "Enter TeamVestingVault address"),
    );
    val target = promptJettonAddressRequired(
        "HI_TEAM_MIGRATION_TARGET",
        "Enter configured target contract",
    );
    val amount = promptJettonCoins(
        "HI_TEAM_MIGRATION_AMOUNT",
        "Enter HI base units to transfer; 0 only checks allowlist and target selection",
        "0",
    );
    val value = promptJettonCoins(
        "HI_TEAM_MIGRATION_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    println(
        vault
            .sendSetTeamMigrationTargetAllowed(
                admin.address,
                target,
                true,
                { value: ton("0.05") },
            )
            .waitForTrace(),
    );
    println(
        vault
            .sendSetTeamMigrationTarget(migration.address, target, { value: ton("0.05") })
            .waitForTrace(),
    );
    if (amount > 0) {
        println(
            vault
                .sendTransferTeamUncommittedHiToContract(migration.address, amount, { value })
                .waitForTrace(),
        );
    }
    println("HI_TEAM_VESTING_STATE={}", vault.vestingState());
}
