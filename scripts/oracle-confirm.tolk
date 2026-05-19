import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/PriceOracle.gen"
import "utils/common"

fun main() {
    val caller = promptJettonWallet("HI_ORACLE_CONFIRM_CALLER", "Select oracle confirm caller");
    val oracle = PriceOracle.fromAddress(
        promptJettonAddressRequired("HI_PRICE_ORACLE_ADDRESS", "Enter PriceOracle address"),
    );
    val kind = promptJettonCoins(
        "HI_ORACLE_CONFIRM_KIND",
        "Enter confirm kind: 1 growth, 2 team",
        "1",
    );
    val value = promptJettonCoins(
        "HI_ORACLE_CONFIRM_VALUE",
        "Enter confirm message value",
        "300000000",
    );
    val res = kind == 2
        ? oracle.sendConfirmTeamLevel(caller.address, { value })
        : oracle.sendConfirmGrowthLevel(caller.address, { value });
    println(res.waitForTrace());
    println("HI_ORACLE_GROWTH_CONFIRMED_LEVEL={}", oracle.growthConfirmedLevel());
    println("HI_ORACLE_TEAM_CONFIRMED_LEVEL={}", oracle.teamConfirmedLevel());
}
