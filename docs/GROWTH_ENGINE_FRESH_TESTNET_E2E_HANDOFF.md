# GrowthEngine Fresh Testnet E2E Handoff

Date: 2026-05-19

Purpose: provide a fresh, open, unswept testnet GrowthEngine instance for
`/Users/yudeyou/Desktop/GrowthEngine` TonConnect buy/claim E2E.

This handoff intentionally does **not** reuse the previous rehearsal
GrowthEngine:

```text
kQCkYSkW3DPfsstW696wTU_xmW4B5MnmB3AjfST70piEeWga
```

## Fresh Addresses

| Item | Testnet address |
|---|---|
| `GROWTH_ENGINE_ADDRESS` | `kQDlsrlQBaWA2RmFEr-6Mg-cDd7snY3sTDT4HQSB4B8ujHxW` |
| `TON_HI_CONTRACT_ADDRESS` / `JettonMinter` | `kQDmSUbcEau75Oiq4-Ddna8JLLLj3IbHFmYKYagpvH0hcGHV` |
| `GrowthEngine` Jetton Wallet | `kQDlDs_rNPgAT-9xvh2r6sjkgSNzjAPRizC1RgH2X5p9vGgM` |
| `PriceOracle` | `kQCuPwJKxPaykrUHBT8fsmzdO89uMQ9SeUD7ezQIHoIlyWbs` |
| Oracle admin wallet | `kQDkzmJ_S2HLUlVDSz9WEQfVBQ0-uhK9nJJ4PHTKbEVAXIP0` |
| Keeper / confirm caller wallet | any funded testnet wallet; local default can use `hi-funded` |

Local Acton wallet names available in this environment:

```text
HI_DEPLOYER=hi-funded
HI_ORACLE_ADMIN=hi-oracle
HI_ORACLE_CONFIRM_CALLER=hi-funded
```

## Current Verified State

`GrowthEngine` decoded by `acton rpc info`:

```text
Network: testnet
Address: kQDlsrlQBaWA2RmFEr+6Mg+cDd7snY3sTDT4HQSB4B8ujHxW
Status: active
Code Hash: 0xc12d4584f087474d2dce3b7f4d42e219b2cec73b8ae55700cd13260dcc8e1e74

growthConfirmedLevel: 0
growthEnabled: true
growthJettonWallet: kQDlDs/rNPgAT+9xvh2r6sjkgSNzjAPRizC1RgH2X5p9vGgM
oracle: kQCuPwJKxPaykrUHBT8fsmzdO89uMQ9SeUD7ezQIHoIlyWbs
permanentlyClosed: false

counters:
  growthPoolTotalHi: 5000000000000000000
  growthSoldHi: 0
  growthClaimedHi: 0
  growthMissedHi: 0
  growthMigratedHi: 0
```

`GrowthEngine` Jetton Wallet decoded by `acton rpc info`:

```text
Network: testnet
Address: kQDlDs/rNPgAT+9xvh2r6sjkgSNzjAPRizC1RgH2X5p9vGgM
Status: active
Code Hash: 0x7bfa53bce90ce26cd368ec2989eba2bd15d286104742f0e04659f485a03012ba

jettonBalance: 5000000000000000000
minterAddress: kQDmSUbcEau75Oiq4+Ddna8JLLLj3IbHFmYKYagpvH0hcGHV
ownerAddress: kQDlsrlQBaWA2RmFEr+6Mg+cDd7snY3sTDT4HQSB4B8ujHxW
```

`PriceOracle` decoded by `acton rpc info`:

```text
Network: testnet
Address: kQCuPwJKxPaykrUHBT8fsmzdO89uMQ9SeUD7ezQIHoIlyWbs
Status: active
Code Hash: 0x2b7e5d58147cbcc57de9a8e134867c9f676e8ab842cab137921c6b4513061a7b

admin: kQDkzmJ/S2HLUlVDSz9WEQfVBQ0+uhK9nJJ4PHTKbEVAXIP0
confirmationDelay: 30

growth:
  candidateLevel: 0
  confirmedLevel: 0
  lastPrice: 0
  levelStartedAt: 0

targets:
  growthEngine: kQDlsrlQBaWA2RmFEr+6Mg+cDd7snY3sTDT4HQSB4B8ujHxW
  merkleRewardVault: kQDGXoBKz6FUcFwrqzRbCKyK1gap0d5+SJo4IzbXuwHQhocn
  campaignWinnerVault: kQANxr6FmSG6pltqNxWTI4TDJnoqJXeFuY1IG2A3EXTWAfkT
  teamVestingVault: kQBfUnhV7f2Fj83svheYcZGwM2ztCeICnV2Zeti46yB2K+D4
```

