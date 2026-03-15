require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';

async function airtableCreate(table, fields) {
  const res = await fetch(`${AIRTABLE_API}/${BASE_ID}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PAT}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }
  return res.json();
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseJournalFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Line 1: # Title
  const title = lines[0].replace(/^#\s*/, '').trim();

  // Line 3: *Category / Month Year*
  const metaLine = lines[2].replace(/^\*|\*$/g, '').trim();
  const [category, dateStr] = metaLine.split(' / ').map(s => s.trim());

  // Body starts after the --- separator (line 5 onwards)
  const bodyStart = lines.findIndex((line, idx) => idx > 2 && line.trim() === '---');
  const body = lines.slice(bodyStart + 1).join('\n').trim();

  // Extract first paragraph as excerpt
  const firstPara = body.split('\n\n')[0].replace(/\n/g, ' ').trim();
  const excerpt = firstPara.length > 200 ? firstPara.slice(0, 200) + '...' : firstPara;

  return {
    title,
    slug: slugify(title),
    category,
    publishDate: dateStr, // e.g., "March 2026"
    excerpt,
    body,
    seoTitle: title,
    seoDescription: excerpt,
  };
}

async function uploadJournals() {
  const journalDir = path.join(__dirname, '..', 'The Journal Batch 1');
  const files = fs.readdirSync(journalDir).filter(f => f.endsWith('.md'));

  console.log(`Found ${files.length} journal entries to upload\n`);

  for (const file of files) {
    const filePath = path.join(journalDir, file);
    const entry = parseJournalFile(filePath);

    console.log(`Uploading: ${entry.title}`);
    console.log(`  Category: ${entry.category}`);
    console.log(`  Date: ${entry.publishDate}`);

    try {
      const result = await airtableCreate('Journal', {
        'Title': entry.title,
        'Slug': entry.slug,
        'Category': entry.category,
        'Short Description': entry.excerpt,
        'Content': entry.body,
        'Status': 'Live',
        'SEO Title': entry.seoTitle,
        'SEO Description': entry.seoDescription,
      });
      console.log(`  ✓ Created: ${result.id}\n`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}\n`);
    }
  }

  console.log('Done!');
}

uploadJournals();
