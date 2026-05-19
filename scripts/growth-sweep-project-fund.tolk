import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/GrowthEngine.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ADMIN", "Select HI admin wallet");
    val growth = GrowthEngine.fromAddress(
        promptJettonAddressRequired("HI_GROWTH_ENGINE_ADDRESS", "Enter GrowthEngine address"),
    );
    val value = promptJettonCoins(
        "HI_GROWTH_SWEEP_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    val res = growth.sendSweepGrowthProjectFund(admin.address, { value });
    println(res.waitForTrace());
    println("HI_GROWTH_STATE={}", growth.growthState());
}
