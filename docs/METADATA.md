# HI Token Metadata

Status: uploaded, gateway-checked, configured locally, and final wording
confirmed by the owner on 2026-05-19.

## Current Metadata

| Field | Value |
|---|---|
| name | `Human Intention` |
| symbol | `HI` |
| decimals | `9` |
| description | `Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.` |
| image | `https://gateway.pinata.cloud/ipfs/bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom` |
| website | `https://smt.it.com` |
| telegram | `https://t.me/HumanIntention` |
| x | `https://x.com/72hour_s` |

Source logo file:

```text
/Users/yudeyou/Desktop/100wan/a54daaea-3245-4bfc-a1c0-174dbdf0316f_副本.png
```

Stable repository logo file for wallet/listing submissions:

```text
metadata/hi-logo.png
```

Logo properties checked locally:

```text
PNG, 1254 x 1254, RGB, non-interlaced
```

## Pinata Upload Status

Initial upload was attempted with `.env` variable `pinata_key`, but Pinata returned:

```text
INVALID_CREDENTIALS: token is malformed
```

That value was not a Pinata JWT. Upload succeeded after adding valid Pinata
credentials to `.env`.

Uploaded artifacts:

| Artifact | CID | URL |
|---|---|---|
| Logo PNG | `bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom` | `https://gateway.pinata.cloud/ipfs/bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom` |
| Metadata JSON | `bafkreiboziv7sd4dyfh4zn5iuwchxisldchidopfhns5gc36mbmo2atadq` | `ipfs://bafkreiboziv7sd4dyfh4zn5iuwchxisldchidopfhns5gc36mbmo2atadq` |

Verified gateway URLs:

```text
https://gateway.pinata.cloud/ipfs/bafybeiccmlxpjecldfui2heolxevwmkcwa4oxklhbdjy2jca56ttodetom
https://gateway.pinata.cloud/ipfs/bafkreiboziv7sd4dyfh4zn5iuwchxisldchidopfhns5gc36mbmo2atadq
```

Latest check:

- Logo PNG returned HTTP `200`, `content-type: image/png`.
- Metadata JSON returned HTTP `200`, `content-type: application/json`, and
  matched the local metadata file.

For future uploads, provide one of these:

- `PINATA_JWT`, a full JWT token; or
- both `PINATA_API_KEY` and `PINATA_API_SECRET` for legacy API-key auth.

Do not commit real Pinata credentials.

## Mainnet Metadata Decision

The final token description language is confirmed:

```text
Human Intention (HI) helps users better command Agents. Its innovative token release mechanism rewards true crypto believers.
```

The on-chain Jetton metadata stores the TEP-64 core fields:
`name`, `symbol`, `description`, `image`, and `decimals`.

The public metadata JSON URI is:

```text
ipfs://bafkreiboziv7sd4dyfh4zn5iuwchxisldchidopfhns5gc36mbmo2atadq
```

This public JSON is used for public documentation and external verification.
Social links are documented there and in audit/deployment materials, but are not
written into the on-chain metadata cell.

The current deploy script writes these TEP-64 on-chain fields:

- `name`
- `symbol`
- `description`
- `image`
- `decimals`

Social links are documented for public/audit materials, but are not written into
the on-chain metadata cell by `scripts/utils/common.tolk`.

## Tonkeeper / TonAPI Display

Toncenter can read the on-chain HI metadata, but TonAPI/Tonkeeper may still show
`Unknown Token-azS` until their asset index accepts the token. The prepared
Tonkeeper listing file is:

```text
ton-assets/jettons/HI.yaml
```

Details and submission steps are in:

```text
docs/TONKEEPER_ASSET_LISTING.md
```
