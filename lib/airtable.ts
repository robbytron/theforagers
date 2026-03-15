import type { Species, AirtableAttachment, SpeciesPhoto, Lookalike, DangerLevel, FAQ, Recipe, DangerSpecies, DangerCategory } from '@/types';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const PAT     = process.env.AIRTABLE_PAT;
const AIRTABLE_API = 'https://api.airtable.com/v0';

async function airtableFetch(table: string, params: Record<string, string> = {}) {
  const url = new URL(`${AIRTABLE_API}/${BASE_ID}/${encodeURIComponent(table)}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const records: any[] = [];
  let offset: string | undefined;
  do {
    if (offset) url.searchParams.set('offset', offset);
    // Don't cache paginated requests - offset tokens expire after ~5 minutes
    // Caching is handled at the page level via revalidate export
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${PAT}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);
  return records;
}

function parseFAQs(raw: string | undefined): FAQ[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: any) => item.q && item.a);
  } catch {
    return [];
  }
}

function normalise(record: any): Species {
  const f = record.fields;
  const heroAtt: AirtableAttachment | null = f['Hero Image']?.[0] ?? null;
  const iNatHeroUrl: string | null = f['iNaturalist Hero URL'] ?? null;
  const faqs = parseFAQs(f['FAQs']);

  // Build photos array: prefer Airtable hero, fall back to iNaturalist hero URL
  const photos: SpeciesPhoto[] = [];
  if (heroAtt) {
    photos.push({
      url:         heroAtt.url,
      thumbUrl:    heroAtt.thumbnails?.large?.url ?? heroAtt.url,
      attribution: heroAtt.filename,
      license:     'CC-BY',
      source:      'airtable' as const,
    });
  } else if (iNatHeroUrl) {
    photos.push({
      url:         iNatHeroUrl,
      thumbUrl:    iNatHeroUrl.replace('/large.', '/small.'),
      attribution: 'iNaturalist',
      license:     'CC-BY',
      source:      'inaturalist' as const,
    });
  }

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
    iNaturalistHeroUrl:   iNatHeroUrl,
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
    faqs,
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

function normaliseLookalike(record: any): Lookalike {
  const f = record.fields;
  const heroAtt: AirtableAttachment | null = f['Hero Image Override']?.[0] ?? null;

  return {
    id:                  record.id,
    name:                f['Name'] ?? '',
    latinName:           f['Latin Name'] ?? '',
    iNaturalistTaxonId:  f['iNaturalist Taxon ID'] ?? null,
    dangerLevel:         f['Danger Level'] ?? 'Caution',
    howToTellApart:      f['How to Tell Apart'] ?? '',
    speciesIds:          f['Species'] ?? [],
    heroImageOverride:   heroAtt,
    expertReviewed:      f['Expert Reviewed'] ?? false,
    reviewerNotes:       f['Reviewer Notes'] ?? '',
    photo:               null, // Will be resolved by component
  };
}

export async function getLookalikesForSpecies(speciesId: string): Promise<Lookalike[]> {
  try {
    const records = await airtableFetch('Lookalikes');
    return records
      .map(normaliseLookalike)
      .filter(l => l.expertReviewed && l.speciesIds.includes(speciesId));
  } catch {
    // Table may not exist yet
    return [];
  }
}

function normaliseRecipe(record: any): Recipe {
  const f = record.fields;
  const image: AirtableAttachment | null = f['Image']?.[0] ?? null;

  return {
    id:               record.id,
    name:             f['Recipe Name'] ?? '',
    slug:             f['Slug'] ?? '',
    shortDescription: f['Short Description'] ?? '',
    difficulty:       f['Difficulty'] ?? 'Easy',
    prepTime:         f['Prep Time'] ?? '',
    cookTime:         f['Cook Time'] ?? '',
    servings:         f['Servings'] ?? '',
    ingredients:      f['Ingredients'] ?? '',
    method:           f['Method'] ?? '',
    image,
    status:           f['Status'] ?? 'Draft',
  };
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const records = await airtableFetch('Recipes');
  return records.map(normaliseRecipe).filter(r => r.status === 'Live').sort((a, b) => a.name.localeCompare(b.name));
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const all = await getAllRecipes();
  return all.find(r => r.slug === slug) ?? null;
}

export async function getAllRecipeSlugs(): Promise<string[]> {
  const all = await getAllRecipes();
  return all.map(r => r.slug).filter(Boolean);
}

export async function getFeaturedRecipes(limit = 6): Promise<Recipe[]> {
  const all = await getAllRecipes();
  return all.slice(0, limit);
}

// Danger Species
function normaliseDangerSpecies(record: any): DangerSpecies {
  const f = record.fields;
  const heroAtt: AirtableAttachment | null = f['Hero Image']?.[0] ?? null;

  const photos: SpeciesPhoto[] = [];
  if (heroAtt) {
    photos.push({
      url:         heroAtt.url,
      thumbUrl:    heroAtt.thumbnails?.large?.url ?? heroAtt.url,
      attribution: heroAtt.filename,
      license:     'CC-BY',
      source:      'airtable' as const,
    });
  }

  return {
    id:                   record.id,
    name:                 f['Name'] ?? '',
    latinName:            f['Latin Name'] ?? '',
    slug:                 f['Slug'] ?? '',
    dangerLevel:          f['Danger Level'] ?? 'Caution',
    category:             f['Category'] ?? 'Plants',
    status:               f['Status'] ?? 'Draft',
    shortDescription:     f['Short Description'] ?? '',
    fullDescription:      f['Full Description'] ?? '',
    identificationNotes:  f['Identification Notes'] ?? '',
    confusedWith:         f['Confused With'] ?? '',
    symptoms:             f['Symptoms'] ?? '',
    firstAid:             f['First Aid'] ?? '',
    habitat:              f['Habitat'] ?? '',
    iNaturalistTaxonId:   f['iNaturalist Taxon ID'] ?? null,
    heroImage:            heroAtt,
    additionalImages:     f['Additional Images'] ?? [],
    photos,
  };
}

export async function getAllDangerSpecies(): Promise<DangerSpecies[]> {
  try {
    const records = await airtableFetch('Danger Species');
    return records.map(normaliseDangerSpecies).filter(d => d.status === 'Live').sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    // Table may not have any records yet
    return [];
  }
}

export async function getDangerSpeciesBySlug(slug: string): Promise<DangerSpecies | null> {
  const all = await getAllDangerSpecies();
  return all.find(d => d.slug === slug) ?? null;
}

export async function getAllDangerSpeciesSlugs(): Promise<string[]> {
  const all = await getAllDangerSpecies();
  return all.map(d => d.slug).filter(Boolean);
}

export async function getDangerSpeciesByCategory(category: DangerCategory): Promise<DangerSpecies[]> {
  const all = await getAllDangerSpecies();
  return all.filter(d => d.category === category);
}

// Homepage Features
import type { HomepageFeature, FeatureSection, FeatureContentType } from '@/types';

function normaliseHomepageFeature(record: any): HomepageFeature {
  const f = record.fields;
  const image: AirtableAttachment | null = f['Image']?.[0] ?? null;

  return {
    id:          record.id,
    title:       f['Title'] ?? '',
    contentType: f['Content Type'] ?? 'Species',
    slug:        f['Slug'] ?? '',
    section:     f['Section'] ?? 'Featured',
    order:       f['Order'] ?? 999,
    active:      f['Active'] ?? false,
    image,
    description: f['Description'] ?? '',
    customUrl:   f['Custom URL'] ?? null,
    badge:       f['Badge'] ?? null,
  };
}

export async function getHomepageFeatures(): Promise<HomepageFeature[]> {
  try {
    const records = await airtableFetch('Homepage Features');
    return records
      .map(normaliseHomepageFeature)
      .filter(f => f.active)
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function getHomepageFeaturesBySection(section: FeatureSection): Promise<HomepageFeature[]> {
  const all = await getHomepageFeatures();
  return all.filter(f => f.section === section);
}