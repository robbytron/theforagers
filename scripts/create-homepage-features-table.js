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
const AIRTABLE_API = 'https://api.airtable.com/v0';

async function main() {
  // Create some sample featured content records
  // First, we need to check if the table exists by trying to fetch from it

  console.log('Creating Homepage Features table...');
  console.log('Note: You need to create this table manually in Airtable with these fields:');
  console.log('');
  console.log('Table Name: Homepage Features');
  console.log('');
  console.log('Fields:');
  console.log('  1. Title (Single line text) - Display title');
  console.log('  2. Content Type (Single select) - Options: Species, Recipe, Journal, Danger, Custom');
  console.log('  3. Slug (Single line text) - URL slug for the linked content');
  console.log('  4. Section (Single select) - Options: Hero, Latest, Featured');
  console.log('  5. Order (Number) - Display priority (lower = first)');
  console.log('  6. Active (Checkbox) - Show/hide toggle');
  console.log('  7. Image (Attachment) - Override image');
  console.log('  8. Description (Long text) - Override description');
  console.log('  9. Custom URL (URL) - For external links');
  console.log('  10. Badge (Single line text) - Optional badge like "New" or "Seasonal"');
  console.log('');
  console.log('After creating the table, run this script again to add sample data.');

  // Try to access the table
  try {
    const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/Homepage%20Features?maxRecords=1`, {
      headers: { Authorization: `Bearer ${PAT}` }
    });

    if (res.ok) {
      console.log('\n✓ Table exists! Adding sample featured content...');

      // Add sample records
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
            'Title': 'Nettle',
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
        }
      ];

      // Create in batches of 10
      for (let i = 0; i < sampleRecords.length; i += 10) {
        const batch = sampleRecords.slice(i, i + 10);
        const createRes = await fetch(`${AIRTABLE_API}/${BASE_ID}/Homepage%20Features`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${PAT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ records: batch })
        });

        if (createRes.ok) {
          console.log(`  Created ${batch.length} records`);
        } else {
          console.error('Error:', await createRes.text());
        }
      }

      console.log('\n✓ Done! Sample featured content added.');
    } else {
      console.log('\n✗ Table not found. Please create it in Airtable first.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main().catch(console.error);
