# Final GrowthEngine Testnet Rehearsal Runbook

Status: executed for the final GrowthEngine version. The commands below are
kept as the repeatable runbook for future rehearsals.

## Deploy

```bash
HI_ORACLE_CONFIRMATION_DELAY=30 acton script scripts/deploy-hi-tokenomics.tolk --net testnet
```

## Evidence

Recorded in `docs/TESTNET_EVIDENCE.md`:

- all seven contract addresses;
- all related Jetton Wallet addresses;
- code hashes;
- total supply;
- allocation balances;
- minter admin dropped;
- GrowthEngine buyer state and growth state;
- Oracle growth and team states;
- TeamVestingVault state;
- CampaignWinnerVault winner and vault states;
- MerkleRewardVault pool, batch, and claimed states;
- TON Verifier dry-run result per contract.

## Business Rehearsal

1. Deploy fresh seven-contract package.
2. Confirm allocations:
   - `GrowthEngine`: `5,000,000,000 HI`
   - `MerkleRewardVault`: `1,600,000,000 HI`
   - `CampaignWinnerVault`: `400,000,000 HI`
   - `TeamVestingVault`: `1,200,000,000 HI`
   - project fund: `1,000,000,000 HI`
   - liquidity: `500,000,000 HI`
   - investor / early: `300,000,000 HI`
3. Drop minter admin and verify mint is impossible.
4. Execute GrowthEngine buy at `10100 HI / TON` while growth level is 0 and confirm `5%` immediate HI.
5. Confirm growth levels 1-3.
6. Buy after level 3 and confirm level 0 plus historical levels are not claimable.
7. Confirm level 4 and claim only the newly unlocked tranche.
8. Confirm through growth level 10 and verify final `5%`.
9. Confirm team levels 1-4 and claim each cumulative team release.
10. Register CampaignWinner and verify GrowthEngine-aligned claim schedule.
11. Create MerkleReward batches for:
    - ecosystem
    - red packet (`poolType=3`, current campaign unified red-packet pool)
12. Verify `requiredGrowthLevel` blocks and then allows claims.
13. Verify invalid proof, duplicate claim, and over-total failures.
14. Smoke-test migration/rescue transfer:
    - admin allowlists the target first;
    - selecting a non-allowlisted target fails;
    - migration wallet 1 or 2 transfers only uncommitted balance to the
      allowlisted target.
15. Run TON Verifier dry-run for all seven contracts.

## Verifier Dry-Run Targets

```bash
acton verify JettonMinter --net testnet --address <minter> --dry-run
acton verify JettonWallet --net testnet --address <sample-wallet> --dry-run
acton verify GrowthEngine --net testnet --address <growth-engine> --dry-run
acton verify PriceOracle --net testnet --address <oracle> --dry-run
acton verify TeamVestingVault --net testnet --address <team-vault> --dry-run
acton verify CampaignWinnerVault --net testnet --address <campaign-winner> --dry-run
acton verify MerkleRewardVault --net testnet --address <merkle-reward> --dry-run
```
