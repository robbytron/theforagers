const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
}

const BASE_ID = envVars.AIRTABLE_BASE_ID;
const PAT = envVars.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';
const INAT_API = 'https://api.inaturalist.org/v1';

async function getINatPhoto(taxonId) {
  // Use license filter to get properly licensed photos
  const params = new URLSearchParams({
    taxon_id: String(taxonId),
    quality_grade: 'research',
    per_page: '5',
    order: 'desc',
    order_by: 'votes',
    photos: 'true',
    photo_license: 'cc0,cc-by,cc-by-sa',
  });

  const res = await fetch(`${INAT_API}/observations?${params}`);
  if (!res.ok) return null;

  const data = await res.json();

  for (const obs of data.results) {
    for (const photo of obs.photos) {
      // Double-check license
      if (!photo.license_code) continue;
      if (photo.license_code.includes('nc')) continue;
      // Return large version
      return photo.url.replace(/\/square\.|\/small\.|\/medium\.|\/original\./, '/large.');
    }
  }
  return null;
}

async function main() {
  console.log('Fetching all species...');

  // Fetch all species
  let allRecords = [];
  let offset;
  do {
    const url = new URL(`${AIRTABLE_API}/${BASE_ID}/Species`);
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${PAT}` }
    });
    const data = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  console.log(`Found ${allRecords.length} species`);

  // Find species needing hero URLs
  const needsHero = allRecords.filter(r => {
    const f = r.fields;
    // Has taxon ID, no hero image, no hero URL
    return f['iNaturalist Taxon ID'] && !f['Hero Image'] && !f['iNaturalist Hero URL'];
  });

  console.log(`${needsHero.length} species need hero URLs`);

  if (needsHero.length === 0) {
    console.log('Nothing to update!');
    return;
  }

  // Process each
  const updates = [];
  for (const record of needsHero) {
    const taxonId = record.fields['iNaturalist Taxon ID'];
    const name = record.fields['Species Name'];

    console.log(`Fetching photo for ${name} (taxon ${taxonId})...`);
    const photoUrl = await getINatPhoto(taxonId);

    if (photoUrl) {
      updates.push({ id: record.id, fields: { 'iNaturalist Hero URL': photoUrl } });
      console.log(`  ✓ Found photo`);
    } else {
      console.log(`  ✗ No licensed photo found`);
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  if (updates.length === 0) {
    console.log('\nNo photos found to update');
    return;
  }

  // Update in batches of 10
  console.log(`\nUpdating ${updates.length} species...`);
  const BATCH_SIZE = 10;

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);

    const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/Species`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: batch })
    });

    if (!res.ok) {
      console.error('Error:', await res.text());
    } else {
      console.log(`  Updated batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone! Updated ${updates.length} hero URLs.`);
}

main().catch(console.error);
