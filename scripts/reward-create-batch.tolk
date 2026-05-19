import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/MerkleRewardVault.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ECOSYSTEM_ADMIN", "Select HI ecosystem admin wallet");
    val vault = MerkleRewardVault.fromAddress(
        promptJettonAddressRequired(
            "HI_MERKLE_REWARD_ADDRESS",
            "Enter MerkleRewardVault address",
        ),
    );
    val batchId = promptJettonCoins("HI_REWARD_BATCH_ID", "Enter reward batch id", "1");
    val root = promptJettonCoins("HI_REWARD_ROOT", "Enter reward Merkle root", "0");
    val totalHi = promptJettonCoins(
        "HI_REWARD_TOTAL_HI",
        "Enter reward batch total",
        "100000000000",
    );
    val metadataHash = promptJettonCoins("HI_REWARD_METADATA_HASH", "Enter metadata hash", "0");
    val poolType = promptJettonCoins(
        "HI_REWARD_POOL_TYPE",
        "Enter pool type: 1 ecosystem, 2 universal lottery, 3 red packet",
        "1",
    );
    val requiredGrowthLevel = promptJettonCoins(
        "HI_REWARD_REQUIRED_GROWTH_LEVEL",
        "Enter required growth level 0-10",
        "0",
    );
    val value = promptJettonCoins(
        "HI_REWARD_ADMIN_MSG_VALUE",
        "Enter attached nanotons",
        "50000000",
    );
    val res = vault.sendCreateRewardBatch(
        admin.address,
        batchId as uint64,
        root as uint256,
        totalHi,
        metadataHash as uint256,
        poolType as uint8,
        requiredGrowthLevel as uint8,
        SendParams { value },
    );
    println(res.waitForTrace());
    println("HI_REWARD_BATCH_STATE={}", vault.batchState(batchId as uint64));
}
