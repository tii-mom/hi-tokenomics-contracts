# Readiness Checklist

Status: local GrowthEngine 7-contract implementation is green after migration
allowlist changes. Fresh testnet deployment, business rehearsal, app contract
integration checks, and TON Verifier dry-run are complete for the current
allowlist hashes. Mainnet remains blocked pending explicit deployment
authorization.

## Local Build Readiness

- [x] `acton fmt --check`
- [x] `acton build`
- [x] `acton wrapper --all`
- [x] `acton wrapper --all --ts`
- [x] `acton test` (`58 passed in 7 files`)
- [x] `acton check`
- [x] `CODE_HASHES.md` updated for current 7 contracts

## Current Business Rules

- [x] `GrowthEngine` replaces `PublicSale`.
- [x] GrowthEngine has no instant pool.
- [x] GrowthEngine purchase price is `10100 HI / TON`.
- [x] GrowthEngine immediate release is `5%`.
- [x] Growth levels 1-9 release `10%` each.
- [x] Growth level 10 releases final `5%`.
- [x] Late GrowthEngine buyers do not receive historical tranches.
- [x] `PriceOracle` separates `growthConfirmedLevel 0-10` and
  `teamConfirmedLevel 0-4`.
- [x] Testnet oracle delay is configurable to `30` seconds.
- [x] Mainnet oracle delay defaults to `86400` seconds.
- [x] Team release is price based at `0.1`, `0.5`, `1`, and `5` USDT.
- [x] Team releases `300,000,000 HI` per team level, total
  `1,200,000,000 HI`.
- [x] `CampaignWinnerVault` uses growth level and the same `5/10/.../5`
  release schedule.
- [x] `MerkleRewardVault` supports `requiredGrowthLevel` per batch.
- [x] Business vault migration/rescue transfers are restricted to two
  migration wallets, admin-managed target allowlists, and one selected target.

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
- [x] MerkleReward ecosystem / universal lottery / red packet batch evidence.
- [x] Migration/rescue smoke evidence with allowlisted targets.
- [x] TON Verifier dry-run for all seven fresh testnet addresses.
- [x] `<local-100wan-workspace>` contract-facing checks.
- [x] `<local-growthengine-workspace>` contract-facing checks.

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
- [x] Independent review found no new high/medium code issue after remediation.
- [x] Final owner sign-off on `O-01` migration permission model.
- [ ] Explicit mainnet deployment approval.

## Mainnet Status

Mainnet deployment is blocked. No mainnet deployment has been executed.
