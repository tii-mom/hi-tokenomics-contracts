#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const contractRoot = path.resolve(import.meta.dirname, '..');
const logoPath = process.env.HI_LOGO_PATH ??
  path.join(repoRoot, 'a54daaea-3245-4bfc-a1c0-174dbdf0316f_副本.png');
const metadataPath = process.env.HI_METADATA_PATH ??
  path.join(contractRoot, 'metadata/hi-token.metadata.json');

loadDotenv(path.join(repoRoot, '.env'));
loadDotenv(path.join(contractRoot, '.env'));

const authHeaders = pinataAuthHeaders();

const logo = await uploadFile(logoPath, 'hi-logo.png', 'image/png');
const logoIpfsUrl = `ipfs://${logo.IpfsHash}`;

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
metadata.image = logoIpfsUrl;

const metadataUpload = await uploadJson(metadata, 'hi-token.metadata.json');

console.log(JSON.stringify({
  logo: {
    cid: logo.IpfsHash,
    ipfs: logoIpfsUrl,
    gateway: `https://gateway.pinata.cloud/ipfs/${logo.IpfsHash}`,
  },
  metadata: {
    cid: metadataUpload.IpfsHash,
    ipfs: `ipfs://${metadataUpload.IpfsHash}`,
    gateway: `https://gateway.pinata.cloud/ipfs/${metadataUpload.IpfsHash}`,
  },
  deployEnv: {
    JETTON_NAME: metadata.name,
    JETTON_SYMBOL: metadata.symbol,
    JETTON_DESCRIPTION: metadata.description,
    JETTON_IMAGE: logoIpfsUrl,
    JETTON_DECIMALS: metadata.decimals,
  },
}, null, 2));

function loadDotenv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
    if (!match) {
      continue;
    }
    const key = match[1];
    if (process.env[key] != null) {
      continue;
    }
    process.env[key] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function pinataAuthHeaders() {
  const jwt = process.env.PINATA_JWT ?? process.env.pinata_jwt;
  if (jwt) {
    return { Authorization: `Bearer ${jwt}` };
  }
  const legacyKey = process.env.PINATA_API_KEY ?? process.env.pinata_key;
  const legacySecret = process.env.PINATA_API_SECRET ?? process.env.pinata_secret;
  if (legacyKey && legacySecret) {
    return {
      pinata_api_key: legacyKey,
      pinata_secret_api_key: legacySecret,
    };
  }
  throw new Error('Set PINATA_JWT, or set both PINATA_API_KEY and PINATA_API_SECRET.');
}

async function uploadFile(filePath, filename, contentType) {
  const bytes = fs.readFileSync(filePath);
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: contentType }), filename);
  form.append('pinataMetadata', JSON.stringify({ name: filename }));
  form.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
  return postPinata('https://api.pinata.cloud/pinning/pinFileToIPFS', form);
}

async function uploadJson(value, name) {
  return postPinata('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    pinataContent: value,
    pinataMetadata: { name },
    pinataOptions: { cidVersion: 1 },
  });
}

async function postPinata(url, body) {
  const isForm = body instanceof FormData;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...authHeaders,
      ...(isForm ? {} : { 'content-type': 'application/json' }),
    },
    body: isForm ? body : JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.status} ${text}`);
  }
  return JSON.parse(text);
}
