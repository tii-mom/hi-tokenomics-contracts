# Tonkeeper Asset Listing Request

Status: prepared for Tonkeeper / TonAPI asset indexing.

## Why This Is Needed

The deployed HI Jetton metadata is readable on-chain and through Toncenter:

```text
name=Human Intention
symbol=HI
image=https://gateway.pinata.cloud/ipfs/bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom
decimals=9
```

However, TonAPI currently returns the mainnet Jetton as an unknown token:

```text
name=Unknown Token-azS
symbol=UKWN-azS
image=token_placeholder
verification=none
```

Tonkeeper uses TonAPI/cache data for wallet display, so users can see the
placeholder name and logo until the asset is indexed/accepted.

## Mainnet Jetton

```text
JettonMinter: EQCBs2bpHXFOq19TOGoxyKKrsta7109dMYg7tFxejxVx-azS
name: Human Intention
symbol: HI
decimals: 9
description: Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
```

## Direct Logo File

Tonkeeper's asset repository asks for a direct image URL ending in an image
extension. The stable file prepared for that is:

```text
metadata/hi-logo.png
```

After the public repository is pushed, the direct raw URL is:

```text
https://raw.githubusercontent.com/tii-mom/hi-tokenomics-contracts/main/metadata/hi-logo.png
```

## Prepared ton-assets File

This repository contains a ready-to-copy file:

```text
ton-assets/jettons/HumanIntention.yaml
```

For Tonkeeper's `ton-assets` repository, copy it to:

```text
jettons/HumanIntention.yaml
```

Note: `jettons/HI.yaml` is already used by another token in Tonkeeper's
repository. Use the unique filename above; the token symbol inside the file is
still `HI`.

Prepared content:

```yaml
name: Human Intention
description: Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
image: "https://raw.githubusercontent.com/tii-mom/hi-tokenomics-contracts/main/metadata/hi-logo.png"
address: EQCBs2bpHXFOq19TOGoxyKKrsta7109dMYg7tFxejxVx-azS
symbol: HI
websites:
  - "https://smt.it.com"
social:
  - "https://t.me/HumanIntention"
  - "https://x.com/72hour_s"
```

## Submission Steps

1. Ensure the public `tii-mom/hi-tokenomics-contracts` repository is pushed so
   the raw logo URL works.
2. Fork `https://github.com/tonkeeper/ton-assets`.
3. Add `jettons/HumanIntention.yaml` only. Do not edit generated JSON files.
4. Open a pull request to Tonkeeper's `ton-assets` repository.
5. Wait for review and cache refresh.

No mainnet contract change is required.
