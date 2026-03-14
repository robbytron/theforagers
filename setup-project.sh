#!/bin/bash
# ─────────────────────────────────────────────
#  The Foragers — Project File Generator
#  Run from inside your the-foragers directory:
#  bash setup-project.sh
# ─────────────────────────────────────────────

set -e
echo "🌿 Setting up The Foragers project files..."

# Create directories
mkdir -p app/species/\[slug\]
mkdir -p app/calendar
mkdir -p app/beginners
mkdir -p app/api/revalidate
mkdir -p components/ui
mkdir -p components/species
mkdir -p lib
mkdir -p types

# ── types/index.ts ────────────────────────────────────────────────────────────
cat > types/index.ts << 'ENDOFFILE'
export type SpeciesType = 'Greens' | 'Fungi' | 'Berries' | 'Nuts' | 'Roots' | 'Coastal' | 'Flowers';
export type SpeciesDifficulty = 'Beginner' | 'Intermediate' | 'Expert Only';
export type SpeciesStatus = 'Draft' | 'In Review' | 'Live' | 'Hidden';
export type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';

export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
  thumbnails?: {
    small?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
    full?:  { url: string; width: number; height: number };
  };
}

export interface AirtableSpeciesFields {
  'Species Name':          string;
  'Latin Name':            string;
  'Slug':                  string;
  'Type':                  SpeciesType;
  'Difficulty':            SpeciesDifficulty;
  'Status':                SpeciesStatus;
  'Short Description':     string;
  'Full Description':      string;
  'Identification Notes':  string;
  'Lookalikes & Dangers':  string;
  'Habitat':               string;
  'Culinary Uses':         string;
  'Legal Notes':           string;
  'iNaturalist Taxon ID':  number;
  'Hero Image':            AirtableAttachment[];
  'Additional Images':     AirtableAttachment[];
  'Hide API Photos':       boolean;
  'Expert Reviewed':       boolean;
  'Reviewer Notes':        string;
  'SEO Title':             string;
  'SEO Description':       string;
  'Last Updated':          string;
  'Seasons':               Month[];
  'Habitats':              string[];
}

export interface Species {
  id:                   string;
  name:                 string;
  latinName:            string;
  slug:                 string;
  type:                 SpeciesType;
  difficulty:           SpeciesDifficulty;
  status:               SpeciesStatus;
  shortDescription:     string;
  fullDescription:      string;
  identificationNotes:  string;
  lookalikesAndDangers: string;
  habitat:              string;
  culinaryUses:         string;
  legalNotes:           string;
  iNaturalistTaxonId:   number | null;
  heroImage:            AirtableAttachment | null;
  additionalImages:     AirtableAttachment[];
  hideApiPhotos:        boolean;
  expertReviewed:       boolean;
  reviewerNotes:        string;
  seoTitle:             string;
  seoDescription:       string;
  lastUpdated:          string;
  seasons:              Month[];
  photos:               SpeciesPhoto[];
}

export interface SpeciesPhoto {
  url:         string;
  thumbUrl:    string;
  attribution: string;
  license:     string;
  source:      'airtable' | 'inaturalist';
  width?:      number;
  height?:     number;
}

export interface INatPhoto {
  id:           number;
  url:          string;
  attribution:  string;
  license_code: string;
}

export interface INatObservation {
  id:            number;
  photos:        INatPhoto[];
  quality_grade: string;
  place_guess:   string;
}
ENDOFFILE
echo "  ✓ types/index.ts"

# ── lib/airtable.ts ───────────────────────────────────────────────────────────
cat > lib/airtable.ts << 'ENDOFFILE'
import type { Species, AirtableSpeciesFields, AirtableAttachment, SpeciesPhoto } from '@/types';

const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const PAT     = process.env.AIRTABLE_PAT!;
const AIRTABLE_API = 'https://api.airtable.com/v0';

interface AirtableRecord<T> { id: string; fields: T; }
interface AirtableListResponse<T> { records: AirtableRecord<T>[]; offset?: string; }

