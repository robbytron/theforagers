import { config } from 'dotenv';
config({ path: '.env.local' });

const AIRTABLE_TOKEN = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_TOKEN || !BASE_ID) {
  console.error('Missing AIRTABLE_PAT or AIRTABLE_BASE_ID');
  process.exit(1);
}

// First, get all tables and their field IDs
async function getTables() {
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` },
  });
  const data = await response.json();
  return data.tables;
}

// Update a field to multipleSelects
async function updateFieldToMultiSelect(tableId: string, fieldId: string, fieldName: string, choices: string[]) {
  console.log(`  Updating ${fieldName} to multipleSelects...`);

  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${tableId}/fields/${fieldId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'multipleSelects',
      options: {
        choices: choices.map(name => ({ name })),
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(`    Failed: ${error.error?.message || JSON.stringify(error)}`);
    return false;
  }

  console.log(`    Done.`);
  return true;
}

// Fields that need to be changed based on the doc:
// 1. Guides.Category -> multipleSelects (a guide could cover multiple topics)
// 2. Kit & Field Guides.Subcategory -> multipleSelects (a book could cover plants AND fungi)
// 3. Preservation Guides - add Species as multipleSelects (linked to species)

const FIELD_UPDATES: Record<string, { field: string; choices: string[] }[]> = {
  'Guides': [
    { field: 'Category', choices: ['Identification', 'Safety', 'Legal', 'Technique', 'Habitat'] },
  ],
  'Kit & Field Guides': [
    { field: 'Subcategory', choices: ['Plants', 'Fungi', 'Seaweed', 'Coastal', 'Bags', 'Knives', 'Containers', 'Other'] },
  ],
};

async function main() {
  console.log('Fetching tables...\n');
  const tables = await getTables();

  for (const table of tables) {
    const updates = FIELD_UPDATES[table.name];
    if (!updates) continue;

    console.log(`\nTable: ${table.name}`);

    for (const update of updates) {
      const field = table.fields.find((f: any) => f.name === update.field);
      if (!field) {
        console.log(`  Field "${update.field}" not found, skipping.`);
        continue;
      }

      if (field.type === 'multipleSelects') {
        console.log(`  "${update.field}" is already multipleSelects.`);
        continue;
      }

      await updateFieldToMultiSelect(table.id, field.id, update.field, update.choices);
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  console.log('\n--- Done ---');
}

main().catch(console.error);
