# HI Mainnet Deployment Package

Status: pre-mainnet review package ready. Mainnet deployment is not authorized.

## Fresh Testnet Deployment

Fresh final testnet rehearsal used a 30-second oracle confirmation delay:

```bash
HI_ORACLE_CONFIRMATION_DELAY=30 acton script scripts/deploy-hi-tokenomics.tolk --net testnet
```

The testnet mnemonic stayed in local wallet tooling only. Do not write it to
docs, scripts, commits, or shared environment examples.

## Mainnet Deployment Command

Mainnet must use the default `86400` second confirmation delay:

```bash
acton script scripts/deploy-hi-tokenomics.tolk --net mainnet
```

or explicitly:

```bash
HI_ORACLE_CONFIRMATION_DELAY=86400 acton script scripts/deploy-hi-tokenomics.tolk --net mainnet
```

## Required Mainnet Environment

```text
HI_DEPLOYER=mainnet-admin
HI_ADMIN_ADDRESS=<mainnet-admin-address>
HI_ORACLE_ADMIN_ADDRESS=<mainnet-oracle-admin-address>
HI_ECOSYSTEM_ADMIN_ADDRESS=<mainnet-reward-admin-address>
HI_MIGRATION_WALLET_1=<mainnet-migration-wallet-1>
HI_MIGRATION_WALLET_2=<mainnet-migration-wallet-2>
HI_TEAM_WALLET=<mainnet-team-wallet>
HI_PROJECT_FUND_WALLET=<mainnet-project-fund-wallet>
HI_LIQUIDITY_WALLET=<mainnet-liquidity-wallet>
HI_INVESTOR_WALLET=<mainnet-investor-wallet>
HI_DEPLOY_MSG_VALUE=0.05
HI_MINT_FORWARD_TON_AMOUNT=0.01
HI_MINT_TOTAL_TON_AMOUNT=0.08
HI_ORACLE_CONFIRMATION_DELAY=86400
```

## Metadata

```text
name=Human Intention
symbol=HI
decimals=9
description=Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
website=https://smt.it.com
telegram=https://t.me/HumanIntention
x_twitter=https://x.com/72hour_s
image_uri=ipfs://bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom
metadata_uri=ipfs://bafkreiboziv7sd4dyfh4zn5iuwchxisldchidopfhns5gc36mbmo2atadq
```

Current deploy scripts write TEP-64 on-chain fields directly:

- `name`
- `symbol`
- `description`
- `image`
- `decimals`

The public metadata JSON URI above is used for public documentation and
cross-checking social links. Switching the on-chain metadata model to a single
off-chain `uri` field is a separate contract/deploy-script change and should be
decided before mainnet if required.

## Seven-Contract Package

1. `JettonMinter`
2. `JettonWallet`
3. `GrowthEngine`
4. `PriceOracle`
5. `TeamVestingVault`
6. `CampaignWinnerVault`
7. `MerkleRewardVault`

## Allocation

| Destination | Amount |
|---|---:|
| `GrowthEngine` | `5,000,000,000 HI` |
| `MerkleRewardVault` | `1,600,000,000 HI` |
| `CampaignWinnerVault` | `400,000,000 HI` |
| `TeamVestingVault` | `1,200,000,000 HI` |
| Project fund wallet | `1,000,000,000 HI` |
| Liquidity wallet | `500,000,000 HI` |
| Investor / early wallet | `300,000,000 HI` |

## Post-Deploy Checks

1. Record all seven contract addresses.
2. Record all related Jetton Wallet addresses.
3. Confirm total supply is `10,000,000,000 HI`.
4. Confirm all allocation balances.
5. Confirm minter admin is dropped.
6. Confirm GrowthEngine, TeamVestingVault, CampaignWinnerVault, and
   MerkleRewardVault Jetton wallet injection.
7. Confirm PriceOracle targets:
   - GrowthEngine
   - TeamVestingVault
   - MerkleRewardVault
   - CampaignWinnerVault
8. Confirm `HI_ORACLE_CONFIRMATION_DELAY=86400` in mainnet storage.
9. Run TON Verifier for all seven contracts.
10. Stop unless explicit mainnet operational approval is provided.

## Message Interfaces

### GrowthEngine

- `BuyGrowth { tonAmount }`
- `ClaimGrowth {}`
- `SetGrowthEnabled { enabled }`
- `SetGrowthConfirmedLevel { growthConfirmedLevel }`
- `CloseGrowthEngine {}`
- `SweepGrowthProjectFund {}`
- `WithdrawGrowthTons { amount }`
- `SetGrowthJettonWallet { growthJettonWallet }`
- `SetGrowthMigrationTargetAllowed { targetContract, allowed }`
- `SetGrowthMigrationTarget { targetContract }`
- `TransferGrowthUncommittedHiToContract { amount }`

### PriceOracle

- `ReportGrowthPrice { price }`
- `ConfirmGrowthLevel {}`
- `ReportTeamPrice { price }`
- `ConfirmTeamLevel {}`
- `SetOracleTargets { growthEngine, teamVestingVault, merkleRewardVault }`
- `SetCampaignWinnerTarget { campaignWinnerVault }`

### TeamVestingVault

- `SyncTeamPriceLevel { teamConfirmedLevel, confirmedAt }`
- `ClaimTeam {}`
- `SetTeamJettonWallet { teamJettonWallet }`
- `SetTeamMigrationTargetAllowed { targetContract, allowed }`
- `SetTeamMigrationTarget { targetContract }`
- `TransferTeamUncommittedHiToContract { amount }`

### CampaignWinnerVault

- `RegisterCampaignWinner { winner }`
- `ClaimCampaignWinner {}`
- `SetCampaignWinnerJettonWallet { winnerJettonWallet }`
- `SetGrowthConfirmedLevel { growthConfirmedLevel }`
- `SetCampaignMigrationTargetAllowed { targetContract, allowed }`
- `SetCampaignMigrationTarget { targetContract }`
- `TransferCampaignUncommittedHiToContract { amount }`

### MerkleRewardVault

- `CreateRewardBatch { batchId, root, totalHi, metadataHash, poolType, requiredGrowthLevel }`
- `ClaimReward { batchId, amount, proof }`
- `SetRewardJettonWallet { rewardJettonWallet }`
- `SetRewardGrowthLevel { growthConfirmedLevel }`
- `SetRewardMigrationTargetAllowed { targetContract, allowed }`
- `SetRewardMigrationTarget { targetContract }`
- `TransferRewardUncommittedHiToContract { amount }`

## Migration Permission Model

The four business vaults support a restricted migration/rescue path for
uncommitted HI:

- `GrowthEngine`
- `TeamVestingVault`
- `CampaignWinnerVault`
- `MerkleRewardVault`

The active V1 model is admin-managed target allowlists:

1. The contract admin adds or removes allowed migration target addresses with
   `Set*MigrationTargetAllowed`.
2. Either migration wallet 1 or migration wallet 2 can select one of those
   allowed targets with `Set*MigrationTarget`.
3. Either migration wallet can transfer only the vault's uncommitted HI balance
   to the selected target.

Contract accounting prevents migration of committed user allocations,
registered winner allocations, published Merkle batch totals,
sold-but-unclaimed GrowthEngine balances, and already vested team balances.

This removes the previous arbitrary-target migration model. It still does not
perform code-hash validation or timelock governance; those can be added in a
future version if the project wants stricter upgrade controls.

Owner approval status: accepted for V1. The owner explicitly accepted this
permission model on 2026-05-19. Mainnet deployment remains blocked only until
explicit deployment authorization is given.
