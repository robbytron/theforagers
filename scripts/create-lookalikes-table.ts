/**
 * One-shot script to create the Lookalikes table in Airtable.
 * Uses the Airtable Metadata API to create the table with all fields.
 *
 * Prerequisites:
 * - Your Airtable PAT must have `schema.bases:write` scope
 * - Run: npx tsx scripts/create-lookalikes-table.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_META_API = 'https://api.airtable.com/v0/meta/bases';

interface TableSchema {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    options?: Record<string, any>;
  }>;
}

async function getSpeciesTableId(): Promise<string | null> {
  const res = await fetch(`${AIRTABLE_META_API}/${AIRTABLE_BASE_ID}/tables`, {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  });

  if (!res.ok) {
    console.error(`Failed to fetch tables: ${res.status} ${await res.text()}`);
    return null;
  }

  const data = await res.json();
  const speciesTable = data.tables.find((t: any) => t.name === 'Species');
  return speciesTable?.id ?? null;
}

async function createLookalikesTable(speciesTableId: string): Promise<void> {
  const tableSchema: TableSchema = {
    name: 'Lookalikes',
    fields: [
      {
        name: 'Name',
        type: 'singleLineText',
      },
      {
        name: 'Latin Name',
        type: 'singleLineText',
      },
      {
        name: 'iNaturalist Taxon ID',
        type: 'number',
        options: {
          precision: 0,
        },
      },
      {
        name: 'Danger Level',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Deadly', color: 'redBright' },
            { name: 'Toxic', color: 'orangeBright' },
            { name: 'Inedible', color: 'yellowBright' },
            { name: 'Caution', color: 'grayBright' },
          ],
        },
      },
      {
        name: 'How to Tell Apart',
        type: 'multilineText',
      },
      {
        name: 'Species',
        type: 'multipleRecordLinks',
        options: {
          linkedTableId: speciesTableId,
        },
      },
      {
        name: 'Hero Image Override',
        type: 'multipleAttachments',
      },
      {
        name: 'Expert Reviewed',
        type: 'checkbox',
        options: {
          icon: 'check',
          color: 'greenBright',
        },
      },
      {
        name: 'Reviewer Notes',
        type: 'multilineText',
      },
    ],
  };

  const res = await fetch(`${AIRTABLE_META_API}/${AIRTABLE_BASE_ID}/tables`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tableSchema),
  });

  if (!res.ok) {
    const errorText = await res.text();
    if (errorText.includes('DUPLICATE_TABLE_NAME')) {
      console.log('⚠️  Lookalikes table already exists.');
      return;
    }
    throw new Error(`Failed to create table: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  console.log(`✅ Created Lookalikes table with ID: ${data.id}`);
}

async function main() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_PAT) {
    console.error('Missing AIRTABLE_BASE_ID or AIRTABLE_PAT environment variables');
    process.exit(1);
  }

  console.log('Fetching Species table ID...');
  const speciesTableId = await getSpeciesTableId();

  if (!speciesTableId) {
    console.error('❌ Could not find Species table. Make sure it exists in your base.');
    process.exit(1);
  }

  console.log(`Found Species table: ${speciesTableId}`);
  console.log('Creating Lookalikes table...');

  await createLookalikesTable(speciesTableId);

  console.log('\n--- Done ---');
  console.log('You can now add lookalike records in Airtable and link them to species.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
