import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getAllJournalEntries } from '@/lib/airtable';
import type { JournalEntry, JournalCategory } from '@/types';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'The Journal | The Foragers',
  description: 'Seasonal notes, foraging stories, essays on landscape, and cooking with wild food.',
};

export const revalidate = 3600;

const CATEGORIES: { slug: string; title: string; tagline: string; category: JournalCategory; image: string }[] = [
  {
    slug: 'in-season',
    title: 'In Season',
    tagline: 'What to find right now',
    category: 'In Season',
    image: '/journal/categories/in-season-card.png',
  },
  {
    slug: 'the-field',
    title: 'From The Field',
    tagline: 'Notes from foraging trips',
    category: 'From The Field',
    image: '/journal/categories/from-the-field-card.png',
  },
  {
    slug: 'the-land',
    title: 'The Land',
    tagline: 'Essays on landscape',
    category: 'The Land',
    image: '/journal/categories/the-land-card.png',
  },
  {
    slug: 'wild-table',
    title: 'The Wild Table',
    tagline: 'Cooking with wild food',
    category: 'The Wild Table',
    image: '/journal/categories/the-wild-table-card.png',
  },
];

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default async function JournalPage() {
  const allEntries = await getAllJournalEntries();

  // Group entries by category and take latest 4 from each
  const entriesByCategory: Record<JournalCategory, JournalEntry[]> = {
    'In Season': [],
    'From The Field': [],
    'The Land': [],
    'The Wild Table': [],
  };

  for (const entry of allEntries) {
    if (entriesByCategory[entry.category] && entriesByCategory[entry.category].length < 4) {
      entriesByCategory[entry.category].push(entry);
    }
  }

  return (
    <>
      <Nav />
      <main className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>The Journal</h1>
          <p className={styles.heroIntro}>
            Four perspectives on wild food in Britain — seasonal guides, field notes, essays on landscape, and recipes from the kitchen.
          </p>
        </header>

        {/* Category Cards - 4 in a row */}
        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/journal/${cat.slug}`} className={styles.categoryCard}>
              <img src={cat.image} alt={cat.title} className={styles.categoryImage} />
              <div className={styles.categoryOverlay}>
                <p className={styles.categoryTagline}>{cat.tagline}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Articles by Category */}
        <div className={styles.sections}>
          {CATEGORIES.map((cat) => {
            const articles = entriesByCategory[cat.category] || [];
            if (articles.length === 0) return null;
            return (
              <section key={cat.slug} className={styles.categorySection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{cat.title}</h2>
                  <Link href={`/journal/${cat.slug}`} className={styles.sectionLink}>
                    View all →
                  </Link>
                </div>
                <div className={styles.articleRow}>
                  {articles.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/journal/${entry.slug}`}
                      className={styles.articleCard}
                    >
                      <h3 className={styles.articleTitle}>{entry.title}</h3>
                      <p className={styles.articleExcerpt}>{entry.excerpt}</p>
                      <span className={styles.articleMeta}>{getReadingTime(entry.body)} min read</span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

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
