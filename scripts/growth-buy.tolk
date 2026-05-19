import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/GrowthEngine.gen"
import "utils/common"

fun main() {
    val buyer = promptJettonWallet("HI_BUYER", "Select HI GrowthEngine buyer wallet");
    val growth = GrowthEngine.fromAddress(
        promptJettonAddressRequired("HI_GROWTH_ENGINE_ADDRESS", "Enter GrowthEngine address"),
    );
    val tonAmount = promptJettonCoins(
        "HI_PURCHASE_TON_AMOUNT",
        "Enter purchase nanotons",
        "100000000",
    );
    val value = promptJettonCoins(
        "HI_PURCHASE_MSG_VALUE",
        "Enter attached nanotons",
        "250000000",
    );
    val res = growth.sendBuyGrowth(buyer.address, tonAmount, { value });
    println(res.waitForTrace());
    println("HI_GROWTH_BUYER_STATE={}", growth.buyerState(buyer.address));
    println("HI_GROWTH_STATE={}", growth.growthState());
}
