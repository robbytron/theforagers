/**
 * One-shot script to populate iNaturalist Hero URL field in Airtable.
 * Fetches the first CC-BY photo from iNaturalist for each species and writes
 * the URL back to Airtable.
 *
 * Usage: npx tsx scripts/populate-inat-hero-urls.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';
const INAT_API = 'https://api.inaturalist.org/v1';

interface AirtableRecord {
  id: string;
  fields: {
    'Species Name': string;
    'iNaturalist Taxon ID'?: number;
    'iNaturalist Hero URL'?: string;
  };
}

interface INatPhoto {
  url: string;
  attribution: string;
  license_code: string;
}

interface INatObservation {
  photos: INatPhoto[];
}

async function fetchAllSpecies(): Promise<AirtableRecord[]> {
  const url = new URL(`${AIRTABLE_API}/${AIRTABLE_BASE_ID}/Species`);
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
    });
    if (!res.ok) throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

function resizeINatUrl(url: string, size: 'small' | 'medium' | 'large'): string {
  return url.replace(/\/square\.|\/small\.|\/medium\.|\/large\.|\/original\./, `/${size}.`);
}

async function getFirstCCBYPhoto(taxonId: number): Promise<string | null> {
  const params = new URLSearchParams({
    taxon_id: String(taxonId),
    quality_grade: 'research',
    per_page: '20',
    order: 'desc',
    order_by: 'votes',
    photos: 'true',
  });

  const res = await fetch(`${INAT_API}/observations?${params}`);
  if (!res.ok) {
    console.error(`  iNaturalist API error: ${res.status}`);
    return null;
  }

  const data: { results: INatObservation[] } = await res.json();

  for (const obs of data.results) {
    for (const photo of obs.photos) {
      // Only CC-BY licenses (no NC - commercial use required for affiliate links)
      if (!photo.license_code) continue;
      if (photo.license_code.toLowerCase().includes('nc')) continue;
      return resizeINatUrl(photo.url, 'large');
    }
  }

  return null;
}

async function updateAirtableRecord(recordId: string, heroUrl: string): Promise<void> {
  const res = await fetch(`${AIRTABLE_API}/${AIRTABLE_BASE_ID}/Species/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        'iNaturalist Hero URL': heroUrl,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update record ${recordId}: ${res.status} ${await res.text()}`);
  }
}

async function main() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_PAT) {
    console.error('Missing AIRTABLE_BASE_ID or AIRTABLE_PAT environment variables');
    process.exit(1);
  }

  console.log('Fetching all species from Airtable...');
  const records = await fetchAllSpecies();
  console.log(`Found ${records.length} species\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const record of records) {
    const name = record.fields['Species Name'];
    const taxonId = record.fields['iNaturalist Taxon ID'];
    const existingUrl = record.fields['iNaturalist Hero URL'];

    // Skip if already has URL
    if (existingUrl) {
      console.log(`⏭️  ${name}: already has URL, skipping`);
      skipped++;
      continue;
    }

    // Skip if no taxon ID
    if (!taxonId) {
      console.log(`⚠️  ${name}: no iNaturalist Taxon ID, skipping`);
      skipped++;
      continue;
    }

    process.stdout.write(`🔍 ${name}: fetching from iNaturalist (taxon ${taxonId})...`);

    try {
      const photoUrl = await getFirstCCBYPhoto(taxonId);

      if (!photoUrl) {
        console.log(` ❌ No CC-BY photos found`);
        failed++;
        continue;
      }

      console.log(` found!`);
      await updateAirtableRecord(record.id, photoUrl);
      console.log(`   ✅ Updated with: ${photoUrl.substring(0, 70)}...`);
      updated++;

      // Rate limit: wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      // Check if it's an unknown field error
      if (err.message?.includes('UNKNOWN_FIELD_NAME')) {
        console.log(`\n\n❌ The field "iNaturalist Hero URL" does not exist in Airtable.`);
        console.log(`\n📝 Please add a "Single line text" field named exactly "iNaturalist Hero URL" to your Species table in Airtable, then run this script again.\n`);
        process.exit(1);
      }
      console.error(`\n   ❌ Error: ${err.message || err}`);
      failed++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed:  ${failed}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
