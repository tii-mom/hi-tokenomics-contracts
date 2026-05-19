import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/MerkleRewardVault.gen"
import "utils/common"

fun main() {
    val claimant = promptJettonWallet("HI_REWARD_CLAIMANT_WALLET", "Select reward claimant wallet");
    val vault = MerkleRewardVault.fromAddress(
        promptJettonAddressRequired(
            "HI_MERKLE_REWARD_ADDRESS",
            "Enter MerkleRewardVault address",
        ),
    );
    val batchId = promptJettonCoins("HI_REWARD_BATCH_ID", "Enter reward batch id", "1");
    val amount = promptJettonCoins("HI_REWARD_AMOUNT", "Enter reward amount", "100000000000");
    val value = promptJettonCoins(
        "HI_REWARD_CLAIM_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    val proof = beginCell().storeBool(false).storeBool(false).endCell();
    val res = vault.sendClaimReward(claimant.address, batchId as uint64, amount, proof, { value });
    println(res.waitForTrace());
    println("HI_REWARD_HAS_CLAIMED={}", vault.hasClaimed(batchId as uint64, claimant.address));
    println("HI_REWARD_BATCH_STATE={}", vault.batchState(batchId as uint64));
}
