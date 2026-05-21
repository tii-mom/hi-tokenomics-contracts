# Readiness Checklist

Status: mainnet deployment completed on 2026-05-21. Local gates, fresh testnet
deployment, business rehearsal, frontend TonConnect claim E2E, app contract
integration checks, and TON Verifier dry-run were complete before deployment.
Post-deploy core state and allocation balances have been verified.

## Local Build Readiness

- [x] `acton fmt --check`
- [x] `acton build`
- [x] `acton wrapper --all`
- [x] `acton wrapper --all --ts`
- [x] `acton test` (`69 passed in 7 files`)
- [x] `acton check`
- [x] `CODE_HASHES.md` updated for current 7 contracts

## Current Business Rules

- [x] `GrowthEngine` replaces `PublicSale`.
- [x] GrowthEngine has no instant pool.
- [x] GrowthEngine purchase price is `10100 HI / TON`.
- [x] GrowthEngine level 0 initial release is `5%`.
- [x] Growth levels 1-9 release `10%` each.
- [x] Growth level 10 releases final `5%`.
- [x] Late GrowthEngine buyers do not receive level 0 or historical tranches.
- [x] `PriceOracle` separates `growthConfirmedLevel 0-10` and
  `teamConfirmedLevel 0-4`.
- [x] Testnet oracle delay is configurable to `30` seconds.
- [x] Mainnet oracle delay defaults to `86400` seconds.
- [x] Team release is price based at `0.1`, `0.5`, `1`, and `5` USDT.
- [x] Team releases `300,000,000 HI` per team level, total
  `1,200,000,000 HI`.
- [x] `CampaignWinnerVault` matches GrowthEngine release logic: level 0 `5%`,
  levels 1-9 `10%` each, level 10 final `5%`, with no historical catch-up for
  late winners.
- [x] `MerkleRewardVault` supports `requiredGrowthLevel` per batch.
- [x] Business vault migration/rescue transfers are restricted to two
  migration wallets, admin-managed target allowlists, and one selected target.
- [x] Migration transfer re-checks the selected target is currently allowlisted.
- [x] Removing an allowlisted selected target clears/blocks the selected target.

## Fresh Testnet Readiness

- [x] Fresh allowlist 7-contract testnet deployment with
  `HI_ORACLE_CONFIRMATION_DELAY=30`.
- [x] Allocation evidence for `5B / 1.6B / 0.4B / 1.2B / 1B / 0.5B / 0.3B`.
- [x] Minter admin dropped and cannot mint.
- [x] GrowthEngine buy and claim evidence.
- [x] Growth levels 1-10 evidence.
- [x] Late-buyer no-catch-up behavior covered by local test.
- [x] Team levels 1-4 evidence.
- [x] CampaignWinner registration and claim evidence.
- [x] MerkleReward red packet cap and batch evidence refreshed after the
  100,000,000 HI unified red-packet adjustment:
  `poolType=3` 100,000,000 HI cap succeeds, +1 HI fails, `poolType=2`
  positive batch fails, and a 5,000 HI `poolType=3` claim succeeds.
- [x] Migration/rescue smoke evidence with allowlisted targets.
- [x] Local regression tests for allowlist revoke, migrated inventory caps, and
  Growth/Campaign/Merkle/migration bounce rollback.
- [x] TON Verifier dry-run for all seven fresh testnet addresses.
- [x] `/Users/yudeyou/Desktop/100wan` contract-facing checks.
- [x] `/Users/yudeyou/Desktop/GrowthEngine` contract-facing checks.
- [x] Frontend TonConnect claim E2E for `MerkleRewardVault` red-packet claim.
- [x] Frontend TonConnect claim E2E for `CampaignWinnerVault` winner claim.

## Mainnet Inputs

- [x] Mainnet admin / deployer / reward admin address.
- [x] Mainnet oracle admin address.
- [x] Mainnet team wallet address.
- [x] Mainnet project fund wallet address.
- [x] Mainnet liquidity wallet address.
- [x] Mainnet investor wallet address.
- [x] Mainnet migration wallet 1.
- [x] Mainnet migration wallet 2.
- [x] Final metadata/IPFS URI confirmation.
- [x] Final metadata wording confirmation.
- [x] Migration target allowlist model implemented locally.
- [x] Independent review confirms the latest Medium/Low audit-fix remediation.
- [x] Final owner sign-off on `O-01` migration permission model.
- [x] Explicit mainnet deployment approval.
- [x] Mainnet deployment executed.
- [x] Minter admin dropped after deployment.
- [x] Mainnet allocation balances verified.
- [x] Mainnet initial business states verified.
- [x] Mainnet TON Verifier dry-run completed.

## Mainnet Status

Mainnet deployment has been executed. Evidence is recorded in
`docs/MAINNET_DEPLOYMENT_EVIDENCE.md`.

Remaining operational items:

- publish prepared TON Verifier transactions on mainnet if approved;
- update app/backend/frontend production configuration;
- run read-only production health checks;
- keep public GrowthEngine launch disabled until production configuration and
  listing/indexer behavior are reviewed.
