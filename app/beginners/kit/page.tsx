import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Beginner Foraging Kit',
  description: 'Essential equipment for new foragers — what you need for your first foraging trips.',
};

export default function BeginnerKitPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/beginners">Beginners</Link>
              <span>/</span>
              <span>Kit</span>
            </nav>
            <h1 className={styles.title}>Beginner <em>Kit</em></h1>
            <p className={styles.subtitle}>
              What you need to start foraging.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Essential Items</h2>
            <div className={styles.prose}>
              <ul>
                <li><strong>A basket or bag</strong> — Wicker or cloth allows air circulation. Avoid plastic bags which cause wilting.</li>
                <li><strong>A small knife</strong> — For cutting stems cleanly. A folding penknife is fine to start.</li>
                <li><strong>A field guide</strong> — Physical book, specific to Britain. See our recommendations.</li>
                <li><strong>Paper bags</strong> — For separating specimens, especially fungi.</li>
                <li><strong>Your phone</strong> — For photos to aid identification later. Not as a primary ID tool.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Useful Additions</h2>
            <div className={styles.prose}>
              <ul>
                <li><strong>Hand lens</strong> — 10x magnification for examining small features.</li>
                <li><strong>Notebook and pencil</strong> — Record locations and observations.</li>
                <li><strong>Gloves</strong> — For nettles and thorny plants.</li>
                <li><strong>Secateurs</strong> — For woody stems.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What You Don&apos;t Need</h2>
            <div className={styles.prose}>
              <p>
                Don&apos;t feel you need to buy lots of specialised equipment. A bag, a knife,
                and a good book are enough to start. Everything else can wait until you know
                you&apos;ll use it.
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
