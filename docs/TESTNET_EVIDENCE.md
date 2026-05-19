# Final GrowthEngine Testnet Evidence

## Latest Fresh Testnet Evidence: 2026-05-19

Status: **fresh deployment and core growth/campaign smoke passed** after the
latest TON-chain USDT growth-threshold and CampaignWinner unlock-rule changes.

This latest deployment supersedes older addresses below. Full replay of all
Merkle/team/migration flows is still required before mainnet go/no-go.

### Latest Local Gates

```text
acton fmt --check
acton build
acton wrapper --all
acton wrapper --all --ts
acton test        # 58 passed in 7 files
acton check
```

The public GitHub repository was also synced and passed the same gate set.

### Latest Fresh Deployment Configuration

```text
HI_DEPLOYMENT_SALT=fresh-usdt-campaign-20260519151301
HI_ORACLE_CONFIRMATION_DELAY=30
HI_GROWTH_PRICE_LEVEL_1=396000
HI_GROWTH_PRICE_LEVEL_2=792000
```

### Latest Fresh Contract Addresses

| Contract / wallet | Testnet address |
|---|---|
| `JettonMinter` | `kQBsDQHfFhLvwVx__x2T2uZNZ8g7fTwO_CyR23qt2W-evG5c` |
| `PriceOracle` | `kQB_jSQjkGMh80XfgDQn4ptuc-UCIoGq3gMcLEgEwjCT8whA` |
| `GrowthEngine` | `kQBEV7_L8Y1JMQvTybtBNDPLoMjtJxUIPNzvBdXC8MJ3i2qz` |
| `TeamVestingVault` | `kQBKApneh-Fg5eqmuh_XDFiHUF3ASZplrmhqiFK3bzlDcxyl` |
| `MerkleRewardVault` | `kQCYIoWJW2Eel1u0rF7Zv2rs1NV3KuCJ3vi_69j6fUpi` |
| `CampaignWinnerVault` | `kQAbVqX2RZPU6leJTh2CPiLBQm7bSjS7-eK4k7yAUZnT5ZaX` |
| GrowthEngine jetton wallet | `kQBEG1qHTtW8En36R3faZHgfXqviVypgcxGzIp9ZCd43j5aH` |
| TeamVesting jetton wallet | `kQBKfWsbRec3RGpTVr95ykALBQ7Kaz8AMH4y0jvK3qTAXLFQ` |
| MerkleReward jetton wallet | `kQCYuTYAM8VNm7VQyBCSISD_BMqLOGTReeTMV4A_lTlGfKm6` |
| CampaignWinner jetton wallet | `kQAbVKPrvIUXmh6uwN_u2p8M55tc_QLVkEk2J4mGhEcUQvUi` |

### Latest Allocation / Admin Evidence

```text
HI_GROWTH_ENGINE PRE_DROP_BALANCE=5000000000000000000
HI_MERKLE_REWARD PRE_DROP_BALANCE=1600000000000000000
HI_CAMPAIGN_WINNER PRE_DROP_BALANCE=400000000000000000
HI_TEAM_VESTING PRE_DROP_BALANCE=1200000000000000000
HI_PROJECT_FUND PRE_DROP_BALANCE=1000000000000000000
HI_LIQUIDITY PRE_DROP_BALANCE=500000000000000000
HI_INVESTOR PRE_DROP_BALANCE=300000000000000000
HI_POST_MINT_TOTAL_SUPPLY=10000000000000000000
HI MINTABLE=false
HI ADMIN_ADDRESS=null
```

### Latest Key Transactions

| Action | Testnet tx hash |
|---|---|
| deploy tx 1 | `1efb6f50b393c48371f5c4dced0c063977b95bfebc0350032f0853edb664c1d2` |
| deploy tx 2 | `06f366c078d3732a238f0f7fcd0875c21d29f9ef9cabd074367594fbfe52b63e` |
| deploy tx 3 | `32c0ddecc3699ff9daca4bab9487137664ebce21362ea7750c418e55977bc915` |
| deploy tx 4 | `3ded31322453b02e7a6731ec6e417d38eb9548bcb6ac1e3e22fe3c8ef3d9049f` |
| deploy tx 5 | `a6ab51631e6be526ff23ac991706a485fb90ef965ccb7e9a43398168031d358f` |
| deploy tx 6 | `c4947df50be4c1956bde5b3931148daceb229dfcbfe4fb0840c7b58df30108b5` |
| deploy tx 7 | `1549bb972c4581d600aed321822593c408fdfcdee319dfd4a84694729d2d38ed` |
| deploy tx 8 | `a6430fa5953cea70620ae7ecd051ea9d806e5a6e59fba57e7a4ad96028b065b3` |
| deploy tx 9 | `1b66445540f676090080496b2b6bf76574480251fa26c0c2406f0434be79e77c` |
| deploy tx 10 | `d0ff56005ed0a067c9476409d38cedcd28c6f6b86fc876f3f3c7f147c7c1401a` |
| deploy tx 11 | `1999c697c8133783c93af64c983a48927571709db9125bb0a8835f25a0a8fbbd` |
| deploy tx 12 | `72a7dbce399821dca91f06d9248d619427899c1faca4ddf0871e94a9aeb47748` |
| drop minter admin | `72ae3abe1f0d2f8e906ffe17bd72b27921373db412a2d35f5300a81289341b84` |

