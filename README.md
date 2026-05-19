# HI Tokenomics Contracts

Formal Acton/Tolk workspace for HI tokenomics.

## Active Contracts

HI currently uses 7 deployable contracts:

- `JettonMinter.tolk` and `JettonWallet.tolk`: HI Jetton master/wallet.
- `GrowthEngine.tolk`: 50% allocation growth engine. Users buy at
  `10100 HI / TON`; `5%` is released immediately, growth levels 1-9 release
  `10%` each, and level 10 releases the final `5%`. There is no instant pool.
- `PriceOracle.tolk`: single-admin USDT/HI price reporting with independent
  `growthConfirmedLevel 0-10` and `teamConfirmedLevel 0-4`.
- `TeamVestingVault.tolk`: 12% team allocation. Price levels at `0.1`, `0.5`,
  `1`, and `5` USDT release `300,000,000 HI` each.
- `CampaignWinnerVault.tolk`: 500万 HI campaign winner vault. Admin registers up
  to 80 winners; each winner receives `5,000,000 HI` following the same
  GrowthEngine release schedule.
- `MerkleRewardVault.tolk`: unified immutable Merkle claim vault for ecosystem,
  universal lottery, and red-packet batches, with `requiredGrowthLevel` gating.

Old `PublicSale` source, wrappers, and scripts are removed from the active
workspace.

## Local Verification

```bash
acton fmt --check
acton build
acton wrapper --all
acton wrapper --all --ts
acton test
acton check
```

Current local result:

```text
58 passed in 7 files
```

## Deployment Scripts

HI-specific deployment:

```bash
acton run deploy-hi-tokenomics-emulation
acton run deploy-hi-tokenomics-testnet
```

HI-specific helpers:

```bash
acton run hi-oracle-report
acton run hi-oracle-confirm
acton run hi-oracle-set-campaign-winner
acton run hi-growth-buy
acton run hi-growth-claim
acton run hi-growth-close
acton run hi-growth-sweep-project-fund
acton run hi-growth-migration-smoke
acton run hi-team-claim
acton run hi-reward-single-leaf-root
acton run hi-reward-create-batch
acton run hi-reward-claim-empty-proof
acton run hi-reward-migration-smoke
acton run hi-campaign-winner-register
acton run hi-campaign-winner-claim
acton run hi-campaign-winner-info
acton run hi-campaign-winner-migration-smoke
```

For testnet, use the explicit `*-testnet` aliases.

## Required Environment

Deployment:

- `HI_DEPLOYER`
- `HI_ADMIN_ADDRESS`
- `HI_ORACLE_ADMIN_ADDRESS`
- `HI_ECOSYSTEM_ADMIN_ADDRESS`
- `HI_MIGRATION_WALLET_1`
- `HI_MIGRATION_WALLET_2`
- `HI_TEAM_WALLET`
- `HI_PROJECT_FUND_WALLET`
- `HI_LIQUIDITY_WALLET`
- `HI_INVESTOR_WALLET`
- `JETTON_NAME`
- `JETTON_SYMBOL`
- `JETTON_DESCRIPTION`
- `JETTON_IMAGE`
- `JETTON_DECIMALS`
- `HI_ORACLE_CONFIRMATION_DELAY`: use `30` on final testnet rehearsal and
  `86400` on mainnet.
- `HI_DEPLOYMENT_SALT` or `JETTON_DEPLOYMENT_SALT` for repeatable testnet
  rehearsals that must avoid a previously deployed deterministic address.

Operational scripts:

- `HI_PRICE_ORACLE_ADDRESS`
- `HI_ORACLE_ADMIN`
- `HI_ORACLE_CONFIRM_CALLER`
- `HI_ORACLE_PRICE_KIND`: `1 = growth`, `2 = team`
- `HI_ORACLE_CONFIRM_KIND`: `1 = growth`, `2 = team`
- `HI_ORACLE_PRICE`
- `HI_GROWTH_ENGINE_ADDRESS`
- `HI_BUYER`
- `HI_PURCHASE_TON_AMOUNT`
- `HI_PURCHASE_MSG_VALUE`
- `HI_CLAIM_MSG_VALUE`
- `HI_TEAM_VESTING_ADDRESS`
- `HI_TEAM_CLAIM_MSG_VALUE`
- `HI_MERKLE_REWARD_ADDRESS`
- `HI_ECOSYSTEM_ADMIN`
- `HI_REWARD_CLAIMANT`
- `HI_REWARD_CLAIMANT_WALLET`
- `HI_REWARD_BATCH_ID`
- `HI_REWARD_AMOUNT`
- `HI_REWARD_ROOT`
- `HI_REWARD_TOTAL_HI`
- `HI_REWARD_METADATA_HASH`
- `HI_REWARD_POOL_TYPE`
- `HI_REWARD_REQUIRED_GROWTH_LEVEL`
- `HI_REWARD_ADMIN_MSG_VALUE`
- `HI_REWARD_CLAIM_MSG_VALUE`
- `HI_CAMPAIGN_WINNER_ADDRESS`
- `HI_CAMPAIGN_ADMIN`
- `HI_CAMPAIGN_WINNER`

## Mainnet Boundary

This workspace is being prepared only up to the mainnet go/no-go package.
Mainnet deployment must not run until real role addresses, final metadata,
external review/audit decision, and explicit deployment approval are provided.
