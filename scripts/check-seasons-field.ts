/**
 * Check the Seasons field configuration in Airtable
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_META_API = 'https://api.airtable.com/v0/meta/bases';

async function main() {
  const res = await fetch(`${AIRTABLE_META_API}/${AIRTABLE_BASE_ID}/tables`, {
    headers: { Authorization: `Bearer ${AIRTABLE_PAT}` },
  });

  if (!res.ok) {
    console.error(`Failed to fetch: ${res.status} ${await res.text()}`);
    process.exit(1);
  }

  const data = await res.json();
  const speciesTable = data.tables.find((t: any) => t.name === 'Species');

  if (!speciesTable) {
    console.error('Species table not found');
    process.exit(1);
  }

  const seasonsField = speciesTable.fields.find((f: any) => f.name === 'Seasons');

  if (!seasonsField) {
    console.log('❌ Seasons field not found in Species table');
    console.log('\nAvailable fields:');
    speciesTable.fields.forEach((f: any) => console.log(`  - ${f.name} (${f.type})`));
    process.exit(1);
  }

  console.log('Seasons field configuration:');
  console.log(JSON.stringify(seasonsField, null, 2));

  if (seasonsField.type !== 'multipleSelects') {
    console.log(`\n⚠️  Seasons field is type "${seasonsField.type}" but should be "multipleSelects"`);
  } else {
    console.log('\n✅ Seasons field is correctly configured as multipleSelects');

    const choices = seasonsField.options?.choices || [];
    const expectedMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const choiceNames = choices.map((c: any) => c.name);
    const missing = expectedMonths.filter(m => !choiceNames.includes(m));

    if (missing.length > 0) {
      console.log(`\n⚠️  Missing months: ${missing.join(', ')}`);
    } else {
      console.log('✅ All 12 months are present as choices');
    }
  }
}

main().catch(console.error);
