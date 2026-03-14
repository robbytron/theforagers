import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'In Season — Journal',
  description: 'Monthly dispatches on what\'s growing, what\'s ready, and what\'s worth finding right now.',
};

export default function InSeasonPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/journal">Journal</Link>
              <span>/</span>
              <span>In Season</span>
            </nav>
            <h1 className={styles.title}>In <em>Season</em></h1>
            <p className={styles.subtitle}>
              Monthly dispatches tied to what&apos;s happening right now.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <p className={styles.intro}>
            The state of the hedgerows. The first wild garlic of the year. What the woods
            look like in October. Seasonal notes updated throughout the year.
          </p>

          <div className={styles.comingSoon}>
            <h2>Coming Soon</h2>
            <p>
              We&apos;re working on our first seasonal dispatches. Check back soon for
              notes on what&apos;s out there right now.
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
