# Final GrowthEngine Testnet Evidence

## Fresh Red-Packet Adjustment Evidence: 2026-05-20

Status: **partial refresh for MerkleRewardVault red-packet cap change**.
The local code hash for `MerkleRewardVault` changed to
`514DD0ABA3408714D085E44978F786B99148038B0F7A47066FB7D9C156870D90`.
Older MerkleReward `poolType=2` evidence below is stale and must not be used
for current V1 readiness.

### Fresh Testnet Deployments

Cap validation deployment:

```text
HI_MINTER_ADDRESS=kQCsORv8LR9UaKK7JNW4HR3tvW4_zZR_px6yL2VMtgES8BPS
HI_MERKLE_REWARD_ADDRESS=kQCEYyfS-7gGkyLl_FvrWqiKRrRe4uji9qc5Z37mkEIEs9hR
HI_REWARD_JETTON_WALLET=kQCEEeLmzUp6dlp2jeAqfVJjFiebPz0QDl2Q0VmexTEuv5nV
HI_MERKLE_REWARD WALLET_BALANCE=1600000000000000000
HI_POST_DROP_MINTABLE=false
HI_POST_DROP_ADMIN_ADDRESS=null
```

Claim validation deployment:

```text
HI_MINTER_ADDRESS=kQDPYRXkYxhwsGtg6XUp_cAglUnHlOueWdYWwLPHCmYC93wA
HI_MERKLE_REWARD_ADDRESS=kQDowJyQHcFXb_zhwsU5XjMLBzYV8q81GqtUJxZ4shRZin4X
HI_REWARD_JETTON_WALLET=kQDoHl7-aoXeXuKWlcShBhbReSywPn7HpV-UDEZcI7eSprOB
HI_MERKLE_REWARD WALLET_BALANCE=1600000000000000000
HI_POST_DROP_MINTABLE=false
HI_POST_DROP_ADMIN_ADDRESS=null
```

### Red-Packet Cap Evidence

`poolType=3` red packet batch at exactly `100,000,000 HI` succeeded:

```text
HI_REWARD_BATCH_STATE=(12345, 100000000000000000, 0, 0, 3, 0)
```

Adding another `1 HI` red packet batch failed with `exit_code=204`
(`Errors.InsufficientInventory`).

Creating a positive `poolType=2` universal lottery batch also failed with
`exit_code=204`, confirming the V1 chain cap is `0 HI`.

### Red-Packet Claim Evidence

A small `poolType=3` red packet batch for `5,000 HI` was created and claimed:

```text
HI_REWARD_BATCH_STATE=(76917304944896826186745901880439751413028552984720951283605372136604198919914, 5000000000000, 0, 0, 3, 0)
HI_REWARD_HAS_CLAIMED=true
HI_REWARD_BATCH_STATE=(76917304944896826186745901880439751413028552984720951283605372136604198919914, 5000000000000, 5000000000000, 0, 3, 0)
```

### Frontend TonConnect Claim E2E Evidence

The `/Users/yudeyou/Desktop/GrowthEngine` frontend thread ran real testnet
TonConnect claim transactions from the actual funded Tonkeeper testnet wallet:

```text
wallet user format: 0QCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQU_g
wallet bounceable testnet: kQCxJ05yeawVWlsN5SfJ-obajgh2lFffR-O7ebH_s_wqQRIl
```

Red-packet claim:

```text
tx hash: F7eZbVqb7+2vavipV6F9LhWHSpR09u+Fv+QbrG6oVDM=
attached TON: 0.3 TON
aborted=false
compute_success=true
exit_code=0
action_result_code=0

before batch_state(5001) =
(114662029248631739694441699519084078340295858974732504872327124450795303637832,
 5000000000000, 0, 0, 3, 0)
before has_claimed=false

after batch_state(5001) =
(114662029248631739694441699519084078340295858974732504872327124450795303637832,
 5000000000000, 5000000000000, 0, 3, 0)
after has_claimed=true
```

CampaignWinner claim:

```text
tx hash: /C0WcvEzCOZeiJriPtLqR1R/pCNsxf85wH8W9umuF3A=
attached TON: 0.3 TON
aborted=false
compute_success=true
exit_code=0
action_result_code=0

before winner_state=(true, 0, 0, 250000000000000)
before claimable=250000000000000
before vault_state=(0, 2, 0, 0)

after winner_state=(true, 0, 250000000000000, 0)
after claimable=0
after vault_state=(0, 2, 250000000000000, 0)
```

### TON Verifier Dry-Run

