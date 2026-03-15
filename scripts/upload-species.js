/**
 * Upload species from markdown file to Airtable
 * Run with: node scripts/upload-species.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local manually
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

if (!BASE_ID || !PAT) {
  console.error('Missing AIRTABLE_BASE_ID or AIRTABLE_PAT in .env.local');
  process.exit(1);
}

// Parse the markdown file
function parseMarkdown(content) {
  const species = [];

  // Split by species entries (## followed by number and name)
  const entries = content.split(/\n## \d+\. /);

  for (const entry of entries) {
    if (!entry.includes('**Species Name:**')) continue;

    const spec = {};

    // Extract fields using regex
    const fieldPatterns = {
      name: /\*\*Species Name:\*\* (.+)/,
      latinName: /\*\*Latin Name:\*\* (.+)/,
      type: /\*\*Type:\*\* (.+)/,
      difficulty: /\*\*Difficulty:\*\* (.+)/,
      slug: /\*\*Slug:\*\* (.+)/,
      seasons: /\*\*Seasons:\*\* (.+)/,
    };

    for (const [key, pattern] of Object.entries(fieldPatterns)) {
      const match = entry.match(pattern);
      if (match) spec[key] = match[1].trim();
    }

    // Extract multi-line sections
    const sectionPatterns = {
      shortDescription: /\*\*Short Description:\*\*\n([\s\S]*?)(?=\n---|\n\*\*)/,
      fullDescription: /\*\*Full Description:\*\*\n([\s\S]*?)(?=\n---)/,
      identificationNotes: /\*\*Identification Notes:\*\*\n([\s\S]*?)(?=\n---)/,
      lookalikesAndDangers: /\*\*Lookalikes & Dangers:\*\*\n([\s\S]*?)(?=\n---)/,
      habitat: /\*\*Habitat:\*\*\n([\s\S]*?)(?=\n---)/,
      inSeason: /\*\*In Season:\*\*\n([\s\S]*?)(?=\n---)/,
      culinaryUses: /\*\*Culinary Uses:\*\*\n([\s\S]*?)(?=\n---)/,
      legalNotes: /\*\*Legal Notes:\*\*\n([\s\S]*?)(?=\n---)/,
      seoTitle: /\*\*SEO Title:\*\* (.+)/,
      seoDescription: /\*\*SEO Description:\*\* (.+)/,
    };

    for (const [key, pattern] of Object.entries(sectionPatterns)) {
      const match = entry.match(pattern);
      if (match) spec[key] = match[1].trim();
    }

    // Only add if we have required fields
    if (spec.name && spec.latinName && spec.slug) {
      species.push(spec);
    }
  }

  return species;
}

// Normalize Type values to match Airtable options
function normalizeType(type) {
  if (!type) return 'Greens';

  const typeMap = {
    'Coastal & Seaweed': 'Coastal',
    'Coastal & Shellfish': 'Coastal',
    'Fish & Shellfish': 'Coastal',
    'Seaweed': 'Coastal',
    'Shellfish': 'Coastal',
  };

  return typeMap[type] || type;
}

// Normalize month abbreviations to full names
function normalizeSeasons(seasonsStr) {
  if (!seasonsStr) return [];

  const monthMap = {
    'Jan': 'January', 'Feb': 'February', 'Mar': 'March',
    'Apr': 'April', 'May': 'May', 'Jun': 'June',
    'Jul': 'July', 'Aug': 'August', 'Sep': 'September',
    'Oct': 'October', 'Nov': 'November', 'Dec': 'December',
  };

  return seasonsStr.split(',').map(s => {
    const trimmed = s.trim();
    return monthMap[trimmed] || trimmed;
  });
}

// Convert parsed species to Airtable record format
function toAirtableRecord(spec) {
  const seasons = normalizeSeasons(spec.seasons);

  return {
    fields: {
      'Species Name': spec.name,
      'Latin Name': spec.latinName,
      'Slug': spec.slug,
      'Type': normalizeType(spec.type),
      'Difficulty': spec.difficulty || 'Intermediate',
      'Seasons': seasons,
      'Short Description': spec.shortDescription || '',
      'Full Description': spec.fullDescription || '',
      'Identification Notes': spec.identificationNotes || '',
      'Lookalikes & Dangers': spec.lookalikesAndDangers || '',
      'Habitat': spec.habitat || '',
      'Culinary Uses': spec.culinaryUses || '',
      'Legal Notes': spec.legalNotes || '',
      'SEO Title': spec.seoTitle || `${spec.name} — Foraging Guide UK | The Foragers`,
      'SEO Description': spec.seoDescription || spec.shortDescription?.substring(0, 160) || '',
      'Status': 'Live', // Set to Live directly
    }
  };
}

// Fetch all existing species from Airtable (with record IDs for updates)
async function getExistingSpecies() {
  const species = new Map(); // slug -> { id, fields }
  let offset;

  do {
    let url = `${AIRTABLE_API}/${BASE_ID}/Species?pageSize=100`;
    if (offset) url += `&offset=${offset}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${PAT}` },
    });

    if (!response.ok) {
      throw new Error(`Airtable error ${response.status}`);
    }

    const data = await response.json();
    for (const record of data.records) {
      if (record.fields.Slug) {
        species.set(record.fields.Slug, { id: record.id, fields: record.fields });
      }
    }
    offset = data.offset;
  } while (offset);

  return species;
}

// For backwards compat
async function getExistingSlugs() {
  const species = await getExistingSpecies();
  return new Set(species.keys());
}

// Upload records in batches of 10 (Airtable limit)
async function uploadBatch(records) {
  const url = `${AIRTABLE_API}/${BASE_ID}/Species`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable error ${response.status}: ${error}`);
  }

  return response.json();
}

// Update records in batches of 10 (Airtable limit)
async function updateBatch(records) {
  const url = `${AIRTABLE_API}/${BASE_ID}/Species`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ records }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable error ${response.status}: ${error}`);
  }

  return response.json();
}

// Main upload function
async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const updateMode = process.argv.includes('--update');
  const mdPath = path.join(__dirname, '..', 'the-foragers-species-ALL-BATCHES-01-18.md');

  console.log('Reading markdown file...');
  const content = fs.readFileSync(mdPath, 'utf-8');

  console.log('Parsing species entries...');
  let species = parseMarkdown(content);
  console.log(`Found ${species.length} species entries`);

  // Deduplicate by slug (keep first occurrence)
  const seen = new Set();
  species = species.filter(s => {
    if (seen.has(s.slug)) {
      // Silently skip duplicates
      return false;
    }
    seen.add(s.slug);
    return true;
  });
  console.log(`After deduplication: ${species.length} unique species`);

  // Fetch existing species from Airtable
  console.log('Fetching existing species from Airtable...');
  const existingSpecies = await getExistingSpecies();
  console.log(`Found ${existingSpecies.size} existing species in Airtable`);

  if (updateMode) {
    // UPDATE MODE: Update existing records with new content
    const toUpdate = species.filter(s => existingSpecies.has(s.slug));
    console.log(`Species to update: ${toUpdate.length}`);

    if (dryRun) {
      console.log('\n--- DRY RUN (UPDATE MODE) ---');
      console.log(`Would update ${toUpdate.length} existing species with new content`);
      console.log('First 10:', toUpdate.slice(0, 10).map(s => s.name).join(', '));
      return;
    }

    // Convert to Airtable update format (includes record ID)
    const records = toUpdate.map(spec => {
      const existing = existingSpecies.get(spec.slug);
      const airtableRecord = toAirtableRecord(spec);
      return {
        id: existing.id,
        fields: airtableRecord.fields,
      };
    });

    // Update in batches of 10
    const BATCH_SIZE = 10;
    let updated = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      console.log(`Updating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)} (${batch.length} records)...`);

      try {
        await updateBatch(batch);
        updated += batch.length;
        console.log(`  Success! Total updated: ${updated}/${records.length}`);
      } catch (err) {
        console.error(`  Error updating batch:`, err.message);
        console.error('  Failed records:', batch.map(r => r.fields['Species Name']).join(', '));
      }

      // Rate limiting - wait 200ms between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\nDone! Updated ${updated} species in Airtable.`);

  } else {
    // CREATE MODE: Only add new species
    const newSpecies = species.filter(s => !existingSpecies.has(s.slug));
    console.log(`New species to upload: ${newSpecies.length}`);

    if (dryRun) {
      console.log('\n--- DRY RUN (CREATE MODE) ---');
      if (newSpecies.length === 0) {
        console.log('No new species to upload - all already exist in Airtable');
        console.log('Use --update flag to update existing records with new content');
      } else {
        console.log('New species to be added:');
        for (const s of newSpecies) {
          console.log(`  - ${s.name} (${s.latinName}) [${s.slug}]`);
        }
      }
      return;
    }

    if (newSpecies.length === 0) {
      console.log('No new species to upload!');
      console.log('Use --update flag to update existing records with new content');
      return;
    }

    // Convert to Airtable format
    const records = newSpecies.map(toAirtableRecord);

    // Upload in batches of 10
    const BATCH_SIZE = 10;
    let uploaded = 0;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      console.log(`Uploading batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)} (${batch.length} records)...`);

      try {
        await uploadBatch(batch);
        uploaded += batch.length;
        console.log(`  Success! Total uploaded: ${uploaded}/${records.length}`);
      } catch (err) {
        console.error(`  Error uploading batch:`, err.message);
        console.error('  Failed records:', batch.map(r => r.fields['Species Name']).join(', '));
      }

      // Rate limiting - wait 200ms between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\nDone! Uploaded ${uploaded} species to Airtable.`);
  }
}

main().catch(console.error);
