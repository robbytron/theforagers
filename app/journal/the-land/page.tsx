import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'The Land — Journal',
  description: 'Essays on the British landscape, ecology, and our relationship with the land we forage.',
};

export default function TheLandPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
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

          <div className={styles.comingSoon}>
            <h2>Coming Soon</h2>
            <p>
              We&apos;re working on essays about landscape and ecology. Check back
              soon for deeper thinking about the land we forage.
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
