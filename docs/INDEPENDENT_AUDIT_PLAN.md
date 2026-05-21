# HI Independent Audit Plan

Status: ready to send to an external auditor or independent reviewer.

This plan covers the final 7-contract GrowthEngine architecture and stops
before mainnet deployment. The auditor should review the repository state that
matches `docs/CODE_HASHES.md` and the fresh testnet evidence in
`docs/TESTNET_EVIDENCE.md`.

## Audit Goals

The audit must answer four questions:

1. Can any party mint, freeze, blacklist, tax, force-transfer, or otherwise
   change HI balances outside the intended Jetton rules?
2. Can any vault lose, overpay, underpay, or mis-route HI under normal,
   malicious, bounce, or low-gas conditions?
3. Can admins or migration wallets move more HI than the documented rules allow?
4. Does the deployed/tested behavior match the public tokenomics documents?

## Audit Scope

In scope:

- `contracts/JettonMinter.tolk`
- `contracts/JettonWallet.tolk`
- `contracts/GrowthEngine.tolk`
- `contracts/PriceOracle.tolk`
- `contracts/TeamVestingVault.tolk`
- `contracts/CampaignWinnerVault.tolk`
- `contracts/MerkleRewardVault.tolk`
- `contracts/messages.tolk`
- `contracts/storage.tolk`
- `contracts/tokenomics-messages.tolk`
- `contracts/tokenomics-storage.tolk`
- `contracts/errors.tolk`
- `contracts/fees-management.tolk`
- `contracts/jetton-utils.tolk`
- deployment and operation scripts under `scripts/`
- tests under `tests/`
- generated wrappers under `wrappers/` and `wrappers-ts/` as interface evidence
- docs under `docs/` as specification evidence

Out of scope:

- frontend, Bot, Admin UI, Cloudflare Functions, D1, Telegram identity,
  invitation graph, and off-chain risk control;
- oracle price source correctness, except for checking on-chain oracle
  permissioning and confirmation logic;
- mainnet deployment execution, because it has already been completed and is recorded in MAINNET_DEPLOYMENT_EVIDENCE.md.

## Required Inputs For Auditor

Provide the auditor:

- repository snapshot or commit hash;
- `docs/AUDIT_BRIEF.md`;
- `docs/CODE_HASHES.md`;
- `docs/TESTNET_EVIDENCE.md`;
- `docs/DEPLOYMENT_PACKAGE.md`;
- `docs/READINESS_CHECKLIST.md`;
- `docs/GO_NO_GO.md`;
- current testnet addresses from `docs/TESTNET_EVIDENCE.md`;
- final intended mainnet role addresses when available;
- final metadata/IPFS URI when available.

Do not provide any mnemonic or private key.

## Phase 1: Reproducibility

Auditor tasks:

1. Install/use the same Acton/Tolk toolchain recorded in `Acton.toml`.
2. Run:

   ```text
   acton fmt --check
   acton build
   acton wrapper --all
   acton wrapper --all --ts
   acton test
   acton check
   ```

3. Confirm tests report `69 passed in 7 files`, or document any difference.
4. Independently compute code hashes from `build/*.json`.
5. Compare computed hashes against `docs/CODE_HASHES.md`.
6. Confirm `Acton.toml` registers exactly the intended 7 contracts.
7. Confirm no active `PublicSale` contract remains outside archive docs.

Deliverable:

- reproducibility note with tool versions, command output, and code hash match.

## Phase 2: Jetton Supply And Wallet Rules

Auditor tasks:

1. Review `JettonMinter` one-time mint and allocation flow.
2. Confirm total supply is fixed at `10,000,000,000 HI`.
3. Confirm deployment drops minter admin after allocation.
4. Confirm no remaining mint path exists after admin drop.
5. Confirm no tax, blacklist, freeze, force-transfer, or force-burn logic exists.
6. Review wallet transfer/burn/bounce behavior.
7. Review shard-aware wallet address derivation.
8. Confirm insufficient gas paths fail without silent balance corruption.

Deliverable:

- supply and wallet safety section with any reachable privilege or accounting
  issue listed by severity.

## Phase 3: GrowthEngine

Auditor tasks:

1. Confirm only one purchase mode exists; no instant-price pool remains.
2. Confirm price is exactly `10100 HI / TON`.
3. Confirm minimum purchase is `0.1 TON`.
4. Confirm per-wallet cap is `5000 TON`.
5. Confirm only growth level 0 purchase releases exactly `5%` immediately.
6. Confirm levels 1-9 release `10%` each.
7. Confirm level 10 releases final `5%`.
8. Confirm late buyers do not receive level 0 or already confirmed historical tranches.
9. Confirm `entryLevel`, `claimedHi`, `missedHi`, and sold counters cannot be
   manipulated to over-claim.
