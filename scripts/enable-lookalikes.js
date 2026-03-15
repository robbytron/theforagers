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

async function main() {
  // Fetch all lookalikes
  console.log('Fetching all lookalikes...');
  const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/Lookalikes?pageSize=100`, {
    headers: { Authorization: `Bearer ${PAT}` }
  });
  const data = await res.json();

  console.log(`Found ${data.records.length} lookalikes`);

  // Update in batches of 10
  const BATCH_SIZE = 10;
  let updated = 0;

  for (let i = 0; i < data.records.length; i += BATCH_SIZE) {
    const batch = data.records.slice(i, i + BATCH_SIZE);
    const records = batch.map(r => ({
      id: r.id,
      fields: { 'Expert Reviewed': true }
    }));

    console.log(`Updating batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

    const updateRes = await fetch(`${AIRTABLE_API}/${BASE_ID}/Lookalikes`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records })
    });

    if (!updateRes.ok) {
      console.error('Error:', await updateRes.text());
    } else {
      updated += batch.length;
      console.log(`  Updated ${updated}/${data.records.length}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone! Enabled ${updated} lookalikes.`);
}

main().catch(console.error);