async function airtableFetch<T>(
  table: string,
  params: Record<string, string> = {},
  revalidate = 3600,
): Promise<AirtableRecord<T>[]> {
  const url = new URL(`${AIRTABLE_API}/${BASE_ID}/${encodeURIComponent(table)}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const records: AirtableRecord<T>[] = [];
  let offset: string | undefined;

  do {
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Airtable error ${res.status}: ${await res.text()}`);
    const data: AirtableListResponse<T> = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

function attachmentToPhoto(att: AirtableAttachment): SpeciesPhoto {
  return {
    url:         att.url,
    thumbUrl:    att.thumbnails?.large?.url ?? att.url,
    attribution: att.filename,
    license:     'CC-BY',
    source:      'airtable',
    width:       att.width,
    height:      att.height,
  };
}

function normalise(record: AirtableRecord<AirtableSpeciesFields>): Species {
  const f = record.fields;
  const heroAtt = f['Hero Image']?.[0] ?? null;
  return {
    id:                   record.id,
    name:                 f['Species Name']        ?? '',
    latinName:            f['Latin Name']           ?? '',
    slug:                 f['Slug']                 ?? '',
    type:                 f['Type'],
    difficulty:           f['Difficulty'],
    status:               f['Status']               ?? 'Draft',
    shortDescription:     f['Short Description']    ?? '',
    fullDescription:      f['Full Description']     ?? '',
    identificationNotes:  f['Identification Notes'] ?? '',
    lookalikesAndDangers: f['Lookalikes & Dangers'] ?? '',
    habitat:              f['Habitat']              ?? '',
    culinaryUses:         f['Culinary Uses']        ?? '',
    legalNotes:           f['Legal Notes']          ?? '',
    iNaturalistTaxonId:   f['iNaturalist Taxon ID'] ?? null,
    heroImage:            heroAtt,
    additionalImages:     f['Additional Images']    ?? [],
    hideApiPhotos:        f['Hide API Photos']      ?? false,
    expertReviewed:       f['Expert Reviewed']      ?? false,
    reviewerNotes:        f['Reviewer Notes']       ?? '',
    seoTitle:             f['SEO Title']            ?? f['Species Name'] ?? '',
    seoDescription:       f['SEO Description']      ?? f['Short Description'] ?? '',
    lastUpdated:          f['Last Updated']         ?? '',
    seasons:              f['Seasons']              ?? [],
    photos:               heroAtt ? [attachmentToPhoto(heroAtt)] : [],
  };
}

export async function getAllSpecies(): Promise<Species[]> {
  const records = await airtableFetch<AirtableSpeciesFields>('Species', {
    filterByFormula: `{Status} = "Live"`,
    sort: JSON.stringify([{ field: 'Species Name', direction: 'asc' }]),
  });
  return records.map(normalise);
}

export async function getSpeciesBySlug(slug: string): Promise<Species | null> {
  const records = await airtableFetch<AirtableSpeciesFields>('Species', {
    filterByFormula: `AND({Status} = "Live", {Slug} = "${slug}")`,
  });
  if (!records.length) return null;
  return normalise(records[0]);
}

export async function getAllSpeciesSlugs(): Promise<string[]> {
  const records = await airtableFetch<Pick<AirtableSpeciesFields, 'Slug' | 'Status'>>('Species', {
    filterByFormula: `{Status} = "Live"`,
    fields: JSON.stringify(['Slug']),
  });
  return records.map(r => r.fields['Slug']).filter(Boolean);
}

export async function getFeaturedSpecies(limit = 3): Promise<Species[]> {
  const all = await getAllSpecies();
  return all.slice(0, limit);
}
ENDOFFILE
echo "  ✓ lib/airtable.ts"

# ── lib/inaturalist.ts ────────────────────────────────────────────────────────
cat > lib/inaturalist.ts << 'ENDOFFILE'
import type { INatObservation, SpeciesPhoto, Species } from '@/types';

const INAT_API      = 'https://api.inaturalist.org/v1';
const CC_BY_LICENSES = 'cc-by,cc-by-sa';

function resizeINatUrl(url: string, size: 'small' | 'medium' | 'large'): string {
  return url.replace(/\/square\.|\/small\.|\/medium\.|\/large\.|\/original\./, `/${size}.`);
}

export async function getINatPhotos(taxonId: number, limit = 8): Promise<SpeciesPhoto[]> {
  const params = new URLSearchParams({
    taxon_id:      String(taxonId),
    quality_grade: 'research',
    place_id:      '6857',
    photo_license: CC_BY_LICENSES,
    per_page:      String(limit),
    order:         'desc',
    order_by:      'votes',
    photos:        'true',
  });

  const res = await fetch(`${INAT_API}/observations?${params}`, { next: { revalidate: 86400 } });
  if (!res.ok) return [];

  const data: { results: INatObservation[] } = await res.json();
  const photos: SpeciesPhoto[] = [];

  for (const obs of data.results) {
    for (const photo of obs.photos) {
      if (!photo.license_code || photo.license_code.includes('nc')) continue;
      photos.push({
        url:         resizeINatUrl(photo.url, 'large'),
        thumbUrl:    resizeINatUrl(photo.url, 'small'),
        attribution: photo.attribution,
        license:     photo.license_code.toUpperCase(),
        source:      'inaturalist',
      });
    }
  }
  return photos;
}

export async function resolveSpeciesPhotos(species: Species): Promise<SpeciesPhoto[]> {
  const airtablePhotos: SpeciesPhoto[] = [
    ...(species.heroImage ? [{
      url:         species.heroImage.url,
      thumbUrl:    species.heroImage.thumbnails?.large?.url ?? species.heroImage.url,
      attribution: species.heroImage.filename,
      license:     'CC-BY',
      source:      'airtable' as const,
    }] : []),
    ...species.additionalImages.map(att => ({
      url:         att.url,
      thumbUrl:    att.thumbnails?.large?.url ?? att.url,
      attribution: att.filename,
      license:     'CC-BY',
      source:      'airtable' as const,
    })),
  ];

  if (species.hideApiPhotos || !species.iNaturalistTaxonId) return airtablePhotos;

  const needed     = Math.max(0, 6 - airtablePhotos.length);
  const inatPhotos = needed > 0 ? await getINatPhotos(species.iNaturalistTaxonId, needed + 2) : [];
  const hero       = airtablePhotos.slice(0, 1);
  const additional = airtablePhotos.slice(1);

  return [...hero, ...inatPhotos.slice(0, needed), ...additional];
}
ENDOFFILE
echo "  ✓ lib/inaturalist.ts"

# ── app/globals.css ───────────────────────────────────────────────────────────
cat > app/globals.css << 'ENDOFFILE'
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --green-deep:  #1c2b1e;
  --green-mid:   #2d4a30;
  --green-muted: #4a6b4d;
  --sage:        #8aab82;
  --cream:       #f4efe4;
  --parchment:   #ede5d0;
  --brown:       #8b6914;
  --brown-light: #c4a35a;
  --white:       #faf8f3;
  --font-display: var(--font-fraunces, Georgia, serif);
  --font-body:    var(--font-epilogue, system-ui, sans-serif);
  --space-1: 4px; --space-2: 8px; --space-3: 16px; --space-4: 24px;
  --space-5: 32px; --space-6: 48px; --space-7: 64px; --space-8: 96px; --space-9: 128px;
  --text-xs: 0.64rem; --text-sm: 0.8rem; --text-base: 1rem; --text-md: 1.25rem;
  --text-lg: 1.563rem; --text-xl: 1.953rem; --text-2xl: 2.441rem; --text-3xl: 3.052rem;
}

html { scroll-behavior: smooth; }

body {
  background: var(--cream);
  color: var(--green-deep);
  font-family: var(--font-body);
  font-weight: 300;
  line-height: 1.65;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1000;
  opacity: 0.4;
}

h1,h2,h3,h4,h5,h6 { font-family: var(--font-display); font-weight: 300; line-height: 1.1; letter-spacing: -0.025em; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }

.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--brown);
  margin-bottom: var(--space-4);
}

.btn-primary {
  display: inline-block;
  padding: 14px var(--space-5);
  background: var(--brown-light);
  color: var(--green-deep);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary:hover { background: var(--cream); transform: translateY(-1px); }

.btn-ghost {
  display: inline-block;
  padding: 14px var(--space-5);
  border: 1px solid rgba(244,239,228,0.3);
  color: var(--cream);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  letter-spacing: 0.05em;
  transition: border-color 0.2s, background 0.2s;
  cursor: pointer;
  background: transparent;
}

.btn-ghost:hover { border-color: rgba(244,239,228,0.7); background: rgba(244,239,228,0.05); }

.tag { font-size: var(--text-xs); letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 8px; font-weight: 500; }
.tag-season   { background: var(--green-deep); color: var(--sage); }
.tag-beginner { background: rgba(196,163,90,0.15); color: var(--brown); }
.tag-caution  { background: rgba(180,80,60,0.1); color: #a04030; }
ENDOFFILE
echo "  ✓ app/globals.css"

# ── app/layout.tsx ────────────────────────────────────────────────────────────
cat > app/layout.tsx << 'ENDOFFILE'
import type { Metadata } from 'next';
import { Fraunces, Epilogue } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap',
});

