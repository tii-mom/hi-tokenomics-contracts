# Frontend Claim E2E Testnet Handoff

Purpose: provide a final testnet handoff for `/Users/yudeyou/Desktop/GrowthEngine` to run real TonConnect claim flows for:

1. `MerkleRewardVault` red-packet claim.
2. `CampaignWinnerVault` 5,000,000 HI winner claim.

Do not close, sweep, migrate, or redeploy these contracts during the frontend E2E.

## Testnet Contracts

These addresses are from the latest red-packet claim validation deployment and match the current `MerkleRewardVault` hash.

This handoff was refreshed because the frontend E2E signer is the funded Tonkeeper testnet wallet, not the previous local `hi-buyer` wallet.

| Item | Testnet address |
|---|---|
| HI JettonMinter / `TON_HI_CONTRACT_ADDRESS` | `kQDPYRXkYxhwsGtg6XUp_cAglUnHlOueWdYWwLPHCmYC93wA` |
| PriceOracle | `kQD-YVIuu66dXqxYYC2u03TRUJYO0feXa44DOsqHlLNxqtOD` |
| GrowthEngine | `kQDWxz-_Puq1PnaLYbFOuLDhlHa_jVk7YtdVUCBO_q4eDR3M` |
| GrowthEngine Jetton Wallet | derive from minter if needed |
| TeamVestingVault | `kQDf1A6I4hM3r9BYB7JEtUnym4XzEjBrG9PNMqu6_huGNzbe` |
| MerkleRewardVault | `kQDowJyQHcFXb_zhwsU5XjMLBzYV8q81GqtUJxZ4shRZin4X` |
| MerkleRewardVault Jetton Wallet | `kQDoHl7-aoXeXuKWlcShBhbReSywPn7HpV-UDEZcI7eSprOB` |
| CampaignWinnerVault | `kQCLsSFO8npMyxX28yUC9YZAceytRcZ8HmawzRphgsRnuuzu` |
| CampaignWinnerVault Jetton Wallet | `kQCL0vWz7uLFazQiCuf5QlbiH_UXf8SNqw4lrHn8xzJ_bIjo` |

## Red-Packet Claim Fixture

This batch is created for the actual Tonkeeper testnet signer and is not yet claimed.

| Field | Value |
|---|---|
| MerkleRewardVault | `kQDowJyQHcFXb_zhwsU5XjMLBzYV8q81GqtUJxZ4shRZin4X` |
| batchId | `5001` |
| claimant wallet, bounceable testnet | `kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl` |
| claimant wallet, user format | `0QCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQU_g` |
| claimant raw | `0:b1274e7279ac155a5b0de527c9fa86da8e08769457df47e3bb79b1ffb3fc2a41` |
| amount | `5,000 HI` |
| amount base units | `5000000000000` |
| poolType | `3` |
| requiredGrowthLevel | `0` |
| metadataHash | `0` |
| merkleRoot | `114662029248631739694441699519084078340295858974732504872327124450795303637832` |

Batch state before claim:

```text
HI_REWARD_BATCH_STATE=(114662029248631739694441699519084078340295858974732504872327124450795303637832, 5000000000000, 0, 0, 3, 0)
```

Single-leaf proof:

```ts
import { beginCell } from '@ton/core';

const proof = beginCell()
  .storeBit(false) // hasSibling
  .storeBit(false) // hasNext
  .endCell();
```

### ClaimReward TonConnect Message

Operation:

```text
0x48490402
```

Body structure:

```text
ClaimReward {
  batchId: uint64
  amount: coins
  proof: cell
}
```

Recommended attached value:

```text
0.3 TON
```

Expected before claim:

```text
batch_state(5001) = (114662029248631739694441699519084078340295858974732504872327124450795303637832, 5000000000000, 0, 0, 3, 0)
has_claimed(5001, claimant) = false
```

Expected after claim:

