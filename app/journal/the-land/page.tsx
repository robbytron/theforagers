import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import { getJournalEntriesByCategory } from '@/lib/airtable';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'The Land — Journal',
  description: 'Essays on the British landscape, ecology, and our relationship with the land we forage.',
};

export const revalidate = 3600;

export default async function TheLandPage() {
  const entries = await getJournalEntriesByCategory('The Land');

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549709350-0a9d711063e3?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/journal">Journal</Link>
              <span>/</span>
              <span>The Land</span>
            </nav>
            <h1 className={styles.title}>The <em>Land</em></h1>
            <p className={styles.subtitle}>
              Essays on landscape, ecology, and place.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <p className={styles.intro}>
            Longer pieces about the British landscape and our relationship with it.
            The history of commons, the ecology of hedgerows, the meaning of wild food.
          </p>

          {entries.length > 0 ? (
            <div className={styles.entryList}>
              {entries.map(entry => (
                <Link key={entry.id} href={`/journal/${entry.slug}`} className={styles.entryCard}>
                  <h3 className={styles.entryTitle}>{entry.title}</h3>
                  <p className={styles.entryExcerpt}>{entry.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.comingSoon}>
              <h2>Coming Soon</h2>
              <p>
                We&apos;re working on essays about landscape and ecology. Check back
                soon for deeper thinking about the land we forage.
              </p>
            </div>
          )}
        </article>

        <div className={styles.backLink}>
          <Link href="/journal">&larr; Back to Journal</Link>
        </div>
      </main>
    </>
  );
}
