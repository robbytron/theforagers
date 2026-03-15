import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getJournalEntriesByCategory } from '@/lib/airtable';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Wild Table — Journal | The Foragers',
  description: 'Cooking with foraged ingredients — meals, experiments, and lessons from the kitchen.',
};

export const revalidate = 3600;

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

export default async function WildTablePage() {
  const entries = await getJournalEntriesByCategory('Wild Table');
  const featured = entries[0];
  const remaining = entries.slice(1);

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1695088957803-0f2bf5d2d202?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <h1 className={styles.title}>Wild <em>Table</em></h1>
            <p className={styles.subtitle}>
              Cooking with foraged ingredients — meals, experiments, and lessons from the kitchen.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          {entries.length === 0 ? (
            <div className={styles.comingSoon}>
              <h2>Coming Soon</h2>
              <p>We're documenting our kitchen experiments. Check back soon for stories of cooking with wild food.</p>
            </div>
          ) : (
            <>
              {featured && (
                <Link href={`/journal/${featured.slug}`} className={styles.featured}>
                  <span className={styles.featuredLabel}>Latest</span>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                  <div className={styles.featuredMeta}>
                    {formatDate(featured.publishDate) && <span>{formatDate(featured.publishDate)}</span>}
                    <span>{getReadingTime(featured.body)} min read</span>
                  </div>
                </Link>
              )}

              {remaining.length > 0 && (
                <div className={styles.entryList}>
                  {remaining.map(entry => (
                    <Link key={entry.id} href={`/journal/${entry.slug}`} className={styles.entryCard}>
                      <h3 className={styles.entryTitle}>{entry.title}</h3>
                      <p className={styles.entryExcerpt}>{entry.excerpt}</p>
                      <div className={styles.entryMeta}>
                        {formatDate(entry.publishDate) && <span>{formatDate(entry.publishDate)}</span>}
                        <span>{getReadingTime(entry.body)} min read</span>
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
              <Link href="/journal/in-season" className={styles.exploreCard}>
                <h3 className={styles.exploreCardTitle}>In Season</h3>
                <p className={styles.exploreCardDesc}>What to find right now</p>
              </Link>
              <Link href="/journal/the-field" className={styles.exploreCard}>
                <h3 className={styles.exploreCardTitle}>The Field</h3>
                <p className={styles.exploreCardDesc}>Notes from foraging trips</p>
              </Link>
              <Link href="/journal/the-land" className={styles.exploreCard}>
                <h3 className={styles.exploreCardTitle}>The Land</h3>
                <p className={styles.exploreCardDesc}>Essays on landscape</p>
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.backLink}>
          <Link href="/">← Back to Home</Link>
        </div>
      </main>
    </>
  );
}