10. Confirm bounce from Jetton transfer rolls back pending purchase/claim state.
11. Confirm permanent close cannot be reversed.
12. Confirm unsold/missed HI can only go to fixed project-fund wallet after
    permanent close.
13. Confirm TON withdrawal can only go to fixed admin wallet and keeps required
    balance assumptions.
14. Confirm migration transfer can only be triggered by migration wallet 1 or 2,
    only after target is configured, and only sends uncommitted HI to that target
    contract.

Deliverable:

- GrowthEngine accounting and permission report.

## Phase 4: PriceOracle

Auditor tasks:

1. Confirm growth levels and team levels are separate states.
2. Confirm growth levels can only advance from 0 to 10, one level at a time.
3. Confirm team levels can only advance from 0 to 4, one level at a time.
4. Confirm growth thresholds are TON-chain USDT/HI values:
   - `0.000396`
   - `0.000792`
   - `0.001584`
   - `0.003168`
   - `0.006337`
   - `0.012673`
   - `0.025347`
   - `0.050693`
   - `0.101386`
   - `0.202772`
5. Confirm confirmed levels cannot roll back.
6. Confirm candidate level timer resets if price drops below threshold.
7. Confirm confirmation delay is storage-configured:
   - testnet evidence uses `30` seconds;
   - mainnet package uses `86400` seconds.
8. Confirm only oracle admin can report prices and update targets.
9. Confirm anyone or the intended caller can confirm only after the delay,
   according to contract logic.
10. Confirm level sync messages go only to configured target contracts.
11. Confirm migration target allowlist management is admin-only where this
    oracle-adjacent target model is documented.

Deliverable:

- oracle centralization and level-confirmation risk assessment.

## Phase 5: TeamVestingVault

Auditor tasks:

1. Confirm total team allocation is `1,200,000,000 HI`.
2. Confirm team thresholds are:
   - `0.1 USDT`
   - `0.5 USDT`
   - `1 USDT`
   - `5 USDT`
3. Confirm each confirmed team level releases exactly `300,000,000 HI`.
4. Confirm claims are cumulative and cannot exceed total allocation.
5. Confirm payout destination is fixed team wallet, not caller-specified.
6. Confirm only oracle can sync team level.
7. Confirm bounce from Jetton transfer rolls back claimed state.
8. Confirm migration target selection is restricted to migration wallet 1 or 2
   and can only select an admin-allowlisted target. Confirm TeamVestingVault has
   no migratable HI because the full team allocation is committed.
9. Confirm selecting a migration target before admin allowlisting fails.

Deliverable:

- team vesting release and migration review.

## Phase 6: CampaignWinnerVault

Auditor tasks:

1. Confirm vault allocation is `400,000,000 HI`.
2. Confirm max winners is 80.
3. Confirm each winner allocation is `5,000,000 HI`.
4. Confirm only admin can register winners.
5. Confirm duplicate registration is impossible.
6. Confirm registration records current `growthConfirmedLevel` as `entryLevel`.
7. Confirm registration at `growthConfirmedLevel = 0` allows `5%` to be claimed.
8. Confirm confirmed growth levels 1-9 release `10%` each, and level 10 releases
   the final `5%`.
9. Confirm winners registered after already-confirmed levels cannot claim level 0
   or historical levels, and can only claim future levels.
10. Confirm no winner can claim more than `5,000,000 HI`.
11. Confirm only oracle can sync growth level and level cannot decrease.
12. Confirm bounce from Jetton transfer rolls back claimed state.
13. Confirm migration transfer only moves uncommitted HI to an admin-allowlisted
    target via migration wallet 1 or 2.
14. Confirm selecting a migration target before admin allowlisting fails.

Deliverable:

- campaign winner eligibility boundary and payout accounting report.

## Phase 7: MerkleRewardVault

Auditor tasks:

1. Confirm global MerkleReward allocation is `1,600,000,000 HI`.
2. Confirm supported pool types:
   - `1 = ecosystem`
   - `2 = universal_lottery`
   - `3 = red_packet`
3. Confirm only admin can create batches.
4. Confirm `batchId` cannot be reused.
5. Confirm batch root, total, metadata hash, pool type, and required growth
   level are immutable after creation.
6. Confirm `requiredGrowthLevel` blocks claims until oracle-synced growth level
   is high enough.
