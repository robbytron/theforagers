import { config } from 'dotenv';
config({ path: '.env.local' });

const AIRTABLE_TOKEN = process.env.AIRTABLE_PAT;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_TOKEN || !BASE_ID) {
  console.error('Missing AIRTABLE_PAT or AIRTABLE_BASE_ID');
  process.exit(1);
}

interface FieldConfig {
  name: string;
  type: string;
  options?: Record<string, unknown>;
}

interface TableConfig {
  name: string;
  description: string;
  fields: FieldConfig[];
}

const TABLES: TableConfig[] = [
  // 1. Danger Species - for /dangers section
  {
    name: 'Danger Species',
    description: 'Dangerous and toxic species for the /dangers section',
    fields: [
      { name: 'Name', type: 'singleLineText' },
      { name: 'Latin Name', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Danger Level', type: 'singleSelect', options: { choices: [
        { name: 'Deadly' }, { name: 'Highly Toxic' }, { name: 'Toxic' }, { name: 'Harmful' },
      ]}},
      { name: 'Category', type: 'singleSelect', options: { choices: [
        { name: 'Poisonous Plant' }, { name: 'Toxic Fungus' }, { name: 'Dangerous Berry' },
      ]}},
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Identification', type: 'richText' },
      { name: 'Danger Description', type: 'richText' },
      { name: 'Symptoms', type: 'richText' },
      { name: 'What To Do', type: 'richText' },
      { name: 'Commonly Confused With', type: 'richText' },
      { name: 'Habitat', type: 'singleLineText' },
      { name: 'Season', type: 'multipleSelects', options: { choices: [
        { name: 'January' }, { name: 'February' }, { name: 'March' },
        { name: 'April' }, { name: 'May' }, { name: 'June' },
        { name: 'July' }, { name: 'August' }, { name: 'September' },
        { name: 'October' }, { name: 'November' }, { name: 'December' },
        { name: 'Year-round' },
      ]}},
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'iNaturalist Taxon ID', type: 'number', options: { precision: 0 } },
      { name: 'iNaturalist Hero URL', type: 'url' },
      { name: 'Expert Reviewed', type: 'checkbox', options: { icon: 'check', color: 'greenBright' } },
      { name: 'Reviewer Notes', type: 'richText' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 2. Guides - for /guides section
  {
    name: 'Guides',
    description: 'Evergreen how-to guides for the /guides section',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Category', type: 'singleSelect', options: { choices: [
        { name: 'Identification' }, { name: 'Safety' }, { name: 'Legal' },
        { name: 'Technique' }, { name: 'Habitat' },
      ]}},
      { name: 'Target Keyword', type: 'singleLineText' },
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 3. Preservation Guides - for /prepare-and-preserve section
  {
    name: 'Preservation Guides',
    description: 'Preparation and preservation technique guides',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Method Type', type: 'singleSelect', options: { choices: [
        { name: 'Drying' }, { name: 'Freezing' }, { name: 'Fermenting' },
        { name: 'Salting' }, { name: 'Infusing' }, { name: 'Bottling' },
        { name: 'Pickling' }, { name: 'Juicing' },
      ]}},
      { name: 'Target Keyword', type: 'singleLineText' },
      { name: 'Season', type: 'multipleSelects', options: { choices: [
        { name: 'Spring' }, { name: 'Summer' }, { name: 'Autumn' }, { name: 'Winter' }, { name: 'Year-round' },
      ]}},
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 4. Journal - for /journal section
  {
    name: 'Journal',
    description: 'Editorial content for the /journal section',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Category', type: 'singleSelect', options: { choices: [
        { name: 'In Season' }, { name: 'The Field' }, { name: 'The Land' }, { name: 'Wild Table' },
      ]}},
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'Published Date', type: 'date', options: { dateFormat: { name: 'iso' } } },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 5. Kit & Field Guides - for /field-guides-and-kit section
  {
    name: 'Kit & Field Guides',
    description: 'Affiliate product recommendations',
    fields: [
      { name: 'Name', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Category', type: 'singleSelect', options: { choices: [
        { name: 'Field Guide' }, { name: 'Equipment' }, { name: 'Cookbook' },
      ]}},
      { name: 'Subcategory', type: 'singleSelect', options: { choices: [
        { name: 'Plants' }, { name: 'Fungi' }, { name: 'Seaweed' }, { name: 'Coastal' },
        { name: 'Bags' }, { name: 'Knives' }, { name: 'Containers' }, { name: 'Other' },
      ]}},
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Full Description', type: 'richText' },
      { name: 'Why We Recommend', type: 'richText' },
      { name: 'Price Guide', type: 'singleLineText' },
      { name: 'Affiliate Link', type: 'url' },
      { name: 'Image', type: 'multipleAttachments' },
      { name: 'Featured', type: 'checkbox', options: { icon: 'star', color: 'yellowBright' } },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'Live' },
      ]}},
    ],
  },

  // 6. Legal Pages - for /legal section
  {
    name: 'Legal Pages',
    description: 'Legal information pages',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Sort Order', type: 'number', options: { precision: 0 } },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 7. Safety Pages - for /safety section
  {
    name: 'Safety Pages',
    description: 'Safety information pages',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'Expert Reviewed', type: 'checkbox', options: { icon: 'check', color: 'greenBright' } },
      { name: 'Reviewer Notes', type: 'richText' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Sort Order', type: 'number', options: { precision: 0 } },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 8. Coastal Pages - for /coastal section
  {
    name: 'Coastal Pages',
    description: 'Coastal foraging hub pages',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Sort Order', type: 'number', options: { precision: 0 } },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 9. Where to Forage - for /where-to-forage section
  {
    name: 'Where to Forage',
    description: 'Habitat and location guides',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Type', type: 'singleSelect', options: { choices: [
        { name: 'Habitat' }, { name: 'Region' },
      ]}},
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'What Grows Here', type: 'richText' },
      { name: 'Best Seasons', type: 'multipleSelects', options: { choices: [
        { name: 'Spring' }, { name: 'Summer' }, { name: 'Autumn' }, { name: 'Winter' },
      ]}},
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'In Review' }, { name: 'Live' },
      ]}},
    ],
  },

  // 10. About Pages - for /about section
  {
    name: 'About Pages',
    description: 'About section pages',
    fields: [
      { name: 'Title', type: 'singleLineText' },
      { name: 'Slug', type: 'singleLineText' },
      { name: 'Short Description', type: 'singleLineText' },
      { name: 'Content', type: 'richText' },
      { name: 'Hero Image', type: 'multipleAttachments' },
      { name: 'SEO Title', type: 'singleLineText' },
      { name: 'SEO Description', type: 'singleLineText' },
      { name: 'Sort Order', type: 'number', options: { precision: 0 } },
      { name: 'Status', type: 'singleSelect', options: { choices: [
        { name: 'Draft' }, { name: 'Live' },
      ]}},
    ],
  },
];

async function createTable(table: TableConfig): Promise<boolean> {
  console.log(`Creating table: ${table.name}...`);

  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: table.name,
      description: table.description,
      fields: table.fields,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.error?.message?.includes('already exists')) {
      console.log(`  "${table.name}" already exists, skipping.`);
      return true;
    }
    console.error(`  Failed: ${error.error?.message || JSON.stringify(error)}`);
    return false;
  }

  console.log(`  Created with ${table.fields.length} fields.`);
  return true;
}

async function main() {
  console.log('Creating Airtable tables for The Foragers...\n');

  let created = 0;
  let failed = 0;

  for (const table of TABLES) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const success = await createTable(table);
    if (success) created++;
    else failed++;
  }

  console.log('\n--- Summary ---');
  console.log(`Success: ${created}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