### Latest GrowthEngine Smoke

Level 0 buy:

```text
Buy 0.1 TON with 0.25 TON attached
HI_GROWTH_BUYER_STATE=(100000000, 1010000000000, 0, 50500000000, 0)
HI_GROWTH_STATE=(0, 1010000000000, 50500000000, 0, 0, 4999998990000000000)
```

This proves `10100 HI / TON` and immediate level 0 `5%`.

Growth level 1 report / confirm:

```text
HI_ORACLE_PRICE=396000
HI_ORACLE_GROWTH_CANDIDATE_STATE=(1, 1779203807, 396000)
HI_ORACLE_GROWTH_CONFIRMED_LEVEL=1
```

Growth claim after level 1:

```text
HI_GROWTH_BUYER_STATE=(100000000, 1010000000000, 0, 151500000000, 0)
HI_GROWTH_STATE=(1, 1010000000000, 151500000000, 0, 0, 4999998990000000000)
```

This proves level 1 adds another `10%`.

### Latest CampaignWinner Smoke

Winner registered after level 1:

```text
HI_CAMPAIGN_WINNER_STATE=(true, 1, 0, 0)
HI_CAMPAIGN_VAULT_STATE=(1, 1, 0, 0)
```

This proves a late winner does not receive level 0 or already confirmed level 1.

Growth level 2 report / confirm:

```text
HI_ORACLE_PRICE=792000
HI_ORACLE_GROWTH_CANDIDATE_STATE=(2, 1779203926, 792000)
HI_ORACLE_GROWTH_CONFIRMED_LEVEL=2
```

Winner claim after level 2:

```text
HI_CAMPAIGN_WINNER_STATE=(true, 1, 500000000000000, 0)
HI_CAMPAIGN_VAULT_STATE=(2, 1, 500000000000000, 0)
```

This proves the late winner receives only the next confirmed growth level
`10%` tranche: `500,000 HI` out of `5,000,000 HI`.

## Older Evidence Archive

> The evidence below predates the latest CampaignWinner and growth-threshold
> rule changes. Keep it only as an audit trail, not as pre-mainnet evidence.

Status: **fresh allowlist testnet rehearsal complete** for the current local
7-contract hashes in `docs/CODE_HASHES.md`.

Mainnet remains blocked until explicit mainnet deployment authorization and
final owner sign-off on the migration permission model.

## Local Gate Evidence

Latest local gate run:

```text
acton fmt --check
acton build
acton wrapper --all
acton wrapper --all --ts
acton test        # 58 passed in 7 files
acton check
```

Both app repositories were also checked for contract-facing integration health:

```text
/Users/yudeyou/Desktop/100wan:
npm run lint
npm run test:growth-supporters
npm run test:public-sale-supporters
npm run test:agent-flow
npm run build

/Users/yudeyou/Desktop/GrowthEngine:
npm run lint
npm run test:growth-supporters
npm run build
```

`npm run ops:check-production` in `/Users/yudeyou/Desktop/100wan` still fails
only because production chain integration values are intentionally unset before
mainnet deployment:

```text
GROWTH_ENGINE_ADDRESS
TON_INDEXER_API_BASE
TON_INDEXER_API_KEY
```

## Fresh Testnet Configuration

```text
HI_ORACLE_CONFIRMATION_DELAY=30
testnet deployer/admin/oracle/reward/migration wallet=hi2-admin
total_supply=10,000,000,000 HI
minter_admin=dropped
mintable=false
```

Two earlier testnet attempts were discarded:

- one picked up a non-local oracle admin from parent `.env`;
- one reused an already advanced oracle state because the oracle storage did
  not include a deployment salt.

The final evidence below uses fresh `hi2-*` testnet roles and starts from
`growthConfirmedLevel=0` and `teamConfirmedLevel=0`.

