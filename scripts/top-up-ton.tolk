import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@contracts/messages"
import "utils/common"

fun main() {
    val sender = promptJettonWallet("HI_TON_SENDER", "Select TON sender wallet");
    val recipient = promptJettonAddressRequired("HI_TON_RECIPIENT", "Enter TON recipient");
    val amount = promptJettonCoins("HI_TON_AMOUNT", "Enter nanotons to send", "100000000");
    val topUpMessage = createMessage({
        bounce: false,
        dest: recipient,
        value: amount,
        body: TopUpTons {},
    });
    println(net.send(sender.address, topUpMessage).waitForTrace());
}
