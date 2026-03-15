import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import FeaturedCard from '@/components/home/FeaturedCard';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getHomepageFeaturesBySection, getAllSpecies, getSpeciesBySlug } from '@/lib/airtable';
import type { Month, HomepageFeature, Species } from '@/types';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'The Foragers — Wild Food of Britain',
  description: 'A seasonal UK foraging guide. Find, identify, and cook wild food.',
};

export const revalidate = 3600;

const MONTHS: Month[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const TICKER = [
  {name:'Wild Garlic',note:'in leaf now'},{name:'Wood Sorrel',note:'emerging'},
  {name:'Hawthorn Buds',note:'first flush'},{name:'Nettles',note:'young tops only'},
  {name:'Chickweed',note:'widespread'},{name:'Bittercress',note:'hedgerows'},
  {name:'Cleavers',note:'young shoots'},{name:'Alexanders',note:'coastal areas'},
];

// Resolve species data for features that link to species
async function resolveFeatureSpecies(features: HomepageFeature[]): Promise<Map<string, Species | null>> {
  const speciesMap = new Map<string, Species | null>();
  const speciesFeatures = features.filter(f => f.contentType === 'Species');

  const results = await Promise.all(
    speciesFeatures.map(f => getSpeciesBySlug(f.slug))
  );

  speciesFeatures.forEach((f, i) => {
    speciesMap.set(f.slug, results[i]);
  });

  return speciesMap;
}

export default async function HomePage() {
  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];

  const [latestFeatures, featuredFeatures, allSpecies] = await Promise.all([
    getHomepageFeaturesBySection('Latest'),
    getHomepageFeaturesBySection('Featured'),
    getAllSpecies(),
  ]);

  const allFeatures = [...latestFeatures, ...featuredFeatures];
  const speciesMap = await resolveFeatureSpecies(allFeatures);

  const monthCounts = Object.fromEntries(
    MONTHS.map(m => [m, allSpecies.filter(s => s.seasons.includes(m)).length])
  ) as Record<Month, number>;

  const fallbackSpecies = allSpecies.slice(0, 3);

  return (
    <>
      <Nav />

      {/* Original Hero */}
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

      {/* Ticker */}
      <div className={styles.seasonStrip}>
        <div className={styles.seasonScroll}>
          {[...TICKER,...TICKER].map((item,i) => (
            <div key={i} className={styles.seasonItem}>
              <span className={styles.dot} /><strong>{item.name}</strong><span>{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest - Magazine Layout */}
      {latestFeatures.length > 0 && (
        <section className={styles.latestSection}>
          <div className={styles.sectionHeader}>
            <p className="section-label">Latest</p>
            <h2 className={styles.sectionTitle}>Fresh from <em>the field</em></h2>
          </div>
          <div className={styles.magazineGrid}>
            {latestFeatures.slice(0, 1).map(feature => (
              <div key={feature.id} className={styles.magazineLead}>
                <FeaturedCard
                  feature={feature}
                  species={feature.contentType === 'Species' ? speciesMap.get(feature.slug) : null}
                  variant="large"
                />
              </div>
            ))}
            <div className={styles.magazineSide}>
              {latestFeatures.slice(1, 4).map(feature => (
                <FeaturedCard
                  key={feature.id}
                  feature={feature}
                  species={feature.contentType === 'Species' ? speciesMap.get(feature.slug) : null}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured - Staggered Grid */}
      {featuredFeatures.length > 0 ? (
        <section className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <p className="section-label">Featured</p>
            <h2 className={styles.sectionTitle}>Worth <em>exploring</em></h2>
          </div>
          <div className={styles.staggeredGrid}>
            {featuredFeatures.slice(0, 6).map((feature, i) => (
              <div key={feature.id} className={i === 0 || i === 3 ? styles.staggeredWide : styles.staggeredNormal}>
                <FeaturedCard
                  feature={feature}
                  species={feature.contentType === 'Species' ? speciesMap.get(feature.slug) : null}
                  variant={i === 0 || i === 3 ? 'large' : 'default'}
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className={styles.inSeason}>
          <div className={styles.inSeasonIntro}>
            <p className="section-label">In season — {currentMonth} {now.getFullYear()}</p>
            <h2 className={styles.sectionTitle}>The best finds<br />this <em>fortnight</em></h2>
            <p>Spring is just beginning. These are the species worth going out for right now.</p>
          </div>
          <div className={styles.speciesGrid}>
            {fallbackSpecies.map(s => <SpeciesCard key={s.id} species={s} />)}
          </div>
        </section>
      )}

      {/* Calendar Section */}
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
              <div className={styles.calCount}>{monthCounts[month]} species</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial Panels */}
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
    </>
  );
}
