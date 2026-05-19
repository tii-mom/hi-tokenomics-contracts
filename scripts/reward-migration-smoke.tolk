import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/MerkleRewardVault.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ECOSYSTEM_ADMIN", "Select HI ecosystem admin wallet");
    val migration = promptJettonWallet("HI_MIGRATION_WALLET", "Select HI migration wallet");
    val vault = MerkleRewardVault.fromAddress(
        promptJettonAddressRequired(
            "HI_MERKLE_REWARD_ADDRESS",
            "Enter MerkleRewardVault address",
        ),
    );
    val target = promptJettonAddressRequired(
        "HI_REWARD_MIGRATION_TARGET",
        "Enter configured target contract",
    );
    val amount = promptJettonCoins(
        "HI_REWARD_MIGRATION_AMOUNT",
        "Enter HI base units to transfer",
        "1000000000",
    );
    val value = promptJettonCoins(
        "HI_REWARD_MIGRATION_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    println(
        vault
            .sendSetRewardMigrationTargetAllowed(
                admin.address,
                target,
                true,
                { value: ton("0.05") },
            )
            .waitForTrace(),
    );
    println(
        vault
            .sendSetRewardMigrationTarget(migration.address, target, { value: ton("0.05") })
            .waitForTrace(),
    );
    println(
        vault
            .sendTransferRewardUncommittedHiToContract(migration.address, amount, { value })
            .waitForTrace(),
    );
    println("HI_REWARD_POOL_STATE={}", vault.poolState());
}
