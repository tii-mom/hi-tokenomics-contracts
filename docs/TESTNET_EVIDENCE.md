# Final GrowthEngine Testnet Evidence

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
<local-100wan-workspace>:
npm run lint
npm run test:growth-supporters
npm run test:public-sale-supporters
npm run test:agent-flow
npm run build

<local-growthengine-workspace>:
npm run lint
npm run test:growth-supporters
npm run build
```

`npm run ops:check-production` in `<local-100wan-workspace>` still fails
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