const epilogue = Epilogue({
  subsets: ['latin'], weight: ['300','400','500'], variable: '--font-epilogue', display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'The Foragers — Wild Food of Britain', template: '%s | The Foragers' },
  description: 'The definitive UK foraging guide — find, identify and cook wild food in Britain.',
  metadataBase: new URL('https://theforagers.co.uk'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${epilogue.variable}`}>
      <body>{children}</body>
    </html>
  );
}
ENDOFFILE
echo "  ✓ app/layout.tsx"

# ── components/ui/Nav.tsx ─────────────────────────────────────────────────────
cat > components/ui/Nav.tsx << 'ENDOFFILE'
import Link from 'next/link';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>The Foragers</Link>
      <ul className={styles.links}>
        <li><Link href="/species">Species</Link></li>
        <li><Link href="/calendar">Calendar</Link></li>
        <li><Link href="/beginners">Beginners</Link></li>
      </ul>
    </nav>
  );
}
ENDOFFILE
echo "  ✓ components/ui/Nav.tsx"

cat > components/ui/Nav.module.css << 'ENDOFFILE'
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4) var(--space-6);
}
.nav::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(28,43,30,0.6) 0%, transparent 100%);
  pointer-events: none;
}
.logo {
  font-family: var(--font-display); font-size: var(--text-lg); font-weight: 600;
  color: var(--cream); letter-spacing: -0.02em; position: relative;
}
.links { display: flex; gap: var(--space-6); list-style: none; position: relative; }
.links a {
  font-size: var(--text-xs); font-weight: 500; letter-spacing: 0.1em;
  text-transform: uppercase; color: rgba(244,239,228,0.8); transition: color 0.2s;
}
.links a:hover { color: var(--cream); }
@media (max-width: 768px) { .nav { padding: var(--space-4); } .links { display: none; } }
ENDOFFILE
echo "  ✓ components/ui/Nav.module.css"

# ── components/species/SpeciesCard.tsx ────────────────────────────────────────
cat > components/species/SpeciesCard.tsx << 'ENDOFFILE'
import Link from 'next/link';
import Image from 'next/image';
import type { Species } from '@/types';
import styles from './SpeciesCard.module.css';

export default function SpeciesCard({ species }: { species: Species }) {
  const photo = species.photos[0];
  const difficultyClass = species.difficulty === 'Beginner' ? 'tag-beginner'
    : species.difficulty === 'Expert Only' ? 'tag-caution' : 'tag-season';

  return (
    <Link href={`/species/${species.slug}`} className={styles.card}>
      <div className={styles.imgWrap}>
        {photo ? (
          <Image src={photo.url} alt={species.name} fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.img} />
        ) : (
          <div className={styles.imgPlaceholder} />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.tags}>
          <span className="tag tag-season">{species.type}</span>
          <span className={`tag ${difficultyClass}`}>{species.difficulty}</span>
        </div>
        <p className={styles.name}>{species.name}</p>
        <p className={styles.latin}>{species.latinName}</p>
        <p className={styles.desc}>{species.shortDescription}</p>
        <div className={styles.footer}>
          <span className={styles.habitat}>{species.habitat}</span>
          <span className={styles.cta}>Full guide →</span>
        </div>
      </div>
    </Link>
  );
}
ENDOFFILE
echo "  ✓ components/species/SpeciesCard.tsx"

cat > components/species/SpeciesCard.module.css << 'ENDOFFILE'
.card { display: block; background: var(--white); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(28,43,30,0.12); }
.imgWrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.img { object-fit: cover; filter: saturate(0.9); transition: filter 0.3s, transform 0.4s; }
.imgPlaceholder { position: absolute; inset: 0; background: var(--green-mid); opacity: 0.3; }
.card:hover .img { filter: saturate(1.1); transform: scale(1.02); }
.body { padding: var(--space-4); }
.tags { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-3); }
.name { font-family: var(--font-display); font-size: var(--text-lg); font-weight: 600; line-height: 1.2; letter-spacing: -0.02em; color: var(--green-deep); margin-bottom: 4px; }
.latin { font-family: var(--font-display); font-style: italic; font-size: var(--text-sm); color: var(--green-muted); margin-bottom: var(--space-3); }
.desc { font-size: var(--text-sm); color: var(--green-muted); line-height: 1.6; }
.footer { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid rgba(28,43,30,0.08); }
.habitat { font-size: var(--text-xs); letter-spacing: 0.06em; text-transform: uppercase; color: var(--green-muted); }
.cta { font-size: var(--text-xs); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brown); transition: color 0.2s; }
.card:hover .cta { color: var(--green-deep); }
ENDOFFILE
echo "  ✓ components/species/SpeciesCard.module.css"

# ── app/page.tsx ──────────────────────────────────────────────────────────────
cat > app/page.tsx << 'ENDOFFILE'
import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getFeaturedSpecies } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'The Foragers — Wild Food of Britain',
  description: 'A seasonal UK foraging guide. Find, identify, and cook wild food.',
};

export const revalidate = 3600;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_COUNTS: Record<string, number> = {
  January:6,February:9,March:18,April:24,May:31,June:28,
  July:26,August:29,September:34,October:31,November:14,December:8,
};
const TICKER = [
  {name:'Wild Garlic',note:'in leaf now'},{name:'Wood Sorrel',note:'emerging'},
  {name:'Hawthorn Buds',note:'first flush'},{name:'Nettles',note:'young tops only'},
  {name:'Chickweed',note:'widespread'},{name:'Bittercress',note:'hedgerows'},
  {name:'Cleavers',note:'young shoots'},{name:'Alexanders',note:'coastal areas'},
];

export default async function HomePage() {
  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const featured = await getFeaturedSpecies(3);

  return (
    <>
      <Nav />
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <p className={styles.heroSeason}>{currentMonth} · Britain&apos;s Woodlands &amp; Hedgerows</p>
        <h1 className={styles.heroTitle}>The land is<br /><em>waking up.</em><br />Go and find it.</h1>
        <p className={styles.heroSub}>Everything you need to forage wild food in Britain — what&apos;s out there, when to find it, and how to be sure you&apos;re eating the right thing.</p>
        <div className={styles.heroActions}>
          <Link href="/species" className="btn-primary">What&apos;s in season now</Link>
          <Link href="/beginners" className="btn-ghost">Start here →</Link>
        </div>
      </section>

      <div className={styles.seasonStrip}>
        <div className={styles.seasonScroll}>
          {[...TICKER,...TICKER].map((item,i) => (
            <div key={i} className={styles.seasonItem}>
              <span className={styles.dot} /><strong>{item.name}</strong><span>{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      <section className={styles.inSeason}>
        <div className={styles.inSeasonIntro}>
          <p className="section-label">In season — {currentMonth} {now.getFullYear()}</p>
          <h2 className={styles.sectionTitle}>The best finds<br />this <em>fortnight</em></h2>
          <p>Spring is just beginning. These are the species worth going out for right now.</p>
        </div>
        <div className={styles.speciesGrid}>
          {featured.map(s => <SpeciesCard key={s.id} species={s} />)}
        </div>
      </section>

      <section className={styles.calendarSection}>
        <p className="section-label" style={{color:'var(--sage)'}}>The forager&apos;s year</p>
        <h2 className={styles.sectionTitle} style={{color:'var(--cream)'}}>
          Every month has<br />something <em style={{color:'var(--brown-light)'}}>worth finding</em>
        </h2>
        <div className={styles.calendarGrid}>
          {MONTHS.map(month => (
            <Link key={month} href={`/calendar`}
              className={`${styles.calMonth} ${month===currentMonth ? styles.calActive : ''}`}>
              <div className={styles.calName}>{month.slice(0,3)}</div>
              <div className={styles.calCount}>{MONTH_COUNTS[month]} species</div>
            </Link>
          ))}
        </div>
      </section>

      <div className={styles.editorial}>
        <div className={styles.editorialPanel} style={{background:'var(--parchment)'}}>
          <p className="section-label">The species guide</p>
          <h3 className={styles.editorialTitle}>Every plant,<br />properly <em>identified</em></h3>
          <p>Over 200 species with photographs, lookalike warnings, and culinary guidance.</p>
          <Link href="/species">Browse the full guide →</Link>
        </div>
        <div className={styles.editorialPanel}>
          <p className="section-label">New to foraging?</p>
          <h3 className={styles.editorialTitle}>Start with <em>ten species.</em><br />Learn them properly.</h3>
          <p>Master these and you&apos;ll always find something edible.</p>
          <Link href="/beginners">Beginner&apos;s guide →</Link>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <div className={styles.footerBrand}>The <em>Foragers</em></div>
            <p className={styles.footerTagline}>Wild food of Britain</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4>Explore</h4>
              <ul>
                <li><Link href="/species">Species Guide</Link></li>
                <li><Link href="/calendar">Calendar</Link></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Learn</h4>
              <ul>
                <li><Link href="/beginners">Beginners</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerLegal}>© {now.getFullYear()} The Foragers.</p>
          <p className={styles.footerSafety}>Never eat anything you cannot positively identify.</p>
        </div>
      </footer>
    </>
  );
}
ENDOFFILE
echo "  ✓ app/page.tsx"

# ── app/page.module.css ───────────────────────────────────────────────────────
cat > app/page.module.css << 'ENDOFFILE'
.hero { position:relative; height:100vh; min-height:600px; display:flex; flex-direction:column; justify-content:flex-end; padding:var(--space-8) var(--space-6); overflow:hidden; animation:heroFade 1.2s ease both; }
@keyframes heroFade { from{opacity:0} to{opacity:1} }
.heroBg { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,43,30,0.92) 0%,rgba(28,43,30,0.3) 50%,rgba(28,43,30,0.15) 100%),url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80') center/cover no-repeat; }
.heroSeason { position:relative; font-size:var(--text-xs); font-weight:500; letter-spacing:0.15em; text-transform:uppercase; color:var(--sage); margin-bottom:var(--space-3); animation:slideUp 0.8s 0.3s ease both; }
.heroTitle { position:relative; font-family:var(--font-display); font-size:clamp(3rem,8vw,6rem); font-weight:300; line-height:1.05; letter-spacing:-0.03em; color:var(--cream); margin-bottom:var(--space-4); animation:slideUp 0.8s 0.45s ease both; }
.heroTitle em { font-style:italic; font-weight:600; color:var(--brown-light); }
.heroSub { position:relative; font-size:var(--text-base); color:rgba(244,239,228,0.7); max-width:480px; margin-bottom:var(--space-6); animation:slideUp 0.8s 0.6s ease both; }
.heroActions { position:relative; display:flex; gap:var(--space-3); flex-wrap:wrap; animation:slideUp 0.8s 0.75s ease both; }
@keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.seasonStrip { background:var(--green-deep); padding:var(--space-4) 0; overflow:hidden; }
.seasonScroll { display:flex; gap:var(--space-7); animation:ticker 30s linear infinite; white-space:nowrap; }
.seasonScroll:hover { animation-play-state:paused; }
@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.seasonItem { display:flex; align-items:center; gap:var(--space-3); font-size:var(--text-xs); letter-spacing:0.1em; text-transform:uppercase; color:var(--sage); flex-shrink:0; }
.seasonItem strong { color:var(--cream); font-weight:500; }
.dot { width:4px; height:4px; background:var(--brown-light); border-radius:50%; flex-shrink:0; }
.inSeason { background:var(--parchment); padding:var(--space-8) var(--space-6); }
.inSeasonIntro { max-width:560px; margin-bottom:var(--space-7); }
.inSeasonIntro p { color:var(--green-muted); }
.sectionTitle { font-family:var(--font-display); font-size:clamp(var(--text-2xl),4vw,var(--text-3xl)); font-weight:300; line-height:1.12; letter-spacing:-0.025em; color:var(--green-deep); margin-bottom:var(--space-5); }
.sectionTitle em { font-style:italic; font-weight:600; color:var(--green-mid); }
.speciesGrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:var(--space-4); }
.calendarSection { background:var(--green-deep); padding:var(--space-8) var(--space-6); }
.calendarGrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); gap:2px; margin-top:var(--space-6); }
.calMonth { display:block; background:rgba(244,239,228,0.05); padding:var(--space-4) var(--space-3); text-align:center; border:1px solid transparent; transition:background 0.2s; }
.calMonth:hover { background:rgba(244,239,228,0.1); border-color:rgba(138,171,130,0.3); }
.calActive { background:var(--green-mid) !important; border-color:var(--sage) !important; }
.calName { font-family:var(--font-display); font-size:var(--text-sm); font-weight:600; color:var(--cream); }
.calCount { font-size:var(--text-xs); color:var(--sage); margin-top:4px; }
.calActive .calCount { color:var(--brown-light); }
.editorial { display:grid; grid-template-columns:1fr 1fr; gap:2px; background:var(--green-deep); }
.editorialPanel { background:var(--cream); padding:var(--space-7) var(--space-6); }
.editorialTitle { font-family:var(--font-display); font-size:clamp(var(--text-xl),3vw,var(--text-2xl)); font-weight:300; line-height:1.12; letter-spacing:-0.025em; color:var(--green-deep); margin-bottom:var(--space-4); }
.editorialTitle em { font-style:italic; font-weight:600; color:var(--green-mid); }
.editorialPanel p { font-size:var(--text-sm); color:var(--green-muted); line-height:1.7; margin-bottom:var(--space-4); }
.editorialPanel a { font-size:var(--text-xs); font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--brown); border-bottom:1px solid var(--brown-light); padding-bottom:2px; }
.footer { background:var(--green-deep); padding:var(--space-8) var(--space-6) var(--space-6); border-top:1px solid rgba(138,171,130,0.15); }
.footerTop { display:flex; justify-content:space-between; align-items:flex-start; gap:var(--space-6); flex-wrap:wrap; padding-bottom:var(--space-7); border-bottom:1px solid rgba(244,239,228,0.08); margin-bottom:var(--space-6); }
.footerBrand { font-family:var(--font-display); font-size:var(--text-xl); font-weight:300; color:var(--cream); letter-spacing:-0.02em; }
.footerBrand em { font-style:italic; font-weight:600; color:var(--brown-light); }
.footerTagline { font-size:var(--text-sm); color:var(--sage); margin-top:var(--space-2); }
.footerLinks { display:flex; gap:var(--space-7); flex-wrap:wrap; }
.footerCol h4 { font-size:var(--text-xs); letter-spacing:0.12em; text-transform:uppercase; color:var(--sage); margin-bottom:var(--space-3); font-weight:500; }
.footerCol ul { list-style:none; }
.footerCol li { margin-bottom:var(--space-2); }
.footerCol a { font-size:var(--text-sm); color:rgba(244,239,228,0.5); transition:color 0.2s; }
.footerCol a:hover { color:var(--cream); }
.footerBottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-3); }
.footerLegal { font-size:var(--text-xs); color:rgba(244,239,228,0.25); }
.footerSafety { font-size:var(--text-xs); color:rgba(196,163,90,0.6); font-style:italic; font-family:var(--font-display); }
@media (max-width:768px) { .hero{padding:var(--space-7) var(--space-4)} .inSeason,.calendarSection{padding-left:var(--space-4);padding-right:var(--space-4)} .editorial{grid-template-columns:1fr} }
ENDOFFILE
echo "  ✓ app/page.module.css"

# ── app/species/page.tsx ──────────────────────────────────────────────────────
cat > app/species/page.tsx << 'ENDOFFILE'
import type { Metadata } from 'next';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getAllSpecies } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Species Guide',
  description: 'Browse wild food species found in Britain.',
};

export const revalidate = 3600;

export default async function SpeciesIndexPage() {
  const species = await getAllSpecies();

  return (
    <>
      <Nav />
      <div className={styles.pageHero}>
        <p className={styles.heroLabel}>The complete guide</p>
        <h1 className={styles.heroTitle}>Wild food<br /><em>of Britain</em></h1>
        <p className={styles.heroSub}>{species.length} species — each with photographs, identification notes, lookalike warnings, and culinary uses.</p>
      </div>
      <div className={styles.grid}>
        {species.length === 0 ? (
          <p className={styles.empty}>No live species yet. Add some in Airtable and set Status to Live.</p>
        ) : (
          species.map(s => <SpeciesCard key={s.id} species={s} />)
        )}
      </div>
    </>
  );
}
ENDOFFILE
echo "  ✓ app/species/page.tsx"

cat > app/species/page.module.css << 'ENDOFFILE'
.pageHero { background:var(--green-deep); padding:calc(var(--space-9) + var(--space-4)) var(--space-6) var(--space-8); }
.heroLabel { font-size:var(--text-xs); font-weight:500; letter-spacing:0.15em; text-transform:uppercase; color:var(--sage); margin-bottom:var(--space-4); }
.heroTitle { font-family:var(--font-display); font-size:clamp(var(--text-2xl),5vw,var(--text-3xl)); font-weight:300; line-height:1.08; letter-spacing:-0.03em; color:var(--cream); margin-bottom:var(--space-4); }
.heroTitle em { font-style:italic; font-weight:600; color:var(--brown-light); }
.heroSub { font-size:var(--text-base); color:rgba(244,239,228,0.6); max-width:480px; }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:var(--space-4); padding:var(--space-6); }
.empty { grid-column:1/-1; padding:var(--space-8) 0; text-align:center; color:var(--green-muted); }
ENDOFFILE
echo "  ✓ app/species/page.module.css"

# ── app/species/[slug]/page.tsx ───────────────────────────────────────────────
cat > 'app/species/[slug]/page.tsx' << 'ENDOFFILE'
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getSpeciesBySlug, getAllSpeciesSlugs } from '@/lib/airtable';
import { resolveSpeciesPhotos } from '@/lib/inaturalist';
import styles from './page.module.css';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllSpeciesSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const species = await getSpeciesBySlug(params.slug);
  if (!species) return {};
  return { title: species.seoTitle || species.name, description: species.seoDescription || species.shortDescription };
}

export default async function SpeciesPage({ params }: { params: { slug: string } }) {
  const species = await getSpeciesBySlug(params.slug);
  if (!species) notFound();

  const photos  = await resolveSpeciesPhotos(species);
  const hero    = photos[0];
  const gallery = photos.slice(1, 6);

  return (
    <>
      <Nav />
      <div className={styles.hero}>
        {hero ? (
          <Image src={hero.url} alt={species.name} fill priority sizes="100vw" className={styles.heroImg} />
        ) : <div className={styles.heroPlaceholder} />}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link href="/species" className={styles.breadcrumb}>← Species guide</Link>
          <div className={styles.heroTags}>
            <span className="tag tag-season">{species.type}</span>
            <span className={`tag ${species.difficulty === 'Beginner' ? 'tag-beginner' : species.difficulty === 'Expert Only' ? 'tag-caution' : 'tag-season'}`}>{species.difficulty}</span>
            {species.expertReviewed && <span className="tag tag-beginner">Expert reviewed ✓</span>}
          </div>
          <h1 className={styles.heroTitle}>{species.name}</h1>
          <p className={styles.heroLatin}>{species.latinName}</p>
          <p className={styles.heroDesc}>{species.shortDescription}</p>
        </div>
      </div>

      <div className={styles.layout}>
        <article className={styles.article}>
          {species.fullDescription && (
            <section className={styles.section}>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.fullDescription}} />
            </section>
          )}
          {species.identificationNotes && (
            <section className={styles.section}>
              <h2 className={styles.sectionHead}>How to identify it</h2>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.identificationNotes}} />
            </section>
          )}
          {species.lookalikesAndDangers && (
            <section className={`${styles.section} ${styles.dangerSection}`}>
              <h2 className={styles.dangerHead}><span>⚠</span> Lookalikes &amp; dangers</h2>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.lookalikesAndDangers}} />
            </section>
          )}
          {species.culinaryUses && (
            <section className={styles.section}>
              <h2 className={styles.sectionHead}>How to eat it</h2>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.culinaryUses}} />
            </section>
          )}
        </article>

        <aside className={styles.sidebar}>
          <div className={styles.factCard}>
            <h3 className={styles.factHead}>At a glance</h3>
            <dl className={styles.factList}>
              <div className={styles.factRow}><dt>Type</dt><dd>{species.type}</dd></div>
              <div className={styles.factRow}><dt>Difficulty</dt><dd>{species.difficulty}</dd></div>
              <div className={styles.factRow}><dt>Habitat</dt><dd>{species.habitat}</dd></div>
              {species.seasons.length > 0 && <div className={styles.factRow}><dt>In season</dt><dd>{species.seasons.join(', ')}</dd></div>}
              <div className={styles.factRow}><dt>Expert reviewed</dt><dd>{species.expertReviewed ? 'Yes ✓' : 'Pending'}</dd></div>
            </dl>
          </div>
          {gallery.length > 0 && (
            <div className={styles.galleryCard}>
              <h3 className={styles.factHead}>Photos</h3>
              <div className={styles.gallery}>
                {gallery.map((photo, i) => (
                  <div key={i} className={styles.galleryItem}>
                    <Image src={photo.thumbUrl} alt={`${species.name} ${i+2}`} fill sizes="200px" className={styles.galleryImg} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {species.iNaturalistTaxonId && (
            <a href={`https://www.inaturalist.org/taxa/${species.iNaturalistTaxonId}`} target="_blank" rel="noopener noreferrer" className={styles.inatLink}>
              View on iNaturalist →
            </a>
          )}
        </aside>
      </div>
    </>
  );
}
ENDOFFILE
echo "  ✓ app/species/[slug]/page.tsx"

