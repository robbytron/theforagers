/**
 * Set all Species to Live status
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PAT = process.env.AIRTABLE_PAT;
const API = 'https://api.airtable.com/v0';

async function main() {
  // Fetch all species with pagination
  const allRecords: any[] = [];
  let offset: string | undefined;

  console.log('Fetching all species...');
  do {
    const url = `${API}/${BASE_ID}/Species` + (offset ? `?offset=${offset}` : '');
    const res = await fetch(url, { headers: { Authorization: `Bearer ${PAT}` } });
    const data = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  const draftRecords = allRecords.filter((r: any) => r.fields.Status !== 'Live');
  console.log(`Total species: ${allRecords.length}`);
  console.log(`Already Live: ${allRecords.length - draftRecords.length}`);
  console.log(`To update: ${draftRecords.length}`);

  if (draftRecords.length === 0) {
    console.log('Nothing to update!');
    return;
  }

  // Update in batches of 10
  const batches = [];
  for (let i = 0; i < draftRecords.length; i += 10) {
    batches.push(draftRecords.slice(i, i + 10));
  }

  console.log(`\nUpdating in ${batches.length} batches...`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const records = batch.map((r: any) => ({
      id: r.id,
      fields: { Status: 'Live' },
    }));

    const res = await fetch(`${API}/${BASE_ID}/Species`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records }),
    });

    if (!res.ok) {
      throw new Error(`Batch ${i + 1} failed: ${await res.text()}`);
    }

    console.log(`Batch ${i + 1}/${batches.length} done`);
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`\n✅ All ${draftRecords.length} species set to Live!`);
}

main().catch(console.error);