All 7 contracts were re-run with TON Verifier dry-run against the refreshed
testnet deployment:

```text
JettonMinter      kQDPYRXkYxhwsGtg6XUp_cAglUnHlOueWdYWwLPHCmYC93wA  6BF8F48CA97D3FD9C8E553344EFE7AF030C322459E2EE2197A052162F1961BFB
JettonWallet      kQDWP0tQlZiI07gDAxFOntuvlaZBWmTxncPW1ceOYKB59URg  7BFA53BCE90CE26CD368EC2989EBA2BD15D286104742F0E04659F485A03012BA
GrowthEngine      kQDWxz-_Puq1PnaLYbFOuLDhlHa_jVk7YtdVUCBO_q4eDR3M  AEAB27C98239D3889F91BBB2BAC7F0AA66525615855D35021BEF42F03BCBC532
PriceOracle       kQD-YVIuu66dXqxYYC2u03TRUJYO0feXa44DOsqHlLNxqtOD  94E36D148B9C453D9EFA7D421194B75ECA68CA6921AF5C25E951BCB685296D96
TeamVestingVault  kQDf1A6I4hM3r9BYB7JEtUnym4XzEjBrG9PNMqu6_huGNzbe  50F2662E4E1C2B394C33196A9F030667BA66E35DA055F92A1B43D1ACC87B261E
CampaignWinner    kQCLsSFO8npMyxX28yUC9YZAceytRcZ8HmawzRphgsRnuuzu  170A26394C6FCC70E8DB664FAADCF4D6BB5B9EB19A0FCFF8D22DF438B36208EC
MerkleRewardVault kQDowJyQHcFXb_zhwsU5XjMLBzYV8q81GqtUJxZ4shRZin4X  514DD0ABA3408714D085E44978F786B99148038B0F7A47066FB7D9C156870D90
```

Each dry-run returned `Backend verification successful` and skipped the final
transaction send.

## Historical Audit-Fix Testnet Evidence: 2026-05-20

Status: **superseded by the red-packet adjustment evidence above**. This section
is retained only as historical audit-fix rehearsal context. Its
`MerkleRewardVault` hash predates the final `poolType=2` zero-cap and
`poolType=3` 100,000,000 HI red-packet cap change, so this section must not be
used as the current mainnet readiness record.

### Contract Addresses

| Contract / wallet | Testnet address |
|---|---|
| `JettonMinter` | `kQAuwHEonii4p2UQ4EQt3X9H_oi8o2UfTGFFUt5WwNcEzmPl` |
| `PriceOracle` | `kQAWiTpoHUuSAzCg00Ub5To_WgcATQqmHftm6ggi-Ykij2_o` |
| `GrowthEngine` | `kQBnxGHqyLhkTQJU7g_Ion2yN-O5fBxpADkbPYj9hCBhh-4M` |
| `TeamVestingVault` | `kQBF_unS4htGOlyBe-14JOvE-No2OoLU34G7Q0X2-dLMJEEy` |
| `MerkleRewardVault` | `kQDIBvqHRl6VPYB90GmPpImx7AlcukBamOfzIGO_TmIZVvUd` |
| `CampaignWinnerVault` | `kQB1DTXwuHfl-LN3dZ83OGsY75EiPZRvGw7DDSTXo4jQCRJ8` |
| GrowthEngine jetton wallet | `kQBnPQdopqerj3ojiatXT954BIfGMTewD1PkQVcV9Z34CWlT` |
| TeamVesting jetton wallet | `kQBFuR3diFMNmCfNxlkesZp63vuxkPyjIAvpiToT-qTd9INN` |
| MerkleReward jetton wallet | `kQDI8IaUKcoQJ-jnoEIrt8RODRw1bOPzw3GRFTz3r0dEJWI4` |
| CampaignWinner jetton wallet | `kQB18fwMcNchIrqYwVUbuXlH7N5aoFNdDW9CVEPSbjKdzQcQ` |

### Deployment Evidence

Fresh deployment used `HI_ORACLE_CONFIRMATION_DELAY=30` and a unique
`HI_DEPLOYMENT_SALT`. Testnet-only local wallets were used.