cat > 'app/species/[slug]/page.module.css' << 'ENDOFFILE'
.hero { position:relative; height:70vh; min-height:500px; overflow:hidden; }
.heroImg { object-fit:cover; filter:saturate(0.85); }
.heroPlaceholder { position:absolute; inset:0; background:var(--green-mid); }
.heroOverlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(28,43,30,0.95) 0%,rgba(28,43,30,0.4) 50%,rgba(28,43,30,0.1) 100%); }
.heroContent { position:absolute; bottom:0; left:0; right:0; padding:var(--space-8) var(--space-6) var(--space-7); }
.breadcrumb { display:inline-block; font-size:var(--text-xs); letter-spacing:0.1em; text-transform:uppercase; color:rgba(244,239,228,0.5); margin-bottom:var(--space-4); transition:color 0.2s; }
.breadcrumb:hover { color:var(--cream); }
.heroTags { display:flex; gap:var(--space-2); flex-wrap:wrap; margin-bottom:var(--space-4); }
.heroTitle { font-family:var(--font-display); font-size:clamp(var(--text-2xl),5vw,var(--text-3xl)); font-weight:300; line-height:1.05; letter-spacing:-0.03em; color:var(--cream); margin-bottom:var(--space-2); }
.heroLatin { font-family:var(--font-display); font-style:italic; font-size:var(--text-md); color:var(--sage); margin-bottom:var(--space-4); }
.heroDesc { font-size:var(--text-base); color:rgba(244,239,228,0.7); max-width:560px; }
.layout { display:grid; grid-template-columns:1fr 300px; gap:var(--space-7); padding:var(--space-7) var(--space-6); max-width:1200px; margin:0 auto; align-items:start; }
.article { display:flex; flex-direction:column; gap:var(--space-7); }
.sectionHead { font-family:var(--font-display); font-size:var(--text-xl); font-weight:300; letter-spacing:-0.02em; color:var(--green-deep); margin-bottom:var(--space-4); padding-bottom:var(--space-3); border-bottom:1px solid rgba(28,43,30,0.1); }
.prose { font-size:var(--text-base); color:var(--green-muted); line-height:1.75; }
.prose p+p { margin-top:var(--space-4); }
.dangerSection { background:rgba(180,80,60,0.05); border-left:3px solid #a04030; padding:var(--space-5); }
.dangerHead { font-family:var(--font-display); font-size:var(--text-xl); font-weight:600; color:#7a2020; margin-bottom:var(--space-4); display:flex; align-items:center; gap:var(--space-3); }
.sidebar { position:sticky; top:calc(var(--space-7) + var(--space-4)); display:flex; flex-direction:column; gap:var(--space-4); }
.factCard,.galleryCard { background:var(--parchment); padding:var(--space-5); }
.factHead { font-size:var(--text-xs); font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--brown); margin-bottom:var(--space-4); }
.factList { display:flex; flex-direction:column; }
.factRow { display:flex; justify-content:space-between; align-items:baseline; gap:var(--space-3); padding:var(--space-2) 0; border-bottom:1px solid rgba(28,43,30,0.08); font-size:var(--text-sm); }
.factRow:last-child { border-bottom:none; }
.factRow dt { color:var(--green-muted); }
.factRow dd { font-weight:400; color:var(--green-deep); text-align:right; }
.gallery { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-2); }
.galleryItem { position:relative; aspect-ratio:1; overflow:hidden; }
.galleryImg { object-fit:cover; transition:transform 0.3s; }
.galleryItem:hover .galleryImg { transform:scale(1.04); }
.inatLink { font-size:var(--text-xs); letter-spacing:0.08em; text-transform:uppercase; color:var(--brown); font-weight:500; border-bottom:1px solid var(--brown-light); padding-bottom:2px; width:fit-content; }
@media (max-width:900px) { .layout{grid-template-columns:1fr;padding:var(--space-5) var(--space-4)} .sidebar{position:static} .heroContent{padding:var(--space-7) var(--space-4) var(--space-6)} }
ENDOFFILE
echo "  ✓ app/species/[slug]/page.module.css"

