#!/usr/bin/env node
/**
 * add-taxon-ids.mjs
 * Adds iNaturalist Taxon IDs to the 10 seed species in Airtable.
 *
 * Run from your project root:
 *   node scripts/add-taxon-ids.mjs
 *
 * Requires: AIRTABLE_BASE_ID and AIRTABLE_PAT in .env.local
 * (or pass them as environment variables directly)
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local if running locally ────────────────────────────────────────
function loadEnv() {
  try {
    const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of env.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    }
  } catch {
    // .env.local not found — assume env vars are set externally
  }
}

loadEnv();

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PAT     = process.env.AIRTABLE_PAT;
const TABLE   = 'Species'; // Adjust if your table name differs

if (!BASE_ID || !PAT) {
  console.error('❌  AIRTABLE_BASE_ID and AIRTABLE_PAT must be set in .env.local');
  process.exit(1);
}

// ── Taxon ID map ──────────────────────────────────────────────────────────────
// Key = exact species name as stored in Airtable's "Species Name" field
const TAXON_IDS = {
  'Wild Garlic':      55863,
  'Common Nettle':    53811,
  'Hawthorn':         56365,
  'Wood Sorrel':      55844,
  'Elderflower':      56009,
  'Chanterelle':      54026,
  'Blackberry':       52639,
  'Sloe':             56299, // stored as "Sloe" or "Sloe (Blackthorn)" — handled below
  'Pignut':           119745,
  'Sea Purslane':     534511,
};

// ── Airtable helpers ──────────────────────────────────────────────────────────
const AIRTABLE_BASE = `https://api.airtable.com/v0/${BASE_ID}`;

async function airtableFetch(path, options = {}) {
  const res = await fetch(`${AIRTABLE_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAT}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status}: ${body}`);
  }

  return res.json();
}

// Fetch all records from the Species table (handles pagination)
async function fetchAllSpecies() {
  const records = [];
  let offset;

  do {
    const params = new URLSearchParams({
      fields: ['Species Name', 'iNaturalist Taxon ID'],
      ...(offset ? { offset } : {}),
    });

    // URLSearchParams doesn't handle arrays the Airtable way — build manually
    const fieldParams = 'fields%5B%5D=Species+Name&fields%5B%5D=iNaturalist+Taxon+ID';
    const url = `/${encodeURIComponent(TABLE)}?${fieldParams}${offset ? `&offset=${offset}` : ''}`;

    const data = await airtableFetch(url);
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

// Patch a single record with the taxon ID
async function updateTaxonId(recordId, taxonId) {
  return airtableFetch(`/${encodeURIComponent(TABLE)}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      fields: {
        'iNaturalist Taxon ID': taxonId,
      },
    }),
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌿  The Foragers — Adding iNaturalist Taxon IDs\n');
  console.log(`    Base: ${BASE_ID}`);
  console.log(`    Table: ${TABLE}\n`);

  // Fetch existing records
  console.log('📋  Fetching species records from Airtable...');
  const records = await fetchAllSpecies();
  console.log(`    Found ${records.length} record(s)\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const record of records) {
    const name    = record.fields['Species Name'] ?? '';
    const current = record.fields['iNaturalist Taxon ID'];

    // Normalise name for matching — strip parenthetical suffixes like "(Blackthorn)"
    const normalisedName = name.replace(/\s*\(.*\)/, '').trim();
    const taxonId        = TAXON_IDS[name] ?? TAXON_IDS[normalisedName];

    if (!taxonId) {
      console.log(`  ⚠️   No taxon ID mapped for: "${name}" — skipping`);
      notFound++;
      continue;
    }

    if (current === taxonId) {
      console.log(`  ✓   ${name} — already set to ${taxonId}`);
      skipped++;
      continue;
    }

    try {
      await updateTaxonId(record.id, taxonId);
      console.log(`  ✅  ${name.padEnd(20)} → taxon ID ${taxonId}`);
      updated++;
    } catch (err) {
      console.error(`  ❌  ${name} — update failed: ${err.message}`);
    }

    // Airtable rate limit: 5 requests/second — small delay
    await new Promise(r => setTimeout(r, 220));
  }

  console.log('\n─────────────────────────────────────');
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (already set): ${skipped}`);
  console.log(`  Not in map: ${notFound}`);
  console.log('─────────────────────────────────────');

  if (updated > 0) {
    console.log('\n✅  Done. iNaturalist photo layer should now fire on species pages.');
    console.log('    Check: http://localhost:3001/species/wild-garlic\n');
  } else if (skipped === records.length) {
    console.log('\n✅  All taxon IDs were already set. Nothing to do.\n');
  } else {
    console.log('\n⚠️   Some records were not updated. Check output above.\n');
  }
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err.message);
  process.exit(1);
});
