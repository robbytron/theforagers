import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getAllJournalEntries } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Journal | The Foragers',
  description: 'The Foragers Journal — seasonal notes, foraging stories, and updates from the field.',
};

export const revalidate = 3600;

const CATEGORIES = [
  { slug: 'all', label: 'All' },
  { slug: 'in-season', label: 'In Season' },
  { slug: 'the-field', label: 'The Field' },
  { slug: 'the-land', label: 'The Land' },
  { slug: 'wild-table', label: 'Wild Table' },
];

// Calculate reading time
function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Format date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function JournalPage({ searchParams }: Props) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';

  const allEntries = await getAllJournalEntries();

  // Filter entries by category
  const entries = activeCategory === 'all'
    ? allEntries
    : allEntries.filter(entry =>
        entry.category.toLowerCase().replace(/\s+/g, '-') === activeCategory
      );

  // Get featured article (first/latest)
  const featuredEntry = entries[0];
  const remainingEntries = entries.slice(1);

  return (
    <>
      <Nav />
      <main className={styles.page}>
        {/* Header */}
        <header className={styles.header}>
          <p className={styles.label}>From the Field</p>
          <h1 className={styles.title}>The Journal</h1>
          <p className={styles.intro}>
            Seasonal notes, foraging stories, and reflections on wild food in Britain.
          </p>
        </header>

        {/* Filter Bar */}
        <nav className={styles.filterBar}>
          <div className={styles.filters}>
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={cat.slug === 'all' ? '/journal' : `/journal?category=${cat.slug}`}
                className={`${styles.filterPill} ${activeCategory === cat.slug ? styles.filterActive : ''}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Articles */}
        <section className={styles.content}>
          {entries.length === 0 ? (
            <div className={styles.empty}>
              <p>No articles in this category yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredEntry && (
                <Link href={`/journal/${featuredEntry.slug}`} className={styles.featured}>
                  <span className={styles.featuredCategory}>{featuredEntry.category}</span>
                  <h2 className={styles.featuredTitle}>{featuredEntry.title}</h2>
                  <p className={styles.featuredExcerpt}>{featuredEntry.excerpt}</p>
                  <div className={styles.featuredMeta}>
                    {formatDate(featuredEntry.publishDate) && (
                      <span>{formatDate(featuredEntry.publishDate)}</span>
                    )}
                    <span>{getReadingTime(featuredEntry.body)} min read</span>
                  </div>
                </Link>
              )}

              {/* Article Grid */}
              {remainingEntries.length > 0 && (
                <div className={styles.grid}>
                  {remainingEntries.map(entry => (
                    <Link key={entry.id} href={`/journal/${entry.slug}`} className={styles.card}>
                      <span className={styles.cardCategory}>{entry.category}</span>
                      <h3 className={styles.cardTitle}>{entry.title}</h3>
                      <p className={styles.cardExcerpt}>{entry.excerpt}</p>
                      <div className={styles.cardMeta}>
                        {formatDate(entry.publishDate) && (
                          <span>{formatDate(entry.publishDate)}</span>
                        )}
                        <span>{getReadingTime(entry.body)} min read</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Subscribe */}
        <section className={styles.subscribe}>
          <h2 className={styles.subscribeTitle}>Stay Updated</h2>
          <p className={styles.subscribeDesc}>
            Follow along as we explore Britain's wild larder through the seasons.
          </p>
          <Link href="/species" className={styles.subscribeButton}>
            Explore Species Guide
          </Link>
        </section>
      </main>
    </>
  );
}
