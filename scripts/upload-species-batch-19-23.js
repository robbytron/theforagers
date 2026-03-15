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

// Normalize type to valid Airtable values
function normalizeType(type) {
  const typeMap = {
    'Herbs': 'Greens',
    'Coastal & Seaweed': 'Coastal',
    'Fish & Shellfish': 'Coastal',
    'Seaweed': 'Coastal',
    'Seeds': 'Greens',
    'Drinks': 'Greens',
    'Trees': 'Greens',
  };
  return typeMap[type] || type;
}

// Normalize difficulty to valid Airtable values
function normalizeDifficulty(difficulty) {
  const diffMap = {
    'Expert': 'Expert Only',
  };
  return diffMap[difficulty] || difficulty;
}

// Parse seasons string like "Jun, Jul, Aug" to full month names array
function parseSeasons(seasonsStr) {
  if (!seasonsStr) return [];
  const monthMap = {
    'Jan': 'January', 'Feb': 'February', 'Mar': 'March',
    'Apr': 'April', 'May': 'May', 'Jun': 'June',
    'Jul': 'July', 'Aug': 'August', 'Sep': 'September',
    'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
  };
  const months = seasonsStr.split(',').map(m => m.trim());
  return months.map(m => monthMap[m]).filter(Boolean);
}

// Parse markdown to extract species data
function parseMarkdown(content) {
  const species = [];

  // Split by species headers (## 181. Agrimony pattern)
  const speciesBlocks = content.split(/\n## \d+\.\s+/);

  for (let i = 1; i < speciesBlocks.length; i++) {
    const block = speciesBlocks[i];
    const lines = block.split('\n');

    // First line is species name
    const name = lines[0].trim();

    // Extract fields
    const fields = {};
    let currentField = null;
    let currentContent = [];

    for (const line of lines.slice(1)) {
      // Check for field markers
      if (line.startsWith('**Species Name:**')) {
        fields.speciesName = line.replace('**Species Name:**', '').trim();
      } else if (line.startsWith('**Latin Name:**')) {
        fields.latinName = line.replace('**Latin Name:**', '').trim();
      } else if (line.startsWith('**Type:**')) {
        fields.type = line.replace('**Type:**', '').trim();
      } else if (line.startsWith('**Difficulty:**')) {
        fields.difficulty = line.replace('**Difficulty:**', '').trim();
      } else if (line.startsWith('**Slug:**')) {
        fields.slug = line.replace('**Slug:**', '').trim();
      } else if (line.startsWith('**Seasons:**')) {
        fields.seasons = line.replace('**Seasons:**', '').trim();
      } else if (line.startsWith('**SEO Title:**')) {
        fields.seoTitle = line.replace('**SEO Title:**', '').trim();
      } else if (line.startsWith('**SEO Description:**')) {
        fields.seoDescription = line.replace('**SEO Description:**', '').trim();
      } else if (line.startsWith('**Short Description:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'shortDescription';
        currentContent = [];
      } else if (line.startsWith('**Full Description:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'fullDescription';
        currentContent = [];
      } else if (line.startsWith('**Identification Notes:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'identificationNotes';
        currentContent = [];
      } else if (line.startsWith('**Lookalikes & Dangers:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'lookalikesAndDangers';
        currentContent = [];
      } else if (line.startsWith('**Habitat:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'habitat';
        currentContent = [];
      } else if (line.startsWith('**In Season:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'inSeason';
        currentContent = [];
      } else if (line.startsWith('**Culinary Uses:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'culinaryUses';
        currentContent = [];
      } else if (line.startsWith('**Legal Notes:**')) {
        if (currentField) fields[currentField] = currentContent.join('\n').trim();
        currentField = 'legalNotes';
        currentContent = [];
      } else if (line === '---') {
        if (currentField) {
          fields[currentField] = currentContent.join('\n').trim();
          currentField = null;
          currentContent = [];
        }
      } else if (currentField) {
        currentContent.push(line);
      }
    }

    // Save last field
    if (currentField) {
      fields[currentField] = currentContent.join('\n').trim();
    }

    if (fields.speciesName) {
      species.push(fields);
    }
  }

  return species;
}

// Convert to Airtable format
function toAirtableFields(species) {
  return {
    'Species Name': species.speciesName,
    'Latin Name': species.latinName || '',
    'Type': normalizeType(species.type),
    'Difficulty': normalizeDifficulty(species.difficulty),
    'Slug': species.slug,
    'Seasons': parseSeasons(species.seasons),
    'Short Description': species.shortDescription || '',
    'Full Description': species.fullDescription || '',
    'Identification Notes': species.identificationNotes || '',
    'Lookalikes & Dangers': species.lookalikesAndDangers || '',
    'Habitat': species.habitat || '',
    'Culinary Uses': species.culinaryUses || '',
    'Legal Notes': species.legalNotes || '',
    'SEO Title': species.seoTitle || '',
    'SEO Description': species.seoDescription || '',
    'Status': 'Live',
  };
}

async function main() {
  // Read markdown file
  const mdPath = path.join(__dirname, '..', 'the-foragers-species-batches-19-23.md');
  const content = fs.readFileSync(mdPath, 'utf-8');

  console.log('Parsing markdown...');
  const speciesList = parseMarkdown(content);
  console.log(`Found ${speciesList.length} species in file`);

  // Deduplicate by slug
  const uniqueSpecies = new Map();
  for (const s of speciesList) {
    if (s.slug && !uniqueSpecies.has(s.slug)) {
      uniqueSpecies.set(s.slug, s);
    }
  }
  console.log(`${uniqueSpecies.size} unique species after deduplication`);

  // Fetch existing species from Airtable
  console.log('\nFetching existing species from Airtable...');
  let existingRecords = [];
  let offset;
  do {
    const url = new URL(`${AIRTABLE_API}/${BASE_ID}/Species`);
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${PAT}` }
    });
    const data = await res.json();
    existingRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  // Create slug -> record map
  const existingBySlug = new Map();
  for (const r of existingRecords) {
    if (r.fields['Slug']) {
      existingBySlug.set(r.fields['Slug'], r);
    }
  }
  console.log(`Found ${existingRecords.length} existing species`);

  // Separate into updates and creates
  const updates = [];
  const creates = [];

  for (const [slug, species] of uniqueSpecies) {
    const airtableFields = toAirtableFields(species);
    const existing = existingBySlug.get(slug);

    if (existing) {
      updates.push({ id: existing.id, fields: airtableFields });
    } else {
      creates.push({ fields: airtableFields });
    }
  }

  console.log(`\nTo update: ${updates.length}`);
  console.log(`To create: ${creates.length}`);

  // Process updates in batches of 10
  if (updates.length > 0) {
    console.log('\nUpdating existing species...');
    for (let i = 0; i < updates.length; i += 10) {
      const batch = updates.slice(i, i + 10);
      const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/Species`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${PAT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: batch })
      });

      if (!res.ok) {
        const error = await res.text();
        console.error(`Error updating batch: ${error}`);
      } else {
        console.log(`  Updated batch ${Math.floor(i / 10) + 1}/${Math.ceil(updates.length / 10)}`);
      }

      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Process creates in batches of 10
  if (creates.length > 0) {
    console.log('\nCreating new species...');
    for (let i = 0; i < creates.length; i += 10) {
      const batch = creates.slice(i, i + 10);
      const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/Species`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: batch })
      });

      if (!res.ok) {
        const error = await res.text();
        console.error(`Error creating batch: ${error}`);
      } else {
        console.log(`  Created batch ${Math.floor(i / 10) + 1}/${Math.ceil(creates.length / 10)}`);
      }

      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
