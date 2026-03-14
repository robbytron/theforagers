/**
 * Add FAQs field to Species table
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_META_API = 'https://api.airtable.com/v0/meta/bases';

async function getSpeciesTableId(): Promise<string> {
  const res = await fetch(`${AIRTABLE_META_API}/${AIRTABLE_BASE_ID}/tables`, {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  });
  const data = await res.json();
  const table = data.tables.find((t: any) => t.name === 'Species');
  if (!table) throw new Error('Species table not found');
  return table.id;
}

async function main() {
  const tableId = await getSpeciesTableId();
  console.log(`Adding FAQs field to Species table (${tableId})...`);

  const res = await fetch(`${AIRTABLE_META_API}/${AIRTABLE_BASE_ID}/tables/${tableId}/fields`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'FAQs',
      type: 'multilineText',
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    if (error.includes('DUPLICATE_FIELD_NAME')) {
      console.log('✅ FAQs field already exists');
      return;
    }
    throw new Error(`Failed: ${res.status} ${error}`);
  }

  console.log('✅ FAQs field added successfully');
}

main().catch(console.error);
