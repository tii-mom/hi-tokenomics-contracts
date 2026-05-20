# HI Allocation Plan

Total supply: `10,000,000,000 HI`.

All amounts use 9 decimals on chain.

| Allocation | Percent | Amount | Destination |
|---|---:|---:|---|
| GrowthEngine | `50%` | `5,000,000,000 HI` | `GrowthEngine` contract |
| Ecosystem Merkle rewards | `16%` | `1,600,000,000 HI` | `MerkleRewardVault` contract |
| Campaign winners | `4%` | `400,000,000 HI` | `CampaignWinnerVault` contract |
| Team holding | `12%` | `1,200,000,000 HI` | `TeamVestingVault` contract |
| Project fund | `10%` | `1,000,000,000 HI` | fixed project-fund wallet |
| Liquidity | `5%` | `500,000,000 HI` | fixed liquidity wallet |
| Investor / early | `3%` | `300,000,000 HI` | fixed investor / early wallet |

The ecosystem allocation is still `20% = 2,000,000,000 HI` in total. It is split
between `CampaignWinnerVault` (`400,000,000 HI`) and `MerkleRewardVault`
(`1,600,000,000 HI`). The current 500万 HI campaign uses `400,000,000 HI` in
CampaignWinnerVault plus a unified `100,000,000 HI` red-packet reward budget
from MerkleRewardVault.

For the current campaign, the previous `80,000,000 HI` universal lottery budget
is merged into red packets. `poolType=3 red_packet` should support
`100,000,000 HI` inside the shared `1,600,000,000 HI` MerkleRewardVault pool.
`poolType=2 universal_lottery` remains encoded for compatibility, but its V1
chain cap is `0 HI`; current frontend/backend operations must not create that
batch type.

After all allocations are minted and transferred, `JettonMinter` admin must be
dropped. Mainnet deployment is not authorized until real destination addresses,
metadata, audit/review decision, and explicit approval are provided.
