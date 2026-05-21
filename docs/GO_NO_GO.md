# Mainnet Go / No-Go

Decision: **CONDITIONAL GO for mainnet readiness; NO-AUTH for mainnet deployment execution**.

## Current State

The current local GrowthEngine 7-contract implementation is green:

- `acton fmt --check`
- `acton build`
- `acton wrapper --all`
- `acton wrapper --all --ts`
- `acton test` with `69 passed in 7 files`
- `acton check`

Post-audit Medium/Low fixes and migration allowlist revoke semantics are complete.
Fresh testnet deployment, business rehearsal, frontend TonConnect claim E2E,
app contract-facing checks, and TON Verifier dry-run are complete for the
current hashes.

## Mainnet Blockers

Mainnet execution remains blocked because the final GrowthEngine version still
needs:

1. Explicit user authorization for mainnet deployment.

The owner has accepted the `O-01` migration permission model for V1:
admin-managed migration target allowlists, two migration wallets, and migration
limited to uncommitted HI only. Transfers re-check that the selected target is
still allowlisted, and removing a selected target clears that target. TeamVestingVault
is stricter: the full team allocation is committed to the price-release schedule,
so migration target selection is available but migratable HI is `0`. The owner
has also confirmed the final token metadata description wording:

```text
Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
```

## Conditions For Mainnet Execution

Mainnet deployment can be executed only when:

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

All readiness conditions except explicit deployment authorization are complete
for the current build and evidence set. Until authorization is given, the
correct state is: local code green, fresh testnet evidence complete, frontend
TonConnect claim E2E complete, verifier dry-run complete, mainnet deployment
not authorized.