## Deployment Evidence

Deployment command used fresh testnet roles and `30` second oracle delay:

```bash
HI_DEPLOYER=hi-funded \
HI_ADMIN_ADDRESS=kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl \
HI_ORACLE_ADMIN_ADDRESS=kQDkzmJ_S2HLUlVDSz9WEQfVBQ0-uhK9nJJ4PHTKbEVAXIP0 \
HI_ECOSYSTEM_ADMIN_ADDRESS=kQC8Z3dIOSYU02hSY3PHH3QKFlA_5LniFi_z1toRz2eWz9Yu \
HI_MIGRATION_WALLET_1=kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl \
HI_MIGRATION_WALLET_2=kQD_q-11kYiFdac65k-9BVjBUw6FS44qqyMFxQdtnviisqQY \
HI_TEAM_WALLET=kQDn8KCBkNfqiVQjNJuuPVthJkhdwqUY700KISDbWMClO95q \
HI_PROJECT_FUND_WALLET=kQAFOn1IBRo-73s0RcRUWOyjpeSmSdTmRtkuvmFoE-7wVqrl \
HI_LIQUIDITY_WALLET=kQBz9ewG7bsDdl_dhamRpY9L7Z1ZI2KcFyDydj9yT-yDGJ_h \
HI_INVESTOR_WALLET=kQANdpY2A4ASCzhgBJiPNOBqS5QIn-lhodxFdwwuc9YgbrTF \
HI_ORACLE_CONFIRMATION_DELAY=30 \
acton script scripts/deploy-hi-tokenomics.tolk --net testnet
```

Key signed testnet transactions from deployment:

```text
https://testnet.tonscan.org/tx/d1daa39a177e425e5eacba43811ee1e978964c170817ef3a0185dc56187cf49b
https://testnet.tonscan.org/tx/e673b68a5596b933f24957d839f43f694a7b11ca76e66c5e0bd528d5cab0df8d
https://testnet.tonscan.org/tx/6ddf0e05ef125623ee83a1d7f48d2c806133985bee1cdd51338854f20c37af99
https://testnet.tonscan.org/tx/c9f66d95a70725d7b911c5b606bb5d2dd90ab6ce4c325dd0134c57845d27c52f
https://testnet.tonscan.org/tx/76b119f0aa8e6c17a90a0668ae2968ef2d9f3bae744e3c5068af03222fdb589a
https://testnet.tonscan.org/tx/409dabcca42a6f76ed96e5bc9da6e5cad2a1fe094917469f66838c9816d84132
https://testnet.tonscan.org/tx/6d3a4599e32e6e7b8d8cc5feec3678b4fc2f0d1c38aa2b186d2b9e4983f1f122
https://testnet.tonscan.org/tx/276ccd665c1ae26b9addb004fa3f8311560d1e46221bf10f5a2923d038e34aed
https://testnet.tonscan.org/tx/98dce7d7ec7277104698ea2eb5b2fd99349aae9033f514ca233f892cf481aad4
https://testnet.tonscan.org/tx/7b7a1131f60431467226da33876801daa88e636d4aa4c6ad3ad958e82624d847
https://testnet.tonscan.org/tx/0e8dce5da8416f66d828b3be0d7c3172bc4360b27de33b68780293c13b2dd968
https://testnet.tonscan.org/tx/b8f2a9aab5342583ad6120542843cb090f1153ca3ab4a4baa49bebc5d09199f6
https://testnet.tonscan.org/tx/ee17c8ab5ed37972c52e43c5601a6b99b85de40b6536e803f7fa8a856a9e0de0
```

Pre-drop and post-drop allocation output:

```text
HI_GROWTH_ENGINE PRE_DROP_BALANCE=5000000000000000000
HI_MERKLE_REWARD PRE_DROP_BALANCE=1600000000000000000
HI_CAMPAIGN_WINNER PRE_DROP_BALANCE=400000000000000000
HI_TEAM_VESTING PRE_DROP_BALANCE=1200000000000000000
HI_PROJECT_FUND PRE_DROP_BALANCE=1000000000000000000
HI_LIQUIDITY PRE_DROP_BALANCE=500000000000000000
HI_INVESTOR PRE_DROP_BALANCE=300000000000000000
HI_POST_MINT_TOTAL_SUPPLY=10000000000000000000
HI_POST_MINT_MINTABLE=true
HI_POST_MINT_ADMIN_ADDRESS=kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl

HI TOTAL_SUPPLY=10000000000000000000
HI MINTABLE=false
HI ADMIN_ADDRESS=null
```

