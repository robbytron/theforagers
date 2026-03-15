const fs = require('fs');
const path = require('path');

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

async function main() {
  console.log('Creating Homepage Features table...');

  // Create table using Airtable Meta API
  const createRes = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAT}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Homepage Features',
      fields: [
        {
          name: 'Title',
          type: 'singleLineText',
          description: 'Display title for the feature'
        },
        {
          name: 'Content Type',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Species', color: 'greenLight2' },
              { name: 'Recipe', color: 'orangeLight2' },
              { name: 'Journal', color: 'blueLight2' },
              { name: 'Danger', color: 'redLight2' },
              { name: 'Custom', color: 'grayLight2' }
            ]
          }
        },
        {
          name: 'Slug',
          type: 'singleLineText',
          description: 'URL slug for the linked content'
        },
        {
          name: 'Section',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Hero', color: 'purpleLight2' },
              { name: 'Latest', color: 'cyanLight2' },
              { name: 'Featured', color: 'yellowLight2' }
            ]
          }
        },
        {
          name: 'Order',
          type: 'number',
          options: {
            precision: 0
          },
          description: 'Display priority (lower = first)'
        },
        {
          name: 'Active',
          type: 'checkbox',
          options: {
            icon: 'check',
            color: 'greenBright'
          },
          description: 'Show/hide toggle'
        },
        {
          name: 'Image',
          type: 'multipleAttachments',
          description: 'Override image (optional)'
        },
        {
          name: 'Description',
          type: 'multilineText',
          description: 'Override description (optional)'
        },
        {
          name: 'Custom URL',
          type: 'url',
          description: 'For external links'
        },
        {
          name: 'Badge',
          type: 'singleLineText',
          description: 'Optional badge like "New" or "Seasonal"'
        }
      ]
    })
  });

  if (!createRes.ok) {
    const error = await createRes.text();
    console.error('Failed to create table:', error);
    return;
  }

  console.log('Table created successfully!');

  // Now add sample data
  console.log('\nAdding sample featured content...');

  const AIRTABLE_API = 'https://api.airtable.com/v0';

  const sampleRecords = [
    {
      fields: {
        'Title': 'Wild Garlic Season',
        'Content Type': 'Species',
        'Slug': 'wild-garlic',
        'Section': 'Hero',
        'Order': 1,
        'Active': true,
        'Badge': 'In Season'
      }
    },
    {
      fields: {
        'Title': 'Morel Mushrooms',
        'Content Type': 'Species',
        'Slug': 'morel',
        'Section': 'Featured',
        'Order': 1,
        'Active': true,
        'Badge': 'Expert'
      }
    },
    {
      fields: {
        'Title': 'Chanterelle',
        'Content Type': 'Species',
        'Slug': 'chanterelle',
        'Section': 'Featured',
        'Order': 2,
        'Active': true
      }
    },
    {
      fields: {
        'Title': 'Wood Sorrel',
        'Content Type': 'Species',
        'Slug': 'wood-sorrel',
        'Section': 'Featured',
        'Order': 3,
        'Active': true,
        'Badge': 'Beginner'
      }
    },
    {
      fields: {
        'Title': 'Alexanders',
        'Content Type': 'Species',
        'Slug': 'alexanders',
        'Section': 'Latest',
        'Order': 1,
        'Active': true,
        'Badge': 'New'
      }
    },
    {
      fields: {
        'Title': 'Common Nettle',
        'Content Type': 'Species',
        'Slug': 'common-nettle',
        'Section': 'Latest',
        'Order': 2,
        'Active': true
      }
    },
    {
      fields: {
        'Title': 'Hawthorn',
        'Content Type': 'Species',
        'Slug': 'hawthorn',
        'Section': 'Latest',
        'Order': 3,
        'Active': true
      }
    },
    {
      fields: {
        'Title': 'Elderflower',
        'Content Type': 'Species',
        'Slug': 'elderflower',
        'Section': 'Latest',
        'Order': 4,
        'Active': true
      }
    }
  ];

  const addRes = await fetch(`${AIRTABLE_API}/${BASE_ID}/Homepage%20Features`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAT}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ records: sampleRecords })
  });

  if (addRes.ok) {
    console.log(`Added ${sampleRecords.length} sample records`);
    console.log('\nDone! Your Homepage Features table is ready.');
    console.log('Go to Airtable to customize your featured content.');
  } else {
    console.error('Error adding records:', await addRes.text());
  }
}

main().catch(console.error);
