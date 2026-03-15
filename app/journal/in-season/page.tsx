import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getJournalEntriesByCategory } from '@/lib/airtable';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'In Season — Journal | The Foragers',
  description: 'Monthly dispatches on what\'s growing, what\'s ready, and what\'s worth finding right now.',
};

export const revalidate = 3600;

const FALLBACK_IMAGE = '/journal/categories/in-season-wide.png';

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function InSeasonPage() {
  const entries = await getJournalEntriesByCategory('In Season');
  const featured = entries[0];
  const remaining = entries.slice(1);

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <img src="/journal/categories/in-season-wide.png" alt="In Season" className={styles.headerImage} />
        </header>

        <article className={styles.content}>
          {entries.length === 0 ? (
            <div className={styles.comingSoon}>
              <h2>Coming Soon</h2>
              <p>Monthly guides to what's in season will appear here. Check back soon.</p>
            </div>
          ) : (
            <>
              {featured && (
                <Link href={`/journal/${featured.slug}`} className={styles.featured}>
                  <img
                    src={featured.heroImage?.url || FALLBACK_IMAGE}
                    alt={featured.title}
                    className={styles.featuredImage}
                  />
                  <div className={styles.featuredContent}>
                    <span className={styles.featuredLabel}>Latest</span>
                    <h2 className={styles.featuredTitle}>{featured.title}</h2>
                    <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                    <div className={styles.featuredMeta}>
                      {formatDate(featured.publishDate) && <span>{formatDate(featured.publishDate)}</span>}
                      <span>{getReadingTime(featured.body)} min read</span>
                    </div>
                  </div>
                </Link>
              )}

              {remaining.length > 0 && (
                <div className={styles.entryList}>
                  {remaining.map(entry => (
                    <Link key={entry.id} href={`/journal/${entry.slug}`} className={styles.entryCard}>
                      <img
                        src={entry.heroImage?.url || FALLBACK_IMAGE}
                        alt={entry.title}
                        className={styles.entryImage}
                      />
                      <div className={styles.entryContent}>
                        <h3 className={styles.entryTitle}>{entry.title}</h3>
                        <p className={styles.entryExcerpt}>{entry.excerpt}</p>
                        <div className={styles.entryMeta}>
                          {formatDate(entry.publishDate) && <span>{formatDate(entry.publishDate)}</span>}
                          <span>{getReadingTime(entry.body)} min read</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </article>

        {/* Explore Other Journals */}
        <section className={styles.explore}>
          <div className={styles.exploreInner}>
            <h2 className={styles.exploreTitle}>Explore More</h2>
            <div className={styles.exploreGrid}>
              <Link href="/journal/from-the-field" className={styles.exploreCard}>
                <h3 className={styles.exploreCardTitle}>From The Field</h3>
                <p className={styles.exploreCardDesc}>Notes from foraging trips</p>
              </Link>
              <Link href="/journal/the-land" className={styles.exploreCard}>
                <h3 className={styles.exploreCardTitle}>The Land</h3>
                <p className={styles.exploreCardDesc}>Essays on landscape</p>
              </Link>
              <Link href="/journal/the-wild-table" className={styles.exploreCard}>
                <h3 className={styles.exploreCardTitle}>The Wild Table</h3>
                <p className={styles.exploreCardDesc}>Cooking with wild food</p>
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.backLink}>
          <Link href="/journal">← Back to Journal</Link>
        </div>
      </main>
    </>
  );
}
