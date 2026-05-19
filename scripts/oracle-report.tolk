import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/PriceOracle.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ORACLE_ADMIN", "Select HI oracle admin wallet");
    val oracle = PriceOracle.fromAddress(
        promptJettonAddressRequired("HI_PRICE_ORACLE_ADDRESS", "Enter PriceOracle address"),
    );
    val kind = promptJettonCoins(
        "HI_ORACLE_PRICE_KIND",
        "Enter oracle price kind: 1 growth, 2 team",
        "1",
    );
    val price = promptJettonCoins("HI_ORACLE_PRICE", "Enter fixed-point HI price", "396000");
    val value = promptJettonCoins("HI_ORACLE_MSG_VALUE", "Enter oracle message value", "50000000");
    val res = kind == 2
        ? oracle.sendReportTeamPrice(admin.address, price as uint64, { value })
        : oracle.sendReportGrowthPrice(admin.address, price as uint64, { value });
    println(res.waitForTrace());
    println("HI_ORACLE_GROWTH_CONFIRMED_LEVEL={}", oracle.growthConfirmedLevel());
    println("HI_ORACLE_GROWTH_CANDIDATE_STATE={}", oracle.growthCandidateState());
    println("HI_ORACLE_TEAM_CONFIRMED_LEVEL={}", oracle.teamConfirmedLevel());
    println("HI_ORACLE_TEAM_CANDIDATE_STATE={}", oracle.teamCandidateState());
}
