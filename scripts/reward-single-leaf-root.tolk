import "@acton/io"
import "utils/common"

fun main() {
    val claimant = promptJettonAddressRequired("HI_REWARD_CLAIMANT", "Enter reward claimant");
    val batchId = promptJettonCoins("HI_REWARD_BATCH_ID", "Enter reward batch id", "1");
    val amount = promptJettonCoins("HI_REWARD_AMOUNT", "Enter reward amount", "100000000000");
    val root = beginCell()
        .storeUint(batchId as uint64, 64)
        .storeAddress(claimant)
        .storeCoins(amount)
        .hash();
    println("HI_REWARD_SINGLE_LEAF_ROOT={}", root);
}
