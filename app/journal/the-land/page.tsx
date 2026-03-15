import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getJournalEntriesByCategory } from '@/lib/airtable';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'The Land — Journal | The Foragers',
  description: 'Essays on the British landscape, ecology, and our relationship with the land we forage.',
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

export default async function TheLandPage() {
  const entries = await getJournalEntriesByCategory('The Land');
  const featured = entries[0];
  const remaining = entries.slice(1);

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549709350-0a9d711063e3?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <h1 className={styles.title}>The <em>Land</em></h1>
            <p className={styles.subtitle}>
              Essays on the British landscape, ecology, and our relationship with the land we forage.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          {entries.length === 0 ? (
            <div className={styles.comingSoon}>
              <h2>Coming Soon</h2>
              <p>
                We're working on essays about landscape and ecology. Check back
                soon for deeper thinking about the land we forage.
              </p>
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

        <div className={styles.backLink}>
          <Link href="/">← Back to Home</Link>
        </div>
      </main>
    </>
  );
}