7. Confirm Merkle leaf construction matches scripts/docs.
8. Confirm invalid proof is rejected.
9. Confirm duplicate claim for `batchId + address` is rejected.
10. Confirm claimed amount cannot exceed batch total.
11. Confirm sum of batch totals cannot exceed pool/global cap.
12. Confirm bounce from Jetton transfer rolls back claimed state and claimedHi.
13. Confirm migration transfer only moves uncommitted HI to an admin-allowlisted
    target via migration wallet 1 or 2.
14. Confirm selecting a migration target before admin allowlisting fails.

Deliverable:

- Merkle proof, replay, cap, and bounce-safety report.

## Phase 8: Deployment Scripts And Mainnet Package

Auditor tasks:

1. Review `scripts/deploy-hi-tokenomics.tolk`.
2. Confirm allocation split:
   - GrowthEngine: `5,000,000,000 HI`
   - MerkleRewardVault: `1,600,000,000 HI`
   - CampaignWinnerVault: `400,000,000 HI`
   - TeamVestingVault: `1,200,000,000 HI`
   - Project fund wallet: `1,000,000,000 HI`
   - Liquidity wallet: `500,000,000 HI`
   - Investor / early wallet: `300,000,000 HI`
3. Confirm mainnet deployment package sets `HI_ORACLE_CONFIRMATION_DELAY=86400`.
4. Confirm testnet-only delay `30` seconds is not accidentally used for mainnet.
5. Confirm metadata fields are fixed before mainnet.
6. Confirm all mainnet role and destination addresses are supplied and reviewed.
7. Confirm migration wallet 1 and migration wallet 2 are separate, controlled,
   and documented.
8. Confirm migration targets are allowlisted by admin before either migration
   wallet can select them.
9. Confirm no testnet mnemonic or testnet private key appears in docs/scripts.

Deliverable:

- deployment readiness report and mainnet preflight checklist.

## Phase 9: Test Additions Requested From Auditor

The auditor should add or request tests for any issue found. At minimum, ask for
focused tests if not already covered to the auditor's satisfaction:

- GrowthEngine purchase with insufficient gas must not corrupt purchase state.
- GrowthEngine claim bounce must restore claimable state.
- GrowthEngine permanent close plus project-fund sweep cannot sweep sold but
  unclaimed HI.
- PriceOracle cannot confirm before delay and cannot skip levels.
- TeamVesting bounce rollback.
- CampaignWinner max winner boundary at winner 80 and winner 81.
- MerkleReward invalid proof, duplicate claim, over-total claim, and
  requiredGrowthLevel gating.
- Migration calls from non-migration wallets fail.
- Migration target must be configured before transfer.
- Migration cannot transfer committed balances.

## Severity Rules

Use this severity model:

- Critical: can mint extra HI, steal or permanently lock material user funds,
  bypass admin drop, bypass major release logic, or corrupt global accounting.
- High: can overpay/underpay a vault, bypass oracle level gating, sweep committed
  funds, or misuse migration to a wallet/arbitrary address.
- Medium: can cause failed claims under realistic conditions, inconsistent get
  methods, deployment misconfiguration, or denial of service with recovery.
- Low: documentation mismatch, minor operational risk, non-critical event/get
  method issue.
- Informational: style, clarity, test coverage suggestions.

## Audit Output Required

The final audit package should include:

1. executive summary;
2. exact repository snapshot / commit hash reviewed;
3. toolchain versions;
4. command outputs for reproducibility;
5. code hashes reviewed;
6. findings table with severity, affected files, exploit scenario, and fix
   recommendation;
7. confirmation of fixed-supply and admin-drop properties;
8. confirmation or rejection of tokenomics/documentation consistency;
9. list of recommended tests added or requested;
10. final recommendation:
    - pass for mainnet after address/metadata review;
    - pass with low/medium fixes;
    - no-go until high/critical fixes.

## Suggested Audit Timeline

For one independent senior TON/Tolk reviewer:

| Day | Work |
|---|---|
| 1 | Reproduce build, read docs, review Jetton and deployment scripts |
| 2 | Review GrowthEngine and PriceOracle |
| 3 | Review TeamVestingVault, CampaignWinnerVault, MerkleRewardVault |
| 4 | Write focused tests, verify testnet evidence, produce findings |
| 5 | Review fixes and issue final recommendation |

For a professional audit firm, use the same phases but expect 1-2 weeks because
they will add internal review and report QA.

## Mainnet Rule

Mainnet remains **NO-GO** until:

- all critical/high findings are fixed and re-tested;
- medium findings are fixed or explicitly accepted;
- final mainnet addresses are reviewed;
- final metadata/IPFS URI is reviewed;
- `HI_ORACLE_CONFIRMATION_DELAY=86400` is confirmed;
- the user gives explicit mainnet deployment authorization.