## TonConnect Message Format

All amounts are integer nanotons / base units. Do not use floats.

### BuyGrowth

Destination:

```text
kQDlsrlQBaWA2RmFEr-6Mg-cDd7snY3sTDT4HQSB4B8ujHxW
```

Body:

```text
op = 0x48490102
struct BuyGrowth {
  tonAmount: coins
}
```

Encoding:

```ts
import { beginCell, toNano } from '@ton/core';

const tonAmount = toNano('0.1'); // purchase amount, not including gas overhead
const body = beginCell()
  .storeUint(0x48490102, 32)
  .storeCoins(tonAmount)
  .endCell();

const payload = body.toBoc().toString('base64');
```

Recommended attached TON:

```text
value = tonAmount + 0.15 TON
```

For a minimum `0.1 TON` buy:

```text
tonAmount = 100000000
recommended value = 250000000 nanotons
```

The script default is also:

```text
HI_PURCHASE_TON_AMOUNT=100000000
HI_PURCHASE_MSG_VALUE=250000000
```

### ClaimGrowth

Destination:

```text
kQDlsrlQBaWA2RmFEr-6Mg-cDd7snY3sTDT4HQSB4B8ujHxW
```

Body:

```text
op = 0x48490105
struct ClaimGrowth {}
```

Encoding:

```ts
import { beginCell, toNano } from '@ton/core';

const body = beginCell()
  .storeUint(0x48490105, 32)
  .endCell();

const payload = body.toBoc().toString('base64');
```

Recommended attached TON:

```text
value = 0.3 TON = 300000000 nanotons
```

The script default is:

```text
HI_CLAIM_MSG_VALUE=300000000
```

## Oracle Procedure For Claim E2E

Current growth level is `0`. For the front-end E2E, buy first at level `0`,
then advance to level `1` so the buyer can claim the next `10%` tranche.

Shortest local procedure:

```bash
cd /Users/yudeyou/Desktop/100wan/contracts/hi-tokenomics

HI_ORACLE_ADMIN=hi-oracle \
HI_PRICE_ORACLE_ADDRESS=kQCuPwJKxPaykrUHBT8fsmzdO89uMQ9SeUD7ezQIHoIlyWbs \
HI_ORACLE_PRICE_KIND=1 \
HI_ORACLE_PRICE=396000 \
HI_ORACLE_MSG_VALUE=50000000 \
acton script scripts/oracle-report.tolk --net testnet

sleep 35

HI_ORACLE_CONFIRM_CALLER=hi-funded \
HI_PRICE_ORACLE_ADDRESS=kQCuPwJKxPaykrUHBT8fsmzdO89uMQ9SeUD7ezQIHoIlyWbs \
HI_ORACLE_CONFIRM_KIND=1 \
HI_ORACLE_CONFIRM_VALUE=300000000 \
acton script scripts/oracle-confirm.tolk --net testnet
```

After confirm, expected state:

```text
PriceOracle.growthConfirmedLevel = 1
GrowthEngine.growthConfirmedLevel = 1
```

Then `/unlocks` can submit `ClaimGrowth`.

Growth thresholds for additional levels:

```text
level 1: 396000
level 2: 792000
level 3: 1584000
level 4: 3168000
level 5: 6337000
level 6: 12673000
level 7: 25347000
level 8: 50693000
level 9: 101386000
level 10: 202772000
```

## Suggested Front-End Env Values

For `/Users/yudeyou/Desktop/GrowthEngine/.env` and `.dev.vars`:

```text
GROWTH_ENGINE_ADDRESS=kQDlsrlQBaWA2RmFEr-6Mg-cDd7snY3sTDT4HQSB4B8ujHxW
TON_HI_CONTRACT_ADDRESS=kQDmSUbcEau75Oiq4-Ddna8JLLLj3IbHFmYKYagpvH0hcGHV
VITE_ENABLE_GROWTH_ENGINE_TRANSACTIONS=true
```

Keep production runtime secrets unchanged until local E2E passes.

## Notes

- This GrowthEngine is fresh, open, and unswept.
- `growthEnabled=true`.
- `permanentlyClosed=false`.
- Growth pool balance is still `5,000,000,000 HI`.
- The deployer/admin wallet for this fresh testnet deployment is the funded
  `hi-funded` wallet:

```text
kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl
```
