# HI Mainnet Deployment Evidence

Status: mainnet deployment completed on 2026-05-21.

## Deployment Summary

The HI tokenomics package was deployed to TON mainnet after final local gates,
fresh testnet evidence, frontend TonConnect claim E2E, and independent review.

The deployer/admin TonConnect wallet used for the deployment resolved to the
owner-approved admin/deployer address. Role wallet addresses are intentionally
redacted from this public repository; the private deployment package keeps the
full operational record.

```text
admin/deployer: <redacted in public repo>
connected wallet: <redacted in public repo>
```

Mainnet deployment used `HI_ORACLE_CONFIRMATION_DELAY=86400`.

## Mainnet Contract Addresses

| Contract | Mainnet address | Tonviewer |
|---|---|---|
| `JettonMinter` | `EQCBs2bpHXFOq19TOGoxyKKrsta7109dMYg7tFxejxVx-azS` | https://tonviewer.com/EQCBs2bpHXFOq19TOGoxyKKrsta7109dMYg7tFxejxVx-azS |
| `PriceOracle` | `EQBGLDiTrBuNOCL8VL-Kpq3OZtDnvmU_S92jsbjwS4LpeP8V` | https://tonviewer.com/EQBGLDiTrBuNOCL8VL-Kpq3OZtDnvmU_S92jsbjwS4LpeP8V |
| `GrowthEngine` | `EQDUd67S1AMDz5KYrVdsS8Z646csQFnCXTDr94isNJ0U0w4N` | https://tonviewer.com/EQDUd67S1AMDz5KYrVdsS8Z646csQFnCXTDr94isNJ0U0w4N |
| `TeamVestingVault` | `EQAy1xgExpT84Cv67u0XfP-OzPQH9II1DlN_-w7pfBXohYDm` | https://tonviewer.com/EQAy1xgExpT84Cv67u0XfP-OzPQH9II1DlN_-w7pfBXohYDm |
| `MerkleRewardVault` | `EQCI9f9BA2I_9WbDuFlLuzpa5uSZsPDWFcIfijWiFSFjy9Wg` | https://tonviewer.com/EQCI9f9BA2I_9WbDuFlLuzpa5uSZsPDWFcIfijWiFSFjy9Wg |
| `CampaignWinnerVault` | `EQD7jkObKT56cQ-f6_fWKsYIPeZUetxSAZE1gZd7_fiLsdKG` | https://tonviewer.com/EQD7jkObKT56cQ-f6_fWKsYIPeZUetxSAZE1gZd7_fiLsdKG |

`JettonWallet` code is verified through deployed allocation wallets. The sample
wallet used for verifier dry-run was the GrowthEngine HI wallet.

## Mainnet HI Wallets And Balances

All balances are base units with `9` decimals.

| Owner | HI wallet | Balance | Human amount |
|---|---|---:|---:|
| `GrowthEngine` | `EQDUAhE56883abEGsKTgfKwwUEijBOoh9wk09Fq_y9fS4LB6` | `5000000000000000000` | `5,000,000,000 HI` |
| `MerkleRewardVault` | `EQCIrDkopmdDFamZAyVHy5x2HfGOBFvpgGqUJfMz7C3Ir7dh` | `1600000000000000000` | `1,600,000,000 HI` |
| `CampaignWinnerVault` | `EQD7rcYcxwPtPxUmMOp0EgzduunGEThvtQ6zdCa_q2ReZojX` | `400000000000000000` | `400,000,000 HI` |
| `TeamVestingVault` | `EQAyk2uXKQEkq4n8ZsSmQ21KeiUABbSn0EDAZPMj-9-dpYqB` | `1200000000000000000` | `1,200,000,000 HI` |
| Project fund wallet | `EQCo7TAUiox-ynhXvQke7fOmCLuxM3YVG-dFmUskQt6i4Hyz` | `1000000000000000000` | `1,000,000,000 HI` |
| Liquidity wallet | `EQC1Sx1yY_MR2dzLoquMiAE6IIn46aVaLYUsX1b3MMAipI0z` | `500000000000000000` | `500,000,000 HI` |
| Investor / early wallet | `EQDqbWviuQcS8DL3dvBymjkO8gA0u_qT94uhaoJp2KsHimQW` | `300000000000000000` | `300,000,000 HI` |

Total allocation: `10,000,000,000 HI`.

## JettonMinter Post-Drop State

Post-deploy script output:

```text
HI_POST_DROP_TOTAL_SUPPLY=10000000000000000000
HI_POST_DROP_MINTABLE=false
HI_POST_DROP_ADMIN_ADDRESS=null
```

Independent post-deploy `scripts/info.tolk` query:

```text
JETTON TOTAL_SUPPLY=10000000000000000000
JETTON MINTABLE=false
JETTON ADMIN_ADDRESS=null
JETTON METADATA_name=Human Intention
JETTON METADATA_symbol=HI
JETTON METADATA_description=Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
JETTON METADATA_image=https://gateway.pinata.cloud/ipfs/bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom
JETTON METADATA_decimals=9
```

This confirms minting has been permanently disabled after the 10 billion HI
supply was distributed.

## Business Contract Initial State

