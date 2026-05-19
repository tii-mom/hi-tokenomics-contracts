# Mainnet Go / No-Go

Decision: **NO-GO for mainnet deployment**.

## Current State

The current local GrowthEngine 7-contract implementation is green:

- `acton fmt --check`
- `acton build`
- `acton wrapper --all`
- `acton wrapper --all --ts`
- `acton test` with `58 passed in 7 files`
- `acton check`

Post-audit local fixes and migration allowlist code changes are complete.
Fresh testnet deployment, business rehearsal, app contract-facing checks, and
TON Verifier dry-run are complete for the current allowlist hashes.

## Mainnet Blockers

Mainnet remains no-go because the final GrowthEngine version still needs:

1. Explicit user authorization for mainnet deployment.

The owner has accepted the `O-01` migration permission model for V1:
admin-managed migration target allowlists, two migration wallets, and migration
limited to uncommitted HI only. TeamVestingVault is stricter: the full team
allocation is committed to the price-release schedule, so migration target
selection is available but migratable HI is `0`. The owner has also confirmed
the final token metadata description wording:

```text
Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
```

## Conditions For GO

GO can be considered only when:

- fresh testnet evidence covers every critical flow;
- `/Users/yudeyou/Desktop/100wan` and `/Users/yudeyou/Desktop/GrowthEngine`
  contract-facing checks pass;
- `CODE_HASHES.md` matches final build artifacts after all changes;
- verifier dry-run succeeds for all seven contracts;
- deployment package uses `HI_ORACLE_CONFIRMATION_DELAY=86400` for mainnet;
- all mainnet addresses are supplied and reviewed;
- the owner explicitly accepts the migration permission model;
- the owner confirms the final metadata description wording;
- the user explicitly authorizes mainnet deployment.

The first eight conditions are complete for the current build and evidence set.
Until explicit deployment authorization is given, the correct state is: local
allowlist code green, fresh testnet evidence complete, verifier dry-run
complete, pre-mainnet approval complete, mainnet deployment not authorized.
