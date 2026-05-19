# HI GrowthEngine Audit Brief

Status: post-audit fixes, migration allowlist changes, fresh testnet rehearsal,
app contract-facing checks, and TON Verifier dry-run are complete for the
current allowlist code hashes. Mainnet remains blocked pending final owner
sign-off on the migration permission model, final metadata wording
confirmation, and explicit deployment authorization.

## Scope

Contracts:

- `contracts/JettonMinter.tolk`
- `contracts/JettonWallet.tolk`
- `contracts/GrowthEngine.tolk`
- `contracts/PriceOracle.tolk`
- `contracts/TeamVestingVault.tolk`
- `contracts/CampaignWinnerVault.tolk`
- `contracts/MerkleRewardVault.tolk`

Deployment and operation scripts under `scripts/` are support material.

## Core Properties

- Fixed supply: `10,000,000,000 HI`.
- Full supply minted and distributed once during deployment.
- Minter admin is dropped after distribution.
- No transfer tax, blacklist, freeze, force-transfer, or force-burn behavior.
- Project fund, liquidity, and investor allocations are direct fixed-wallet
  transfers.

## Migration Trust Boundary

Business vault migration is now constrained by admin-managed target allowlists.
The admin must add a target address to the relevant vault's allowlist before
either configured migration wallet can select it. Migration wallets can transfer
only uncommitted HI to the selected allowlisted target. The model does not use
code-hash checks or timelock governance.

## GrowthEngine

- Holds `5,000,000,000 HI`.
- Single purchase mode only; no instant pool.
- Price: `10100 HI / TON`.
- Per-wallet purchase cap: `5000 TON`.
- Minimum purchase: `0.1 TON`.
- Growth level 0 purchase sends `5%` immediately.
- Late buyers do not receive level 0 or historical tranches.
- Growth levels 1-9 release `10%` each.
- Growth level 10 releases final `5%`.
- Unsold and missed/unclaimable HI can only be swept to fixed project-fund
  wallet after permanent close.
- Uncommitted migration can only go to an admin-allowlisted target selected by
  migration wallet 1 or migration wallet 2.

## PriceOracle

- Single admin reports USDT/HI price.
- Growth thresholds are immutable levels 1-10, denominated in TON-chain
  USDT/HI fixed-point units.
- Team thresholds are immutable levels 1-4:
  - `0.1 USDT`
  - `0.5 USDT`
  - `1 USDT`
  - `5 USDT`
- Confirmation delay is deployment storage:
  - mainnet: `86400` seconds
  - testnet rehearsal: `30` seconds
- Confirmed levels advance by one only, cannot skip or roll back.
- Growth level sync targets: GrowthEngine, CampaignWinnerVault,
  MerkleRewardVault.
- Team level sync target: TeamVestingVault.

## TeamVestingVault

- Holds `1,200,000,000 HI`.
- Releases `300,000,000 HI` per team level.
- Claims are cumulative and always transfer to the fixed team wallet.
- No time-based monthly release remains; team release is price-level based only.
- Uncommitted migration can only go to an admin-allowlisted target selected by
  either migration wallet.

## CampaignWinnerVault

- Holds `400,000,000 HI` for 500万 HI campaign winners.
- Admin registers up to 80 winners.
- Each winner allocation is `5,000,000 HI`.
- Registration records current `growthConfirmedLevel` as `entryLevel`.
- Campaign winner rewards use the same release curve as GrowthEngine:
  level 0 registration can claim `5%`, confirmed growth levels 1-9 release
  `10%` each, and confirmed growth level 10 releases the final `5%`.
- Winners registered after already-confirmed levels do not receive level 0 or
  historical level rewards; only future confirmed levels are claimable.
- Eligibility, Telegram identity, invite graph, and risk control are off-chain.

## MerkleRewardVault

- Holds `1,600,000,000 HI` of the ecosystem allocation.
- Unified Merkle vault for ecosystem, universal lottery, and red packet batches.
- Admin-created batches are immutable and include:
  `batchId`, `root`, `totalHi`, `metadataHash`, `poolType`,
  `requiredGrowthLevel`.
- `poolType`:
  - `1 = ecosystem`
  - `2 = universal_lottery`
  - `3 = red_packet`
- `requiredGrowthLevel` blocks claim until PriceOracle confirms the required
  growth level.
- Duplicate claim per `batchId + address` is rejected.
- Batch claimed amount cannot exceed batch total.
- All batch totals share the global `1,600,000,000 HI` MerkleRewardVault cap.

## Local Verification

Latest local checks:

```text
acton fmt --check
acton build
acton wrapper --all
acton wrapper --all --ts
acton test        # 58 passed in 7 files
acton check
```

## Testnet Evidence

`docs/TESTNET_EVIDENCE.md` records the fresh `hi2` testnet rehearsal for the
current allowlist hashes:

- allocation and minter admin drop;
- GrowthEngine buy and level 10 full claim;
- local test coverage for level 0 initial `5%`, late-buyer no-catch-up, and level 10 final `5%`;
- PriceOracle growth levels 1-10 and team levels 1-4 with 30-second delay;
- TeamVestingVault all four price releases;
- CampaignWinnerVault registration and claim;
- MerkleRewardVault ecosystem, universal lottery, and red packet batches;
- local test coverage for invalid proof, duplicate claim, over-total,
  malformed proof, and deep proof paths;
- migration smoke for contracts with remaining uncommitted balance and
  allowlisted targets;
- TON Verifier dry-run for all seven contracts;
- `/Users/yudeyou/Desktop/100wan` and `/Users/yudeyou/Desktop/GrowthEngine`
  contract-facing checks.

## Open Before Mainnet

- Final owner sign-off on `O-01` migration permission model.
- Final metadata wording confirmation.
- Explicit mainnet deployment approval.

## Independent Audit Task Plan

Use `docs/INDEPENDENT_AUDIT_PLAN.md` as the complete task checklist for an
external auditor or independent reviewer.