```text
batch_state(5001) = (114662029248631739694441699519084078340295858974732504872327124450795303637832, 5000000000000, 5000000000000, 0, 3, 0)
has_claimed(5001, claimant) = true
claimant HI balance increases by 5000000000000 base units
```

## Campaign Winner Claim Fixture

This winner is registered for the actual Tonkeeper testnet signer and is not yet claimed.

| Field | Value |
|---|---|
| CampaignWinnerVault | `kQCLsSFO8npMyxX28yUC9YZAceytRcZ8HmawzRphgsRnuuzu` |
| winner wallet, bounceable testnet | `kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl` |
| winner wallet, user format | `0QCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQU_g` |
| winner raw | `0:b1274e7279ac155a5b0de527c9fa86da8e08769457df47e3bb79b1ffb3fc2a41` |
| total winner allocation | `5,000,000 HI` |
| current claimable | `250,000 HI` |
| current claimable base units | `250000000000000` |

State before claim:

```text
HI_CAMPAIGN_WINNER_STATE=(true, 0, 0, 250000000000000)
HI_CAMPAIGN_VAULT_STATE=(0, 2, 0, 0)
```

Meaning:

```text
registered=true
entryLevel=0
claimedHi=0
claimableHi=250000000000000
growthConfirmedLevel=0
winnerCount=2
totalClaimedHi=0
migratedHi=0
```

### ClaimCampaignWinner TonConnect Message

Operation:

```text
0x48490502
```

Body structure:

```text
ClaimCampaignWinner {}
```

Recommended attached value:

```text
0.3 TON
```

Expected before claim:

```text
winner_state(winner) = (true, 0, 0, 250000000000000)
claimable(winner) = 250000000000000
```

Expected after claim:

```text
winner_state(winner) = (true, 0, 250000000000000, 0)
claimable(winner) = 0
vault_state() totalClaimedHi increases to 250000000000000
winner HI balance increases by 250000000000000 base units
```

## Getter Names

MerkleRewardVault:

```text
batch_state(batchId) -> (root, totalHi, claimedHi, metadataHash, poolType, requiredGrowthLevel)
has_claimed(batchId, wallet) -> bool
pool_state() -> (ecosystemTotalHi, universalTotalHi, redPacketTotalHi, migratedHi, growthConfirmedLevel)
```

CampaignWinnerVault:

```text
winner_state(wallet) -> (registered, entryLevel, claimedHi, claimableHi)
claimable(wallet) -> coins
vault_state() -> (growthConfirmedLevel, winnerCount, totalClaimedHi, migratedHi)
```

## Frontend E2E Return Checklist

Return these results to the contract thread:

```text
Red-packet claim tx hash:
Red-packet before getter:
Red-packet after getter:
CampaignWinner claim tx hash:
CampaignWinner before getter:
CampaignWinner after getter:
Wallet HI balance before/after if available:
Any TonConnect UI or indexer error:
```

## Copy-Paste Task For Frontend Thread

```text
请基于 /Users/yudeyou/Desktop/100wan/contracts/hi-tokenomics/docs/FRONTEND_CLAIM_E2E_HANDOFF.md，在 /Users/yudeyou/Desktop/GrowthEngine 执行 testnet TonConnect claim E2E。

目标：
1. 使用 handoff 中的 MerkleRewardVault red-packet batch 5001，通过 TonConnect 让用户签名 ClaimReward。
2. claim 前后读取 batch_state / has_claimed，并返回 tx hash。
3. 使用 handoff 中的 CampaignWinnerVault winner，通过 TonConnect 让用户签名 ClaimCampaignWinner。
4. claim 前后读取 winner_state / claimable / vault_state，并返回 tx hash。
5. 不修改合约源码，不 close，不 sweep，不 redeploy。

请返回：
- Red-packet claim tx hash
- Red-packet claim 前后 getter 输出
- CampaignWinner claim tx hash
- CampaignWinner claim 前后 getter 输出
- 如有失败，给出 TonConnect payload、attached TON、链上错误或 indexer 链接
```