Post-deploy getter output:

```text
GROWTH_STATE=(0, 0, 0, 0, 0, 5000000000000000000)
ORACLE_GROWTH_CONFIRMED_LEVEL=0
ORACLE_TEAM_CONFIRMED_LEVEL=0
ORACLE_GROWTH_CANDIDATE_STATE=(0, 0, 0)
ORACLE_TEAM_CANDIDATE_STATE=(0, 0, 0)
TEAM_VESTING_STATE=(0, 0, 0)
MERKLE_POOL_STATE=(0, 0, 0, 0, 0)
CAMPAIGN_VAULT_STATE=(0, 0, 0, 0)
CAMPAIGN_GROWTH_CONFIRMED_LEVEL=0
```

Interpretation:

- GrowthEngine is at level `0` and still holds the full `5,000,000,000 HI`
  growth pool.
- Oracle growth/team confirmed levels are both `0`.
- No team claim has been released.
- No Merkle batch has been committed yet.
- No CampaignWinner has been registered yet.

## Mainnet Transaction Hashes

Deployment transaction hashes recorded during execution:

```text
189b12c724b9d37e58c65853eb1853ea5a29c06e77cc7c626c19c018ded9007a
d0ee8693b3b6070153814067ccbf13b5e0942ff530e72409aa9cc9c9e25644d1
27c631d3059aac1d00b5a9ebe94bd1d63d2a4beb60883dfb35ccfca8b98f33ad
dddfbe195fc0802a70331d23e51c348262cdd53c0f499784f44937d4046db9de
60e943f1da6c9feebe15a8e9c682fbb4647d9dff74ed097e001c85850b37ce6e
afeda234bf94207671d0a8007beab00f5a60b53351f300a9ac283f08a68a8452
16d8a1fba109d0641488938b979f6c9f81a371b1d83370817604bb5dedf039bb
b1876e7e4b62b8559ad4178c3fbc8a77f3b14a17682e509bccd538359029c47c
ca482a8b65666c84834edf75d82f0d31c34bc2fb1b29b8e7611e2bc3e21ad023
248ccb782417e60e07e63777688f4e8cdd0651a124921c6e70e345407ee8c2a7
```

Drop-admin transaction:

```text
1d1be46177ca9f8f779b12151e8c0e01875b02947f056ba67fd9a34b0d6f058a
```

## Code Hashes

The deployed contracts correspond to the local build hashes in
`docs/CODE_HASHES.md`:

| Contract | Code Hash |
|---|---|
| `CampaignWinnerVault` | `170A26394C6FCC70E8DB664FAADCF4D6BB5B9EB19A0FCFF8D22DF438B36208EC` |
| `GrowthEngine` | `AEAB27C98239D3889F91BBB2BAC7F0AA66525615855D35021BEF42F03BCBC532` |
| `JettonMinter` | `6BF8F48CA97D3FD9C8E553344EFE7AF030C322459E2EE2197A052162F1961BFB` |
| `JettonWallet` | `7BFA53BCE90CE26CD368EC2989EBA2BD15D286104742F0E04659F485A03012BA` |
| `MerkleRewardVault` | `514DD0ABA3408714D085E44978F786B99148038B0F7A47066FB7D9C156870D90` |
| `PriceOracle` | `94E36D148B9C453D9EFA7D421194B75ECA68CA6921AF5C25E951BCB685296D96` |
| `TeamVestingVault` | `50F2662E4E1C2B394C33196A9F030667BA66E35DA055F92A1B43D1ACC87B261E` |

## Mainnet Verifier Dry-Run

Mainnet TON Verifier dry-run was run after deployment:

| Contract | Result |
|---|---|
| `JettonMinter` | Already verified on verifier backend |
| `JettonWallet` | Already verified on verifier backend |
| `GrowthEngine` | Backend verification successful; dry-run transaction prepared |
| `PriceOracle` | Backend verification successful; dry-run transaction prepared |
| `TeamVestingVault` | Backend verification successful; dry-run transaction prepared |
| `CampaignWinnerVault` | Backend verification successful; dry-run transaction prepared |
| `MerkleRewardVault` | Backend verification successful; dry-run transaction prepared |

Actual on-chain verifier publication is a separate operational transaction and
can be sent after explicit approval.

## Metadata

```text
name=Human Intention
symbol=HI
decimals=9
description=Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
image=https://gateway.pinata.cloud/ipfs/bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom
metadata_uri=ipfs://bafkreiboziv7sd4dyfh4zn5iuwchxisldchidopfhns5gc36mbmo2atadq
```

The deployed on-chain Jetton metadata stores the fields directly in TEP-64
on-chain format. The IPFS metadata URI remains the public off-chain metadata
reference for listings and external cross-checks.

## Next Operational Steps

1. Decide whether to publish the five prepared TON Verifier transactions on
   mainnet. `JettonMinter` and `JettonWallet` are already verified by code hash.
2. Update frontend and backend mainnet configuration with the contract
   addresses above.
3. Run a read-only production health check after the app config is updated.
4. Do not enable GrowthEngine purchases publicly until frontend mainnet config,
   indexer config, metadata display, and operational runbooks are reviewed.
