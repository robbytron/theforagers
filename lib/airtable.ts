import type { Species, AirtableAttachment, SpeciesPhoto } from '@/types';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PAT     = process.env.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';

async function airtableFetch(table: string, params: Record<string, string> = {}, revalidate = 3600) {
  const url = new URL(`${AIRTABLE_API}/${BASE_ID}/${encodeURIComponent(table)}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const records: any[] = [];
  let offset: string | undefined;
  do {
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${PAT}` },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

function normalise(record: any): Species {
  const f = record.fields;
  const heroAtt: AirtableAttachment | null = f['Hero Image']?.[0] ?? null;
  const photos: SpeciesPhoto[] = heroAtt ? [{
    url:         heroAtt.url,
    thumbUrl:    heroAtt.thumbnails?.large?.url ?? heroAtt.url,
    attribution: heroAtt.filename,
    license:     'CC-BY',
    source:      'airtable' as const,
  }] : [];

  return {
    id:                   record.id,
    name:                 f['Species Name'] ?? '',
    latinName:            f['Latin Name'] ?? '',
    slug:                 f['Slug'] ?? '',
    type:                 f['Type'],
    difficulty:           f['Difficulty'],
    status:               f['Status'] ?? 'Draft',
    shortDescription:     f['Short Description'] ?? '',
    fullDescription:      f['Full Description'] ?? '',
    identificationNotes:  f['Identification Notes'] ?? '',
    lookalikesAndDangers: f['Lookalikes & Dangers'] ?? '',
    habitat:              f['Habitat'] ?? '',
    culinaryUses:         f['Culinary Uses'] ?? '',
    legalNotes:           f['Legal Notes'] ?? '',
    iNaturalistTaxonId:   f['iNaturalist Taxon ID'] ?? null,
    heroImage:            heroAtt,
    additionalImages:     f['Additional Images'] ?? [],
    hideApiPhotos:        f['Hide API Photos'] ?? false,
    expertReviewed:       f['Expert Reviewed'] ?? false,
    reviewerNotes:        f['Reviewer Notes'] ?? '',
    seoTitle:             f['SEO Title'] ?? f['Species Name'] ?? '',
    seoDescription:       f['SEO Description'] ?? f['Short Description'] ?? '',
    lastUpdated:          f['Last Updated'] ?? '',
    seasons:              f['Seasons'] ?? [],
    photos,
  };
}

export async function getAllSpecies(): Promise<Species[]> {
  const records = await airtableFetch('Species');
  return records.map(normalise).filter(s => s.status === 'Live').sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSpeciesBySlug(slug: string): Promise<Species | null> {
  const all = await getAllSpecies();
  return all.find(s => s.slug === slug) ?? null;
}

export async function getAllSpeciesSlugs(): Promise<string[]> {
  const all = await getAllSpecies();
  return all.map(s => s.slug).filter(Boolean);
}

export async function getFeaturedSpecies(limit = 3): Promise<Species[]> {
  const all = await getAllSpecies();
  return all.slice(0, limit);
}