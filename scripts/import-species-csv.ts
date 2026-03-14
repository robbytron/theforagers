/**
 * Import species from CSV to Airtable
 * Usage: npx tsx scripts/import-species-csv.ts
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
config({ path: '.env.local' });

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';

const MONTH_MAP: Record<string, string> = {
  'jan': 'January', 'feb': 'February', 'mar': 'March', 'apr': 'April',
  'may': 'May', 'jun': 'June', 'jul': 'July', 'aug': 'August',
  'sep': 'September', 'oct': 'October', 'nov': 'November', 'dec': 'December'
};

function parseMonths(peakMonths: string): string[] {
  if (!peakMonths) return [];

  const months: string[] = [];
  // Handle formats like "Mar–May", "Apr–May / Sep–Oct", "Jan–Dec"
  const ranges = peakMonths.split(/\s*\/\s*/);

  for (const range of ranges) {
    const match = range.match(/([A-Za-z]+)[–-]([A-Za-z]+)/);
    if (match) {
      const startMonth = match[1].toLowerCase().slice(0, 3);
      const endMonth = match[2].toLowerCase().slice(0, 3);

      const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const startIdx = monthOrder.indexOf(startMonth);
      const endIdx = monthOrder.indexOf(endMonth);

      if (startIdx !== -1 && endIdx !== -1) {
        if (startIdx <= endIdx) {
          for (let i = startIdx; i <= endIdx; i++) {
            const monthName = MONTH_MAP[monthOrder[i]];
            if (monthName && !months.includes(monthName)) months.push(monthName);
          }
        } else {
          // Wraps around year (e.g., Oct-Mar)
          for (let i = startIdx; i < 12; i++) {
            const monthName = MONTH_MAP[monthOrder[i]];
            if (monthName && !months.includes(monthName)) months.push(monthName);
          }
          for (let i = 0; i <= endIdx; i++) {
            const monthName = MONTH_MAP[monthOrder[i]];
            if (monthName && !months.includes(monthName)) months.push(monthName);
          }
        }
      }
    }
  }

  return months;
}

function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

interface CSVRow {
  name: string;
  latinName: string;
  type: string;
  gbVolume: string;
  peakMonths: string;
  verifyLatin: string;
  inAirtable: string;
  contentWritten: string;
  expertReviewed: string;
  live: string;
  notes: string;
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n');
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parse (handles commas in quoted fields)
    const fields: string[] = [];
    let field = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    fields.push(field.trim());

    if (fields[0]) {
      rows.push({
        name: fields[0] || '',
        latinName: fields[1] || '',
        type: fields[2] || '',
        gbVolume: fields[3] || '',
        peakMonths: fields[4] || '',
        verifyLatin: fields[5] || '',
        inAirtable: fields[6] || '',
        contentWritten: fields[7] || '',
        expertReviewed: fields[8] || '',
        live: fields[9] || '',
        notes: fields[10] || '',
      });
    }
  }

  return rows;
}

async function createRecords(records: any[]): Promise<void> {
  // Airtable allows max 10 records per request
  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Creating batch ${i + 1}/${batches.length} (${batch.length} records)...`);

    const res = await fetch(`${AIRTABLE_API}/${AIRTABLE_BASE_ID}/Species`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: batch }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error(`Batch ${i + 1} failed:`, error);
      throw new Error(`Failed to create records: ${res.status}`);
    }

    // Rate limit: 5 requests per second
    await new Promise(resolve => setTimeout(resolve, 250));
  }
}

async function main() {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_PAT) {
    console.error('Missing AIRTABLE_BASE_ID or AIRTABLE_PAT');
    process.exit(1);
  }

  const csvPath = './the-foragers-species-master.csv';
  console.log(`Reading ${csvPath}...`);

  const content = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  console.log(`Found ${rows.length} total species in CSV`);

  // Filter out species already in Airtable
  const newSpecies = rows.filter(r => r.inAirtable.toLowerCase() !== 'yes');
  console.log(`${newSpecies.length} species to import (excluding ${rows.length - newSpecies.length} already in Airtable)`);

  // Also filter out redirects/merges noted in the Notes column
  const validSpecies = newSpecies.filter(r => {
    const notes = r.notes.toLowerCase();
    return !notes.includes('redirect') && !notes.includes('same as') && !notes.includes('merge');
  });

  console.log(`${validSpecies.length} species after filtering redirects/duplicates`);

  // Map to Airtable records
  const records = validSpecies.map(row => ({
    fields: {
      'Species Name': row.name,
      'Latin Name': row.latinName,
      'Slug': slugify(row.name),
      'Type': row.type || 'Greens',
      'Difficulty': 'Intermediate', // Default
      'Status': 'Draft',
      'Short Description': '',
      'Seasons': parseMonths(row.peakMonths),
      'Expert Reviewed': false,
      'Reviewer Notes': row.notes || '',
    },
  }));

  console.log(`\nSample record:`);
  console.log(JSON.stringify(records[0], null, 2));

  console.log(`\nCreating ${records.length} records in Airtable...`);
  await createRecords(records);

  console.log(`\n✅ Successfully imported ${records.length} species!`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
