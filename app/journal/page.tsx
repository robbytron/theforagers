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
    slug: 'from-the-field',
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
    slug: 'the-wild-table',
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

        {/* 4-Column Category Grid */}
        <div className={styles.grid}>
          {CATEGORIES.map((cat) => {
            const articles = entriesByCategory[cat.category] || [];
            return (
              <div key={cat.slug} className={styles.column}>
                {/* Category Card */}
                <Link href={`/journal/${cat.slug}`} className={styles.categoryCard}>
                  <img src={cat.image} alt={cat.title} className={styles.categoryImage} />
                  <div className={styles.categoryOverlay}>
                    <p className={styles.categoryTagline}>{cat.tagline}</p>
                  </div>
                </Link>

                {/* Latest Articles */}
                <div className={styles.articles}>
                  <span className={styles.latestLabel}>Latest</span>
                  {articles.length > 0 ? (
                    articles.map((entry) => (
                      <Link
                        key={entry.id}
                        href={`/journal/${entry.slug}`}
                        className={`${styles.articleCard} ${entry.heroImage ? styles.articleCardWithImage : ''}`}
                      >
                        {entry.heroImage && (
                          <img
                            src={entry.heroImage.url}
                            alt={entry.title}
                            className={styles.articleImage}
                          />
                        )}
                        <div className={styles.articleContent}>
                          <h3 className={styles.articleTitle}>{entry.title}</h3>
                          <span className={styles.articleMeta}>{getReadingTime(entry.body)} min</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className={styles.comingSoon}>Coming soon</p>
                  )}
                  <Link href={`/journal/${cat.slug}`} className={styles.viewAllCard}>
                    View all {cat.title} →
                  </Link>
                </div>
              </div>
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
