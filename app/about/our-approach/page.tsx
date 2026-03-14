import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Our Approach',
  description: 'How The Foragers researches, verifies, and presents foraging information with accuracy and safety.',
};

export default function OurApproachPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/about">About</Link>
              <span>/</span>
              <span>Our Approach</span>
            </nav>
            <h1 className={styles.title}>How we <em>work</em></h1>
            <p className={styles.subtitle}>
              Foraging information must be accurate. Lives depend on it. Here&apos;s how we ensure
              the reliability of everything we publish.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Research Standards</h2>
            <div className={styles.prose}>
              <p>
                Every species guide on The Foragers is built from multiple authoritative sources.
                We cross-reference botanical keys, mycological literature, and established foraging
                texts. We never rely on a single source, and we never publish information we
                cannot verify.
              </p>
              <p>
                Our primary references include the standard flora of the British Isles, peer-reviewed
                botanical journals, and the collective wisdom of experienced field botanists and
                mycologists who have spent decades studying these species in the wild.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Expert Review</h2>
            <div className={styles.prose}>
              <p>
                All identification guides are reviewed by qualified experts before publication. This
                includes botanists, mycologists, and professional foragers with proven field experience.
                Reviewers check for accuracy, completeness, and clarity — ensuring that critical safety
                information is never ambiguous.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Safety First</h2>
            <div className={styles.prose}>
              <p>
                We believe it&apos;s better to be overcautious than to encourage risk. Our guides
                always include:
              </p>
              <ul>
                <li>
                  <strong>Lookalike warnings</strong> — Every species page lists potentially
                  confusing species, especially toxic ones, with clear distinguishing features.
                </li>
                <li>
                  <strong>Honest difficulty ratings</strong> — We tell you when a species is hard
                  to identify and when you should seek expert confirmation.
                </li>
                <li>
                  <strong>Preparation requirements</strong> — Some species require specific
                  preparation before eating. We make this unmissable.
                </li>
                <li>
                  <strong>Clear danger pages</strong> — Our poisonous species guides are thorough
                  and prominent, not hidden away.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Continuous Improvement</h2>
            <div className={styles.prose}>
              <p>
                Knowledge evolves. New research emerges. Species distributions change. We review
                our content regularly and update it when necessary. Every guide includes a
                last-reviewed date so you know how current the information is.
              </p>
              <p>
                We also welcome corrections from the community. If you spot an error or have
                additional information, please get in touch. Collective knowledge makes all of us safer.
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
