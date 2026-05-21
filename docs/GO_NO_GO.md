# Mainnet Go / No-Go

Decision: **MAINNET DEPLOYED; post-deploy verification complete for core state**.

## Current State

The current local GrowthEngine 7-contract implementation was deployed to TON
mainnet after these gates were green:

- `acton fmt --check`
- `acton build`
- `acton wrapper --all`
- `acton wrapper --all --ts`
- `acton test` with `69 passed in 7 files`
- `acton check`

Post-audit Medium/Low fixes and migration allowlist revoke semantics are
complete. Fresh testnet deployment, business rehearsal, frontend TonConnect
claim E2E, app contract-facing checks, and TON Verifier dry-run are complete
for the deployed hashes.

## Mainnet Deployment Result

Mainnet deployment was explicitly authorized by the owner and executed on
2026-05-21.

Evidence: `docs/MAINNET_DEPLOYMENT_EVIDENCE.md`.

Post-deploy state:

- total supply is `10,000,000,000 HI`;
- minter admin is dropped: `mintable=false`, `admin=null`;
- all seven allocation balances match the final 50% / 16% / 4% / 12% / 10% /
  5% / 3% distribution;
- GrowthEngine starts at level `0` with the full `5,000,000,000 HI` pool;
- oracle growth/team confirmed levels start at `0`;
- Team, CampaignWinner, and MerkleReward claim states start clean at `0`.

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

## Remaining Operational Items

- Monitor Tonkeeper asset-listing PR #5299 until merged and cache-refresh is
  visible in Tonkeeper/TonAPI.
- Update app/frontend/backend mainnet configuration with deployed addresses.
- Run read-only production health checks after app config is updated.
- Keep public GrowthEngine launch disabled until frontend mainnet config,
  indexer config, listing metadata, and operations runbooks are reviewed.