## Fresh Contract Addresses

| Contract / wallet | Testnet address |
|---|---|
| `JettonMinter` | `kQArxczEPETdQkoKrnAToX0vLDrL69sCF-BiF_JkyZzXvAZm` |
| `PriceOracle` | `kQCJsaLRfYtFmDgPpMsrLaCWZBUsRLhNF3DudaLNn1xJxiel` |
| `GrowthEngine` | `kQCkYSkW3DPfsstW696wTU_xmW4B5MnmB3AjfST70piEeWga` |
| `TeamVestingVault` | `kQAFYt7e7_YReZEbYTMavBVXLqbfK50zY56FRn9-T0ffKTad` |
| `MerkleRewardVault` | `kQCOkkcQy3s8pRCF4UqayNcxkldnG1UTm8A-umZX-bnL3OF7` |
| `CampaignWinnerVault` | `kQDku2ltn0nLCPEnibzsVYiQBsg9_dapcQMl41OBZb7tKXHb` |
| GrowthEngine jetton wallet | `kQCkxmadizSFm7wZ9KPQuNuxXv2r0RGalvksjwRjKk9Ow01I` |
| TeamVesting jetton wallet | `kQAFuMaQDz3i5YBIRdGr8EGfMNZOPBQ156-6Qo9cKlQQcmaI` |
| MerkleReward jetton wallet | `kQCOExw0wI842NgcV9KxVMLb-xpAnNYTB_QTdoNj536ifsQ1` |
| CampaignWinner jetton wallet | `kQDktKw11TwS3axfL04p85G7PdQsvz5Os6dE8gXFaRTgo-x-` |
| Project fund HI wallet | `kQBnNO6tk9KNezh1H35VCBhowm2i_f7UE96O29FeX7rsAFpW` |
| Liquidity HI wallet | `kQA3VGdZ-gxmyBeQre5wUXt2t9afOIDFWRflr0zxvPkp6ECH` |
| Investor HI wallet | `kQDeBHc5F-SjQ6xCEyqlYJ-QX9SzLNWmGElcdQfze71caAvl` |

## Role Wallets

| Role | Address |
|---|---|
| deployer / admin / oracle admin / reward admin / migration wallet 1/2 | `kQDFZ5Pf6TBKEArTAFznXox9UVbzEOleeva1VANjuZc3mLe7` |
| team wallet | `kQC7tY1oWwiLB8oh-1oKD58ZEec471uVbxUtgaIFyZPaS7iV` |
| project fund wallet | `kQBn82eHnPOKmXE85xZeWeB76RaVvDEsjajf5V_r7oScYmLx` |
| liquidity wallet | `kQA3EB1Vow5f9OwQrvzWcMWCizrTjy4UPnrCBig5cu3V4grn` |
| investor wallet | `kQDeG35gMcOgHJdepMwKD1B9S2Y6JKv_yEmn2p1b8Fush84E` |
| buyer / campaign winner / reward claimant | `kQDVjyPHyd6poIzSboeG5AbVDrY85iadYuTeZjFq9gCy9qiS` |

## Allocation Evidence

