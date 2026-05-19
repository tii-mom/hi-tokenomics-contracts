import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/GrowthEngine.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ADMIN", "Select HI admin wallet");
    val migration = promptJettonWallet("HI_MIGRATION_WALLET", "Select HI migration wallet");
    val growth = GrowthEngine.fromAddress(
        promptJettonAddressRequired("HI_GROWTH_ENGINE_ADDRESS", "Enter GrowthEngine address"),
    );
    val target = promptJettonAddressRequired(
        "HI_GROWTH_MIGRATION_TARGET",
        "Enter configured target contract",
    );
    val amount = promptJettonCoins(
        "HI_GROWTH_MIGRATION_AMOUNT",
        "Enter HI base units to transfer",
        "1000000000",
    );
    val value = promptJettonCoins(
        "HI_GROWTH_MIGRATION_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    println(
        growth
            .sendSetGrowthMigrationTargetAllowed(
                admin.address,
                target,
                true,
                { value: ton("0.05") },
            )
            .waitForTrace(),
    );
    println(
        growth
            .sendSetGrowthMigrationTarget(migration.address, target, { value: ton("0.05") })
            .waitForTrace(),
    );
    println(
        growth
            .sendTransferGrowthUncommittedHiToContract(migration.address, amount, { value })
            .waitForTrace(),
    );
    println("HI_GROWTH_STATE={}", growth.growthState());
}
