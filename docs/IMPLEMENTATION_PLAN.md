# HI GrowthEngine Implementation Plan

Status: local post-audit implementation, migration target allowlist changes,
fresh final testnet rehearsal, app contract-facing checks, and TON Verifier
dry-run are complete for the current allowlist code hashes. Mainnet deployment
is blocked pending final owner sign-off on the migration permission model,
final metadata wording confirmation, and explicit deployment authorization.

## Architecture

Current active contracts:

1. `JettonMinter`
2. `JettonWallet`
3. `GrowthEngine`
4. `PriceOracle`
5. `TeamVestingVault`
6. `CampaignWinnerVault`
7. `MerkleRewardVault`

Old `PublicSale` code, wrappers, and scripts are removed from the active
contract workspace.

## Implemented Rules

- GrowthEngine holds `5,000,000,000 HI`.
- GrowthEngine price is `10100 HI / TON`.
- No instant sale pool remains.
- Growth level 0 buy releases `5%` immediately.
- Later buys do not receive level 0 or already confirmed historical levels.
- Growth levels 1-9 release `10%` each.
- Growth level 10 releases final `5%`.
- PriceOracle tracks independent:
  - `growthConfirmedLevel 0-10`
  - `teamConfirmedLevel 0-4`
- TeamVestingVault holds `1,200,000,000 HI`.
- Team level releases are:
  - `0.1 USDT`: `300,000,000 HI`
  - `0.5 USDT`: `300,000,000 HI`
  - `1 USDT`: `300,000,000 HI`
  - `5 USDT`: `300,000,000 HI`
- CampaignWinnerVault follows GrowthEngine release rules.
- MerkleRewardVault supports `requiredGrowthLevel` per immutable batch.
- Business vaults support restricted migration to admin-allowlisted targets by
  either of two migration wallets.

## Local Gates

Local completed:

```text
acton fmt --check
acton build
acton wrapper --all
acton wrapper --all --ts
acton test        # 58 passed in 7 files
acton check
```

## Pre-Mainnet Package Status

Complete:

1. Fresh post-audit testnet deployment with `HI_ORACLE_CONFIRMATION_DELAY=30`.
2. Full final business rehearsal.
3. TON Verifier dry-run for all seven fresh testnet addresses.
4. `TESTNET_EVIDENCE.md` updated with fresh allowlist evidence.
5. Local gates re-run after evidence/docs/script updates.
6. `/Users/yudeyou/Desktop/100wan` contract-facing checks.
7. `/Users/yudeyou/Desktop/GrowthEngine` contract-facing checks.
8. Independent review found no new high/medium code issue after remediation.

Remaining before mainnet:

1. Final owner sign-off on the `O-01` migration permission model.
2. Final metadata wording confirmation.
3. Explicit mainnet deployment authorization.
