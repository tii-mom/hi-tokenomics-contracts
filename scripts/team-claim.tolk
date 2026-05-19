import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/TeamVestingVault.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("HI_ADMIN", "Select HI admin wallet");
    val vault = TeamVestingVault.fromAddress(
        promptJettonAddressRequired("HI_TEAM_VESTING_ADDRESS", "Enter TeamVestingVault address"),
    );
    val value = promptJettonCoins(
        "HI_TEAM_CLAIM_MSG_VALUE",
        "Enter attached nanotons",
        "300000000",
    );
    val res = vault.sendClaimTeam(admin.address, { value });
    println(res.waitForTrace());
    println("HI_TEAM_VESTING_STATE={}", vault.vestingState());
}