Pre-drop allocation assertions:

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
HI_POST_MINT_ADMIN_ADDRESS=kQDFZ5Pf6TBKEArTAFznXox9UVbzEOleeva1VANjuZc3mLe7
```

Post-drop minter state:

```text
HI TOTAL_SUPPLY=10000000000000000000
HI MINTABLE=false
HI ADMIN_ADDRESS=null
```

## Initial Fresh State

`PriceOracle` decoded by `acton rpc info`:

```text
admin: kQDFZ5Pf6TBKEArTAFznXox9UVbzEOleeva1VANjuZc3mLe7
confirmationDelay: 30
growth.confirmedLevel: 0
team.confirmedLevel: 0
targets.growthEngine: kQCkYSkW3DPfsstW696wTU_xmW4B5MnmB3AjfST70piEeWga
targets.teamVestingVault: kQAFYt7e7_YReZEbYTMavBVXLqbfK50zY56FRn9-T0ffKTad
targets.merkleRewardVault: kQCOkkcQy3s8pRCF4UqayNcxkldnG1UTm8A-umZX-bnL3OF7
targets.campaignWinnerVault: kQDku2ltn0nLCPEnibzsVYiQBsg9_dapcQMl41OBZb7tKXHb
```

`GrowthEngine` decoded by `acton rpc info`:

```text
growthConfirmedLevel: 0
growthEnabled: true
permanentlyClosed: false
growthPoolTotalHi: 5000000000000000000
growthSoldHi: 0
growthClaimedHi: 0
growthMissedHi: 0
growthMigratedHi: 0
```

## GrowthEngine Rehearsal

1 TON buy by `hi2-buyer`:

```text
HI_GROWTH_BUYER_STATE=(1000000000, 10100000000000, 0, 505000000000, 0)
HI_GROWTH_STATE=(0, 10100000000000, 505000000000, 0, 0, 4999989900000000000)
```

Growth levels 1-10 were reported and confirmed with the 30-second testnet
delay. Final oracle state:

```text
HI_ORACLE_GROWTH_CONFIRMED_LEVEL=10
HI_ORACLE_TEAM_CONFIRMED_LEVEL=0
```

After level 10 claim, the buyer had claimed the full `10,100 HI` allocation:

```text
HI_GROWTH_BUYER_STATE=(1000000000, 10100000000000, 0, 10100000000000, 0)
HI_GROWTH_STATE=(10, 10100000000000, 10100000000000, 0, 0, 4999989900000000000)
```

Migration smoke moved `1 HI` of uncommitted GrowthEngine balance to the
allowlisted target:

```text
HI_GROWTH_STATE=(10, 10100000000000, 10100000000000, 0, 1000000000, 4999989899000000000)
```

Permanent close and project-fund sweep:

```text
before sweep: HI_GROWTH_STATE=(10, 10100000000000, 10100000000000, 0, 1000000000, 4999989899000000000)
after sweep:  HI_GROWTH_STATE=(10, 10100000000000, 10100000000000, 0, 1000000000, 0)
```

Late-buyer no-catch-up and level 10 final `5%` behavior are covered by local
test `growth engine: late buy does not catch up historical levels and level 10
final is 5 percent`.

## TeamVesting Rehearsal

Team levels 1-4 were reported and confirmed with the 30-second testnet delay:

```text
HI_ORACLE_TEAM_CONFIRMED_LEVEL=4
```

Team claim released the full `1,200,000,000 HI` to the fixed team wallet:

```text
HI_TEAM_VESTING_STATE=(4, 1200000000000000000, 1200000000000000000)
```

## CampaignWinner Rehearsal

Winner registered after growth level 10. Registration captured `entryLevel=10`
and made only the immediate `5%` claimable:

```text
HI_CAMPAIGN_WINNER_STATE=(true, 10, 0, 250000000000000)
HI_CAMPAIGN_VAULT_STATE=(10, 1, 0, 0)
```

After claim:

```text
HI_CAMPAIGN_WINNER_STATE=(true, 10, 250000000000000, 0)
HI_CAMPAIGN_VAULT_STATE=(10, 1, 250000000000000, 0)
```

Migration smoke moved `1 HI` of uncommitted CampaignWinner balance to the
allowlisted target:

```text
HI_CAMPAIGN_VAULT_STATE=(10, 1, 250000000000000, 1000000000)
```

The full “register at level 0 and claim as growth levels advance” path is
covered by local test `campaign winner: registration follows growth level and
immediate plus future release schedule`.

## MerkleReward Rehearsal

Three single-leaf batches were created and claimed at `requiredGrowthLevel=10`:

```text
poolType 1 ecosystem:
HI_REWARD_BATCH_STATE=(58993417003725565805356271025813129228734607008635939382952131649622109147183, 100000000000, 100000000000, 111, 1, 10)

poolType 2 universal_lottery:
HI_REWARD_BATCH_STATE=(53013163207373218605283374709985349623257572200601835119254047836843557363651, 200000000000, 200000000000, 222, 2, 10)

poolType 3 red_packet:
HI_REWARD_BATCH_STATE=(49575197681701476632311191718280472402135284176622917015636729921025149636487, 10000000000000, 10000000000000, 333, 3, 10)
```

Migration smoke moved `1 HI` of uncommitted MerkleReward balance to the
allowlisted target:

```text
HI_REWARD_POOL_STATE=(100000000000, 200000000000, 10000000000000, 1000000000, 10)
```

Invalid proof, malformed proof, deep proof, duplicate claim, and over-total
behavior are covered by local tests in `tests/growth-tokenomics.test.tolk`.

## TON Verifier Dry-Run

Dry-run verification prepared successfully for all fresh testnet contracts:

```text
JettonMinter: backend verification successful
JettonWallet: backend verification successful
GrowthEngine: backend verification successful
PriceOracle: backend verification successful
TeamVestingVault: backend verification successful
CampaignWinnerVault: backend verification successful
MerkleRewardVault: backend verification successful
```
