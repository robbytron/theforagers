import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getAllJournalEntries } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'The Journal | The Foragers',
  description: 'Seasonal notes, foraging stories, essays on landscape, and cooking with wild food.',
};

export const revalidate = 3600;

const JOURNALS = [
  {
    slug: 'in-season',
    title: 'In Season',
    tagline: 'What to find right now',
    description: 'Monthly dispatches on what\'s growing, what\'s ready, and what\'s worth finding.',
    category: 'In Season',
  },
  {
    slug: 'the-field',
    title: 'The Field',
    tagline: 'Notes from the wild',
    description: 'First-hand accounts from foraging trips — what we found and what we learned.',
    category: 'The Field',
  },
  {
    slug: 'the-land',
    title: 'The Land',
    tagline: 'Essays on place',
    description: 'Longer pieces on landscape, ecology, and our relationship with wild Britain.',
    category: 'The Land',
  },
  {
    slug: 'wild-table',
    title: 'Wild Table',
    tagline: 'From forage to fork',
    description: 'Cooking with foraged ingredients — meals, experiments, and kitchen lessons.',
    category: 'Wild Table',
  },
];

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default async function JournalPage() {
  const allEntries = await getAllJournalEntries();

  // Get latest entry for each category
  const latestByCategory: Record<string, typeof allEntries[0] | undefined> = {};
  for (const journal of JOURNALS) {
    latestByCategory[journal.category] = allEntries.find(e => e.category === journal.category);
  }

  // Get the single most recent entry overall
  const latestOverall = allEntries[0];

  return (
    <>
      <Nav />
      <main className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <p className={styles.heroLabel}>The Foragers</p>
          <h1 className={styles.heroTitle}>The Journal</h1>
          <p className={styles.heroIntro}>
            Four perspectives on wild food in Britain — from seasonal guides to field notes,
            essays on landscape to recipes from the kitchen.
          </p>
        </header>

        {/* Featured Latest */}
        {latestOverall && (
          <section className={styles.featured}>
            <div className={styles.featuredInner}>
              <span className={styles.featuredLabel}>Latest</span>
              <Link href={`/journal/${latestOverall.slug}`} className={styles.featuredCard}>
                <span className={styles.featuredCategory}>{latestOverall.category}</span>
                <h2 className={styles.featuredTitle}>{latestOverall.title}</h2>
                <p className={styles.featuredExcerpt}>{latestOverall.excerpt}</p>
                <span className={styles.featuredMeta}>{getReadingTime(latestOverall.body)} min read</span>
              </Link>
            </div>
          </section>
        )}

        {/* Journal Sections */}
        <section className={styles.sections}>
          <h2 className={styles.sectionsTitle}>Explore the Journals</h2>
          <div className={styles.sectionsGrid}>
            {JOURNALS.map((journal, index) => {
              const latest = latestByCategory[journal.category];
              return (
                <Link
                  key={journal.slug}
                  href={`/journal/${journal.slug}`}
                  className={styles.sectionCard}
                >
                  <span className={styles.sectionNumber}>0{index + 1}</span>
                  <h3 className={styles.sectionTitle}>{journal.title}</h3>
                  <p className={styles.sectionTagline}>{journal.tagline}</p>
                  <p className={styles.sectionDesc}>{journal.description}</p>
                  {latest && (
                    <div className={styles.sectionLatest}>
                      <span className={styles.sectionLatestLabel}>Latest:</span>
                      <span className={styles.sectionLatestTitle}>{latest.title}</span>
                    </div>
                  )}
                  <span className={styles.sectionLink}>Read {journal.title} →</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer CTA */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Start Exploring</h2>
          <p className={styles.ctaText}>
            New to foraging? Begin with our species guide or check what's in season this month.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/species" className={styles.ctaButton}>Species Guide</Link>
            <Link href="/journal/in-season" className={styles.ctaButtonAlt}>What's In Season</Link>
          </div>
        </section>
      </main>
    </>
  );
}
