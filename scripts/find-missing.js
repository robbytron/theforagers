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

// Parse markdown slugs
const mdPath = path.join(__dirname, '..', 'the-foragers-species-ALL-BATCHES-01-18.md');
const content = fs.readFileSync(mdPath, 'utf-8');
const slugMatches = content.match(/\*\*Slug:\*\* ([^\n]+)/g) || [];
const mdSlugs = new Set(slugMatches.map(m => m.replace('**Slug:** ', '').trim()));

console.log(`Slugs in markdown: ${mdSlugs.size}`);

// Fetch Airtable slugs
async function main() {
  const BASE_ID = envVars.AIRTABLE_BASE_ID;
  const PAT = envVars.AIRTABLE_PAT;

  const airtableSlugs = [];
  let offset;

  do {
    let url = `https://api.airtable.com/v0/${BASE_ID}/Species?fields%5B%5D=Slug&fields%5B%5D=Species%20Name&pageSize=100`;
    if (offset) url += `&offset=${offset}`;

    const res = await fetch(url, { headers: { Authorization: `Bearer ${PAT}` } });
    const data = await res.json();

    for (const r of data.records) {
      airtableSlugs.push({ slug: r.fields.Slug, name: r.fields['Species Name'] });
    }
    offset = data.offset;
  } while (offset);

  console.log(`Total in Airtable: ${airtableSlugs.length}`);

  // Find species in Airtable but not in markdown
  const missing = airtableSlugs.filter(s => !mdSlugs.has(s.slug));

  console.log(`\nSpecies in Airtable but NOT in markdown (${missing.length}):`);
  missing.sort((a, b) => a.name.localeCompare(b.name));
  missing.forEach(s => console.log(`  - ${s.name}`));
}

main();
