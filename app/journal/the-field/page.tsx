import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'The Field — Journal',
  description: 'Notes from foraging expeditions across Britain — what we found, where we went, and what we learned.',
};

export default function TheFieldPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1692876339227-e74c5293a3e6?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/journal">Journal</Link>
              <span>/</span>
              <span>The Field</span>
            </nav>
            <h1 className={styles.title}>The <em>Field</em></h1>
            <p className={styles.subtitle}>
              Dispatches from foraging trips across Britain.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <p className={styles.intro}>
            First-hand accounts from the field. What we found, where we went, what the
            conditions were like. Real foraging, documented as it happens.
          </p>

          <div className={styles.comingSoon}>
            <h2>Coming Soon</h2>
            <p>
              We&apos;re preparing our first field reports. Check back soon for
              stories from the hedgerows, woodlands, and coastlines of Britain.
            </p>
          </div>
        </article>

        <div className={styles.backLink}>
          <Link href="/journal">&larr; Back to Journal</Link>
        </div>
      </main>
    </>
  );
}
