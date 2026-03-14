import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Field Guides for Beginners',
  description: 'Recommended field guides for new foragers — the books to start with.',
};

export default function BeginnerFieldGuidesPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/beginners">Beginners</Link>
              <span>/</span>
              <span>Field Guides</span>
            </nav>
            <h1 className={styles.title}>Field <em>Guides</em></h1>
            <p className={styles.subtitle}>
              The books we recommend for new foragers.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Start Here</h2>
            <div className={styles.speciesList}>
              <div className={styles.speciesCard}>
                <h3 className={styles.speciesName}>Food for Free</h3>
                <p className={styles.speciesLatin}>Richard Mabey</p>
                <p className={styles.speciesDesc}>
                  The classic British foraging guide. Comprehensive coverage with good
                  illustrations. The book that inspired a generation of foragers.
                </p>
              </div>
              <div className={styles.speciesCard}>
                <h3 className={styles.speciesName}>The Forager Handbook</h3>
                <p className={styles.speciesLatin}>Miles Irving</p>
                <p className={styles.speciesDesc}>
                  Excellent species accounts with detailed culinary guidance. Written by
                  a professional forager. More depth than breadth.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>For Mushrooms</h2>
            <div className={styles.speciesList}>
              <div className={styles.speciesCard}>
                <h3 className={styles.speciesName}>Mushrooms</h3>
                <p className={styles.speciesLatin}>Roger Phillips</p>
                <p className={styles.speciesDesc}>
                  The definitive British fungi guide. Essential if you want to forage
                  mushrooms. Excellent photographs and clear descriptions.
                </p>
              </div>
              <div className={styles.speciesCard}>
                <h3 className={styles.speciesName}>River Cottage Handbook: Mushrooms</h3>
                <p className={styles.speciesLatin}>John Wright</p>
                <p className={styles.speciesDesc}>
                  More accessible introduction for beginners. Good photographs and
                  recipes included. Part of an excellent series.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Advice</h2>
            <div className={styles.prose}>
              <p>
                Physical books are more reliable than apps — they work without signal or battery.
                Buy guides specific to Britain; American or European guides may show different
                species or distributions.
              </p>
              <p>
                Start with one general guide and learn it well. Add specialised guides as your
                interests develop.
              </p>
            </div>
          </section>
        </article>

        <div className={styles.backLink}>
          <Link href="/beginners">&larr; Back to Beginners Guide</Link>
        </div>
      </main>
    </>
  );
}
