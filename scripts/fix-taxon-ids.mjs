#!/usr/bin/env node
/**
 * fix-taxon-ids.mjs
 * Looks up the correct iNaturalist taxon IDs by Latin name
 * and updates Airtable in one shot.
 *
 * Run from your project root:
 *   node scripts/fix-taxon-ids.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local ───────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of env.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
    }
  } catch { /* env vars set externally */ }
}

loadEnv();

const BASE_ID      = process.env.AIRTABLE_BASE_ID;
const PAT          = process.env.AIRTABLE_PAT;
const AIRTABLE_API = `https://api.airtable.com/v0/${BASE_ID}`;
const INAT_API     = 'https://api.inaturalist.org/v1';

if (!BASE_ID || !PAT) {
  console.error('❌  Missing AIRTABLE_BASE_ID or AIRTABLE_PAT in .env.local');
  process.exit(1);
}

// ── Species: common name → Latin name ────────────────────────────────────────
// Latin name is the authoritative lookup key for iNaturalist
const SPECIES = [
  { name: 'Wild Garlic',    latin: 'Allium ursinum' },
  { name: 'Common Nettle',  latin: 'Urtica dioica' },
  { name: 'Hawthorn',       latin: 'Crataegus monogyna' },
  { name: 'Wood Sorrel',    latin: 'Oxalis acetosella' },
  { name: 'Elderflower',    latin: 'Sambucus nigra' },
  { name: 'Chanterelle',    latin: 'Cantharellus cibarius' },
  { name: 'Blackberry',     latin: 'Rubus fruticosus' },
  { name: 'Sloe',           latin: 'Prunus spinosa' },
  { name: 'Pignut',         latin: 'Conopodium majus' },
  { name: 'Sea Purslane',   latin: 'Atriplex portulacoides' },
];

// ── iNaturalist lookup ────────────────────────────────────────────────────────
async function lookupTaxonId(latinName) {
  const url = `${INAT_API}/taxa?q=${encodeURIComponent(latinName)}&rank=species&per_page=5`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iNat error ${res.status}`);
  const data = await res.json();

  // Find exact species-rank match for this Latin name
  const match = data.results.find(
    t => t.rank === 'species' && t.name.toLowerCase() === latinName.toLowerCase()
  );

  // Fall back to first species-rank result if no exact match
  const fallback = data.results.find(t => t.rank === 'species');

  return match ?? fallback ?? null;
}

// ── Airtable helpers ──────────────────────────────────────────────────────────
async function fetchAllSpecies() {
  const records = [];
  let offset;
  do {
    const url = `${AIRTABLE_API}/${encodeURIComponent('Species')}?fields%5B%5D=Species+Name&fields%5B%5D=Latin+Name&fields%5B%5D=iNaturalist+Taxon+ID${offset ? `&offset=${offset}` : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${PAT}` } });
    if (!res.ok) throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

async function updateTaxonId(recordId, taxonId) {
  const res = await fetch(`${AIRTABLE_API}/${encodeURIComponent('Species')}/${recordId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { 'iNaturalist Taxon ID': taxonId } }),
  });
  if (!res.ok) throw new Error(`Airtable update error ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌿  The Foragers — Fixing iNaturalist Taxon IDs\n');

  // Step 1: fetch Airtable records
  console.log('📋  Fetching species from Airtable...');
  const records = await fetchAllSpecies();
  console.log(`    Found ${records.length} records\n`);

  // Step 2: look up correct taxon IDs from iNaturalist
  console.log('🔍  Looking up taxon IDs from iNaturalist...\n');

  const updates = [];

  for (const species of SPECIES) {
    // Find matching Airtable record
    const record = records.find(r => {
      const recordName = (r.fields['Species Name'] ?? '').toLowerCase();
      return recordName === species.name.toLowerCase();
    });

    if (!record) {
      console.log(`  ⚠️   "${species.name}" not found in Airtable — skipping`);
      continue;
    }

    // Look up on iNaturalist
    try {
      const taxon = await lookupTaxonId(species.latin);

      if (!taxon) {
        console.log(`  ❌  ${species.name} (${species.latin}) — no iNat match found`);
        continue;
      }

      const currentId = record.fields['iNaturalist Taxon ID'];
      const correct   = taxon.id === currentId;

      console.log(`  ${correct ? '✓ ' : '🔄'} ${species.name.padEnd(18)} | ${species.latin.padEnd(28)} | taxon ID: ${taxon.id}${!correct && currentId ? ` (was ${currentId})` : ''}`);

      updates.push({ recordId: record.id, name: species.name, taxonId: taxon.id, changed: !correct });

      // iNaturalist rate limit — be polite
      await new Promise(r => setTimeout(r, 300));

    } catch (err) {
      console.log(`  ❌  ${species.name} — lookup failed: ${err.message}`);
    }
  }

  // Step 3: update Airtable
  const toUpdate = updates.filter(u => u.changed);

  if (toUpdate.length === 0) {
    console.log('\n✅  All taxon IDs are already correct. Nothing to update.');
    return;
  }

  console.log(`\n📝  Updating ${toUpdate.length} record(s) in Airtable...\n`);

  for (const u of toUpdate) {
    try {
      await updateTaxonId(u.recordId, u.taxonId);
      console.log(`  ✅  ${u.name} → ${u.taxonId}`);
      await new Promise(r => setTimeout(r, 220));
    } catch (err) {
      console.log(`  ❌  ${u.name} — update failed: ${err.message}`);
    }
  }

  console.log('\n✅  Done! Check a species page to verify photos are loading.');
  console.log('    http://localhost:3001/species/wild-garlic\n');
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err.message);
  process.exit(1);
});
