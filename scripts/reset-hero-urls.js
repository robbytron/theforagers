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

const UK_PLACE_ID = 6857; // United Kingdom

async function getINatPhoto(taxonId) {
  // Try UK first, then global - CC0 only
  for (const placeId of [UK_PLACE_ID, null]) {
    const params = new URLSearchParams({
      taxon_id: String(taxonId),
      quality_grade: 'research',
      per_page: '5',
      order: 'desc',
      order_by: 'votes',
      photos: 'true',
      photo_license: 'cc0',
    });

    if (placeId) {
      params.set('place_id', String(placeId));
    }

    const res = await fetch(`${INAT_API}/observations?${params}`);
    if (!res.ok) continue;

    const data = await res.json();

    for (const obs of data.results) {
      for (const photo of obs.photos) {
        if (photo.license_code !== 'cc0') continue;
        return photo.url.replace(/\/square\.|\/small\.|\/medium\.|\/original\./, '/large.');
      }
    }
  }
  return null;
}

async function main() {
  console.log('Fetching all species...');

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

  // Find species with taxon ID and no Airtable hero image
  const needsHero = allRecords.filter(r => {
    const f = r.fields;
    return f['iNaturalist Taxon ID'] && !f['Hero Image'];
  });

  console.log(`${needsHero.length} species need hero URLs from iNaturalist`);

  // Process each
  const updates = [];
  let found = 0;
  let notFound = 0;

  for (const record of needsHero) {
    const taxonId = record.fields['iNaturalist Taxon ID'];
    const name = record.fields['Species Name'];
    const currentUrl = record.fields['iNaturalist Hero URL'];

    process.stdout.write(`Fetching CC0 photo for ${name}...`);
    const photoUrl = await getINatPhoto(taxonId);

    if (photoUrl) {
      updates.push({ id: record.id, fields: { 'iNaturalist Hero URL': photoUrl } });
      console.log(' ✓');
      found++;
    } else {
      // Clear existing URL if no CC0 available
      if (currentUrl) {
        updates.push({ id: record.id, fields: { 'iNaturalist Hero URL': null } });
      }
      console.log(' ✗ no CC0 photo');
      notFound++;
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nFound CC0 photos: ${found}`);
  console.log(`No CC0 photos: ${notFound}`);

  if (updates.length === 0) {
    console.log('\nNothing to update');
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
      console.log(`  Updated batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(updates.length / BATCH_SIZE)}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone!`);
}

main().catch(console.error);