# ── app/calendar/page.tsx ─────────────────────────────────────────────────────
cat > app/calendar/page.tsx << 'ENDOFFILE'
import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getAllSpecies } from '@/lib/airtable';
import type { Month } from '@/types';
import styles from './page.module.css';

export const metadata: Metadata = { title: "Forager's Calendar", description: 'What to forage in Britain, month by month.' };
export const revalidate = 3600;

const MONTHS: Month[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default async function CalendarPage() {
  const allSpecies   = await getAllSpecies();
  const now          = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const byMonth      = Object.fromEntries(MONTHS.map(m => [m, allSpecies.filter(s => s.seasons.includes(m))])) as Record<Month, typeof allSpecies>;

  return (
    <>
      <Nav />
      <div className={styles.pageHero}>
        <p className={styles.heroLabel}>Month by month</p>
        <h1 className={styles.heroTitle}>The forager&apos;s<br /><em>calendar</em></h1>
        <p className={styles.heroSub}>Every month has something worth finding. Use this to plan ahead or find out what&apos;s available right now.</p>
      </div>
      <div className={styles.monthNav}>
        {MONTHS.map(month => (
          <a key={month} href={`#${month.toLowerCase()}`} className={`${styles.monthPill} ${month===currentMonth ? styles.monthActive : ''}`}>
            <span className={styles.monthName}>{month.slice(0,3)}</span>
            <span className={styles.monthCount}>{byMonth[month].length}</span>
          </a>
        ))}
      </div>
      <div className={styles.calendar}>
        {MONTHS.map(month => (
          <section key={month} id={month.toLowerCase()} className={`${styles.monthSection} ${month===currentMonth ? styles.currentMonth : ''}`}>
            <div className={styles.monthHeader}>
              <div>
                {month === currentMonth && <p className={styles.nowBadge}>↑ Right now</p>}
                <h2 className={styles.monthTitle}>{month}</h2>
                <p className={styles.monthMeta}>{byMonth[month].length} species in season</p>
              </div>
            </div>
            {byMonth[month].length > 0 ? (
              <div className={styles.monthGrid}>
                {byMonth[month].slice(0,4).map(s => <SpeciesCard key={s.id} species={s} />)}
              </div>
            ) : (
              <p className={styles.empty}>Species entries for {month} coming soon.</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
ENDOFFILE
echo "  ✓ app/calendar/page.tsx"

cat > app/calendar/page.module.css << 'ENDOFFILE'
.pageHero { background:var(--green-deep); padding:calc(var(--space-9) + var(--space-4)) var(--space-6) var(--space-8); }
.heroLabel { font-size:var(--text-xs); font-weight:500; letter-spacing:0.15em; text-transform:uppercase; color:var(--sage); margin-bottom:var(--space-4); }
.heroTitle { font-family:var(--font-display); font-size:clamp(var(--text-2xl),5vw,var(--text-3xl)); font-weight:300; line-height:1.08; letter-spacing:-0.03em; color:var(--cream); margin-bottom:var(--space-4); }
.heroTitle em { font-style:italic; font-weight:600; color:var(--brown-light); }
.heroSub { font-size:var(--text-base); color:rgba(244,239,228,0.6); max-width:480px; }
.monthNav { background:var(--parchment); border-bottom:1px solid rgba(28,43,30,0.1); display:flex; overflow-x:auto; position:sticky; top:0; z-index:50; scrollbar-width:none; }
.monthNav::-webkit-scrollbar { display:none; }
.monthPill { flex:1; min-width:56px; display:flex; flex-direction:column; align-items:center; padding:var(--space-3) var(--space-2); border-right:1px solid rgba(28,43,30,0.06); text-decoration:none; transition:background 0.15s; }
.monthPill:hover { background:rgba(28,43,30,0.05); }
.monthActive { background:var(--green-deep) !important; }
.monthName { font-family:var(--font-display); font-size:var(--text-sm); font-weight:600; color:var(--green-deep); }
.monthActive .monthName { color:var(--cream); }
.monthCount { font-size:var(--text-xs); color:var(--green-muted); margin-top:2px; }
.monthActive .monthCount { color:var(--brown-light); }
.calendar { padding:0 var(--space-6) var(--space-9); }
.monthSection { padding:var(--space-8) 0; border-bottom:1px solid rgba(28,43,30,0.1); }
.monthSection:last-child { border-bottom:none; }
.nowBadge { font-size:var(--text-xs); font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:var(--brown); margin-bottom:var(--space-2); }
.monthHeader { margin-bottom:var(--space-6); }
.monthTitle { font-family:var(--font-display); font-size:clamp(var(--text-xl),4vw,var(--text-2xl)); font-weight:300; letter-spacing:-0.025em; color:var(--green-deep); }
.monthMeta { font-size:var(--text-sm); color:var(--green-muted); margin-top:var(--space-2); }
.monthGrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:var(--space-4); }
.empty { font-size:var(--text-sm); color:var(--green-muted); font-style:italic; padding:var(--space-5) 0; }
@media (max-width:768px) { .calendar{padding:0 var(--space-4) var(--space-8)} }
ENDOFFILE
echo "  ✓ app/calendar/page.module.css"

# ── app/beginners/page.tsx ────────────────────────────────────────────────────
cat > app/beginners/page.tsx << 'ENDOFFILE'
import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getAllSpecies } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Beginners Start Here', description: "New to foraging? Start here." };
export const revalidate = 3600;

const CODE = [
  { rule: 'Take only what you need', detail: 'Leave enough for wildlife and other foragers. Take no more than a third.' },
  { rule: 'Be absolutely certain of your ID', detail: 'If you have any doubt, leave it. Use multiple identification features — never rely on one alone.' },
  { rule: 'Know the law', detail: 'In England, Wales and Scotland you can generally pick fruit, fungi and foliage from public land for personal use. Uprooting plants without permission is illegal.' },
  { rule: 'Respect private land', detail: 'Most land in Britain is privately owned. Always get permission before foraging on private property.' },
  { rule: 'Protect rare species', detail: "Never pick species that are rare or protected. Check the Vascular Plant Red List before harvesting anything unusual." },
  { rule: 'Leave no trace', detail: "Take nothing but what you're harvesting. Close gates, leave paths clear, treat the land as if you'll need to return." },
];

export default async function BeginnersPage() {
  const allSpecies      = await getAllSpecies();
  const beginnerSpecies = allSpecies.filter(s => s.difficulty === 'Beginner').slice(0, 6);

  return (
    <>
      <Nav />
      <div className={styles.pageHero}>
        <p className={styles.heroLabel}>New to foraging?</p>
        <h1 className={styles.heroTitle}>Start with <em>ten species.</em><br />Learn them properly.</h1>
        <p className={styles.heroSub}>You don&apos;t need to know 200 plants. You need to know ten, really well.</p>
      </div>

      <section id="code" className={styles.codeSection}>
        <div className={styles.sectionIntro}>
          <p className="section-label">Before you go out</p>
          <h2 className={styles.sectionTitle}>The forager&apos;s <em>code</em></h2>
        </div>
        <ol className={styles.codeList}>
          {CODE.map((item, i) => (
            <li key={i} className={styles.codeItem}>
              <span className={styles.codeNumber}>{String(i+1).padStart(2,'0')}</span>
              <div>
                <h3 className={styles.codeRule}>{item.rule}</h3>
                <p className={styles.codeDetail}>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div id="safety" className={styles.safetyBox}>
        <div className={styles.safetyInner}>
          <h2 className={styles.safetyTitle}><span>⚠</span> The single most important rule</h2>
          <p className={styles.safetyRule}>Never eat anything you cannot positively identify using at least three separate features — shape, smell, habitat, season.</p>
          <p className={styles.safetySub}>Some of Britain&apos;s most dangerous plants resemble edible species closely. Hemlock Water Dropwort, Death Cap, Destroying Angel. These are fatal. If in doubt, leave it out.</p>
        </div>
      </div>

      <section id="species" className={styles.speciesSection}>
        <div className={styles.sectionIntro}>
          <p className="section-label">Where to start</p>
          <h2 className={styles.sectionTitle}>Your first <em>six species</em></h2>
          <p className={styles.sectionSub}>Beginner-friendly, widely available, and distinctive enough that confident identification is straightforward.</p>
        </div>
        <div className={styles.speciesGrid}>
          {beginnerSpecies.map(s => <SpeciesCard key={s.id} species={s} />)}
        </div>
        {beginnerSpecies.length === 0 && <p className={styles.empty}>Set some species to Difficulty: Beginner in Airtable to see them here.</p>}
      </section>
    </>
  );
}
ENDOFFILE
echo "  ✓ app/beginners/page.tsx"

cat > app/beginners/page.module.css << 'ENDOFFILE'
.pageHero { background:var(--green-mid); padding:calc(var(--space-9) + var(--space-4)) var(--space-6) var(--space-8); }
.heroLabel { font-size:var(--text-xs); font-weight:500; letter-spacing:0.15em; text-transform:uppercase; color:var(--sage); margin-bottom:var(--space-4); }
.heroTitle { font-family:var(--font-display); font-size:clamp(var(--text-2xl),5vw,var(--text-3xl)); font-weight:300; line-height:1.08; letter-spacing:-0.03em; color:var(--cream); margin-bottom:var(--space-4); }
.heroTitle em { font-style:italic; font-weight:600; color:var(--brown-light); }
.heroSub { font-size:var(--text-base); color:rgba(244,239,228,0.7); max-width:520px; }
.sectionIntro { max-width:640px; margin-bottom:var(--space-7); }
.sectionTitle { font-family:var(--font-display); font-size:clamp(var(--text-xl),3.5vw,var(--text-2xl)); font-weight:300; line-height:1.1; letter-spacing:-0.025em; color:var(--green-deep); margin-bottom:var(--space-4); }
.sectionTitle em { font-style:italic; font-weight:600; color:var(--green-mid); }
.sectionSub { font-size:var(--text-base); color:var(--green-muted); line-height:1.7; }
.codeSection { padding:var(--space-9) var(--space-6); background:var(--cream); }
.codeList { list-style:none; display:grid; grid-template-columns:repeat(auto-fill,minmax(460px,1fr)); gap:var(--space-2); }
.codeItem { display:flex; gap:var(--space-5); align-items:flex-start; padding:var(--space-5); background:var(--white); border:1px solid rgba(28,43,30,0.06); }
.codeNumber { font-family:var(--font-display); font-size:var(--text-2xl); font-weight:300; color:rgba(28,43,30,0.15); line-height:1; flex-shrink:0; letter-spacing:-0.04em; }
.codeRule { font-family:var(--font-display); font-size:var(--text-md); font-weight:600; letter-spacing:-0.02em; color:var(--green-deep); margin-bottom:var(--space-2); }
.codeDetail { font-size:var(--text-sm); color:var(--green-muted); line-height:1.65; }
.safetyBox { background:var(--green-deep); padding:var(--space-8) var(--space-6); }
.safetyInner { max-width:720px; margin:0 auto; text-align:center; }
.safetyTitle { font-family:var(--font-display); font-size:clamp(var(--text-xl),3vw,var(--text-2xl)); font-weight:600; color:var(--cream); margin-bottom:var(--space-5); display:flex; align-items:center; justify-content:center; gap:var(--space-3); }
.safetyRule { font-family:var(--font-display); font-size:var(--text-md); font-style:italic; font-weight:300; color:var(--brown-light); line-height:1.6; margin-bottom:var(--space-4); }
.safetySub { font-size:var(--text-sm); color:rgba(244,239,228,0.5); line-height:1.7; }
.speciesSection { padding:var(--space-9) var(--space-6); background:var(--parchment); }
.speciesGrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:var(--space-4); }
.empty { font-size:var(--text-sm); color:var(--green-muted); font-style:italic; padding:var(--space-5) 0; }
@media (max-width:768px) { .pageHero,.codeSection,.safetyBox,.speciesSection{padding-left:var(--space-4);padding-right:var(--space-4)} .codeList{grid-template-columns:1fr} }
ENDOFFILE
echo "  ✓ app/beginners/page.module.css"

# ── app/api/revalidate/route.ts ───────────────────────────────────────────────
cat > app/api/revalidate/route.ts << 'ENDOFFILE'
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug   = request.nextUrl.searchParams.get('slug');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  if (slug) { revalidatePath(`/species/${slug}`); return NextResponse.json({ revalidated: true, slug }); }
  revalidatePath('/'); revalidatePath('/species'); revalidatePath('/calendar');
  return NextResponse.json({ revalidated: true, all: true });
}
ENDOFFILE
echo "  ✓ app/api/revalidate/route.ts"

# ── next.config.js ────────────────────────────────────────────────────────────
cat > next.config.js << 'ENDOFFILE'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'inaturalist-open-data.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'static.inaturalist.org' },
      { protocol: 'https', hostname: 'v5.airtableusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  reactStrictMode: true,
};
module.exports = nextConfig;
ENDOFFILE
echo "  ✓ next.config.js"

# ── .env.local ────────────────────────────────────────────────────────────────
cat > .env.local << 'ENDOFFILE'
AIRTABLE_BASE_ID=appx8dBV88vq8885g
AIRTABLE_PAT=YOUR_AIRTABLE_PAT
REVALIDATE_SECRET=foragers-revalidate-2026
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENDOFFILE
echo "  ✓ .env.local"

echo ""
echo "✅ All files created. Now run: npm run dev"
echo ""
