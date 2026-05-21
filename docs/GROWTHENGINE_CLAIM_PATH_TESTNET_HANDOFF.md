# GrowthEngine Claim-Path Testnet Handoff

Purpose: provide a fresh testnet GrowthEngine instance for the `/Users/yudeyou/Desktop/GrowthEngine` frontend thread to run:

```text
buy -> oracle growth level +1 -> /api/growth-engine/me claimableHi > 0 -> /unlocks claim -> getter claimedHi increases and claimableHi=0
```

Do not close or sweep this GrowthEngine.

## Fresh Testnet Instance

This instance was deployed after the HTTPS logo metadata change. It has not been closed or swept.

| Item | Address |
|---|---|
| HI JettonMinter / `TON_HI_CONTRACT_ADDRESS` | `kQDFJIiZzi2zBbp_FOkSB14zGs0hbaRvN0BlJ9NMoc-Vdo0Y` |
| GrowthEngine / `GROWTH_ENGINE_ADDRESS` | `kQCmVaPkJsw5xTv5LsO33o0ckzqrMLgdZRv51FlGfYbrEK7O` |
| GrowthEngine Jetton Wallet | `kQCmt5ZSrYu8PZkXx1vX0OKHVZIDk7xz64w3tHReaOjoHqYV` |
| PriceOracle | `kQD-YVIuu66dXqxYYC2u03TRUJYO0feXa44DOsqHlLNxqtOD` |

## Confirmed State

Deployment output confirmed:

```text
HI_POST_DROP_TOTAL_SUPPLY=10000000000000000000
HI_POST_DROP_MINTABLE=false
HI_POST_DROP_ADMIN_ADDRESS=null

HI METADATA_name=Human Intention
HI METADATA_symbol=HI
HI METADATA_image=https://gateway.pinata.cloud/ipfs/bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom
HI METADATA_decimals=9

HI_GROWTH_ENGINE WALLET_DEPLOYED=true
HI_GROWTH_ENGINE WALLET_BALANCE=5000000000000000000
```

GrowthEngine deploy defaults:

```text
growthEnabled=true
permanentlyClosed=false
growthConfirmedLevel=0
```

Note: a separate direct transfer of `303 HI` from the project fund wallet to the funded test wallet was made only to test wallet logo display. It did not use or reduce the GrowthEngine pool.

## BuyGrowth Message

Message op:

```text
0x48490102
```

Body structure:

```text
BuyGrowth {
  tonAmount: coins
}
```

Contract constraints:

```text
minimum purchase = 0.1 TON
max per wallet = 5000 TON
growth price = 10100 HI / TON
attached value must be >= tonAmount + 0.15 TON
```

Recommended frontend attached value:

```text
attached = purchaseTon + 0.15 TON
```

For a `0.1 TON` test buy:

```text
tonAmount = 100000000
attached value = 250000000
expected total allocation = 1010 HI
expected immediate level-0 transfer = 50.5 HI
```

## ClaimGrowth Message

Message op:

```text
0x48490105
```

Body structure:

```text
ClaimGrowth {}
```

Recommended attached value:

```text
0.25 TON
```

The contract currently requires `attached >= 0.25 TON` for claim.

## Oracle: Advance Growth Level 1

Run from:

```bash
cd /Users/yudeyou/Desktop/100wan/contracts/hi-tokenomics
```

Report growth level 1 candidate:

```bash
HI_ORACLE_ADMIN=hi-oracle \
HI_PRICE_ORACLE_ADDRESS=kQD-YVIuu66dXqxYYC2u03TRUJYO0feXa44DOsqHlLNxqtOD \
HI_ORACLE_PRICE_KIND=1 \
HI_ORACLE_PRICE=396000 \
HI_ORACLE_MSG_VALUE=50000000 \
acton script scripts/oracle-report.tolk --net testnet
```

Wait at least 35 seconds because this testnet deployment uses a 30 second oracle confirmation delay:

```bash
sleep 35
```

Confirm growth level 1:

```bash
HI_ORACLE_CONFIRM_CALLER=hi-funded \
HI_PRICE_ORACLE_ADDRESS=kQD-YVIuu66dXqxYYC2u03TRUJYO0feXa44DOsqHlLNxqtOD \
HI_ORACLE_CONFIRM_KIND=1 \
HI_ORACLE_CONFIRM_VALUE=300000000 \
acton script scripts/oracle-confirm.tolk --net testnet
```

Expected output after confirm:

```text
HI_ORACLE_GROWTH_CONFIRMED_LEVEL=1
```

PriceOracle will sync the new growth level to GrowthEngine through the configured target.

## Expected Claim-Path Numbers

If the user buys `0.1 TON` at level 0:

```text
total allocation = 0.1 * 10100 = 1010 HI
immediate level-0 transfer = 5% = 50.5 HI
after growth level 1 = total unlocked 15%
claimable after level 1 = 10% = 101 HI
```

Base units:

```text
totalLockedHi = 1010000000000
claimedHi after buy = 50500000000
claimableHi after level 1 = 101000000000
claimedHi after claim = 151500000000
claimableHi after claim = 0
```

Getter:

```text
buyer_state(address) returns:
(purchasedTon, totalLockedHi, entryLevel, claimedHi, claimableHi)
```

`growth_state()` returns:

```text
(growthConfirmedLevel, growthSoldHi, growthClaimedHi, growthMissedHi, growthMigratedHi, growthUncommittedHi)
```

## Frontend Env Values

Suggested values for `/Users/yudeyou/Desktop/GrowthEngine/.env` and `.dev.vars`:

```text
VITE_ENABLE_GROWTH_ENGINE_TRANSACTIONS=true
GROWTH_ENGINE_ADDRESS=kQCmVaPkJsw5xTv5LsO33o0ckzqrMLgdZRv51FlGfYbrEK7O
TON_HI_CONTRACT_ADDRESS=kQDFJIiZzi2zBbp_FOkSB14zGs0hbaRvN0BlJ9NMoc-Vdo0Y
HI_PRICE_ORACLE_ADDRESS=kQD-YVIuu66dXqxYYC2u03TRUJYO0feXa44DOsqHlLNxqtOD
HI_GROWTH_JETTON_WALLET=kQCmt5ZSrYu8PZkXx1vX0OKHVZIDk7xz64w3tHReaOjoHqYV
```

Use testnet endpoints/indexers.