```text
HI_GROWTH_ENGINE PRE_DROP_BALANCE=5000000000000000000
HI_MERKLE_REWARD PRE_DROP_BALANCE=1600000000000000000
HI_CAMPAIGN_WINNER PRE_DROP_BALANCE=400000000000000000
HI_TEAM_VESTING PRE_DROP_BALANCE=1200000000000000000
HI_PROJECT_FUND PRE_DROP_BALANCE=1000000000000000000
HI_LIQUIDITY PRE_DROP_BALANCE=500000000000000000
HI_INVESTOR PRE_DROP_BALANCE=300000000000000000
HI_POST_MINT_TOTAL_SUPPLY=10000000000000000000
HI_POST_MINT_MINTABLE=true
HI_POST_DROP_TOTAL_SUPPLY=10000000000000000000
HI_POST_DROP_MINTABLE=false
HI_POST_DROP_ADMIN_ADDRESS=null
```

Drop admin transaction:

```text
58ee6a5557617ef3317b0555d5cc55feb65616e38e37fe7e91869a2f10d7279c
```

### Business Flow Evidence

GrowthEngine level 0 buy:

```text
HI_GROWTH_BUYER_STATE=(100000000, 1010000000000, 0, 50500000000, 0)
HI_GROWTH_STATE=(0, 1010000000000, 50500000000, 0, 0, 4999998990000000000)
```

Growth levels 1-10 confirmed with 30-second delay:

```text
HI_ORACLE_GROWTH_CONFIRMED_LEVEL=10
```

GrowthEngine final claim:

```text
HI_GROWTH_BUYER_STATE=(100000000, 1010000000000, 0, 1010000000000, 0)
HI_GROWTH_STATE=(10, 1010000000000, 1010000000000, 0, 0, 4999998990000000000)
```

Team levels 1-4 and final team claim:

```text
HI_ORACLE_TEAM_CONFIRMED_LEVEL=4
HI_TEAM_VESTING_STATE=(4, 1200000000000000000, 1200000000000000000)
```

CampaignWinner late registration at growth level 10:

```text
HI_CAMPAIGN_WINNER_STATE=(true, 10, 0, 0)
HI_CAMPAIGN_VAULT_STATE=(10, 1, 0, 0)
```

MerkleReward batches with `requiredGrowthLevel=10` before the unified
red-packet adjustment:

```text
poolType=1 batch claimed successfully
poolType=2 evidence is stale and must not be used for the current V1 cap=0
poolType=3 batch claimed successfully before the cap changed to 100,000,000 HI
HI_REWARD_HAS_CLAIMED=true
```

Migration smoke:

```text
GrowthEngine: HI_GROWTH_STATE=(10, 1010000000000, 1010000000000, 0, 1000000000, 4999998989000000000)
CampaignWinnerVault: HI_CAMPAIGN_VAULT_STATE=(10, 1, 0, 1000000000)
MerkleRewardVault: HI_REWARD_POOL_STATE=(200000000000, 100000000000, 100000000000, 1000000000, 10)
TeamVestingVault: HI_TEAM_VESTING_STATE=(4, 1200000000000000000, 1200000000000000000)
```

TeamVesting migration target allowlist and target selection were exercised.
Transfer amount was `0` because all `1,200,000,000 HI` team allocation is
committed and migratable HI is `0`.

### TON Verifier Dry-Run

All 7 contracts returned backend verification success with `--dry-run` for this
historical deployment. For current readiness, use the refreshed 7-contract
dry-run table above.

| Contract | Code hash |
|---|---|
| `JettonMinter` | `6BF8F48CA97D3FD9C8E553344EFE7AF030C322459E2EE2197A052162F1961BFB` |
| `JettonWallet` | `7BFA53BCE90CE26CD368EC2989EBA2BD15D286104742F0E04659F485A03012BA` |
| `GrowthEngine` | `AEAB27C98239D3889F91BBB2BAC7F0AA66525615855D35021BEF42F03BCBC532` |
| `PriceOracle` | `94E36D148B9C453D9EFA7D421194B75ECA68CA6921AF5C25E951BCB685296D96` |
| `TeamVestingVault` | `50F2662E4E1C2B394C33196A9F030667BA66E35DA055F92A1B43D1ACC87B261E` |
| `CampaignWinnerVault` | `170A26394C6FCC70E8DB664FAADCF4D6BB5B9EB19A0FCFF8D22DF438B36208EC` |
| `MerkleRewardVault` | `9CF178B6F5BF4901D93BC6C9D45B220E7E385ACBFC40ABC31D0C1DF7578ED425` |

### Local And App Gates

```text
acton fmt --check
acton build
acton wrapper --all
acton wrapper --all --ts
acton test        # 69 passed in 7 files
acton check

/Users/yudeyou/Desktop/100wan:
npm run lint
npm run test:agent-flow
npm run build

/Users/yudeyou/Desktop/GrowthEngine:
npm run lint
npm run test:growth-supporters
npm run test:growth-ton
npm run build
```
