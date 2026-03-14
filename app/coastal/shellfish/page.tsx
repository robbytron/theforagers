import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Shellfish Foraging',
  description: 'How to forage shellfish safely in Britain — water quality, biotoxins, species identification, and best practices.',
};

export default function ShellfishPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/coastal">Coastal</Link>
              <span>/</span>
              <span>Shellfish</span>
            </nav>
            <h1 className={styles.title}><em>Shellfish</em> Foraging</h1>
            <p className={styles.subtitle}>
              Gathering shellfish safely from British shores.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <div className={styles.warning}>
            <p>
              <strong>Shellfish safety is critical.</strong> Contaminated shellfish can cause
              serious illness. Always check water quality before harvesting.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Common Edible Species</h2>
            <div className={styles.prose}>
              <ul>
                <li><strong>Mussels</strong> — Found on rocks and harbour walls. Check water quality carefully.</li>
                <li><strong>Cockles</strong> — Buried in sandy mud. Rake or dig at low tide.</li>
                <li><strong>Winkles</strong> — On rocks at low tide. Easy to gather, lower contamination risk.</li>
                <li><strong>Razor Clams</strong> — In sand at very low tide. Salt draws them up.</li>
                <li><strong>Oysters</strong> — Rocky shores. Check local bylaws — some areas protected.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Water Quality</h2>
            <div className={styles.prose}>
              <p>
                Shellfish filter large volumes of water and concentrate any contaminants present.
                Before harvesting:
              </p>
              <ul>
                <li>Check the Food Standards Agency shellfish classifications for your area</li>
                <li>Avoid areas near sewage outflows, harbours, or industrial discharge</li>
                <li>Do not harvest after heavy rainfall — runoff increases contamination</li>
                <li>Avoid stagnant areas and lagoons</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Biotoxin Risks</h2>
            <div className={styles.prose}>
              <p>
                Algal blooms can produce biotoxins that accumulate in shellfish. These are not
                destroyed by cooking. The Food Standards Agency issues warnings when biotoxin
                levels are unsafe — check before harvesting bivalves.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Preparation</h2>
            <div className={styles.prose}>
              <p>
                Purge bivalves in clean seawater for several hours before cooking. Discard any
                that are open before cooking or remain closed after. Cook thoroughly.
              </p>
            </div>
          </section>
        </article>

        <div className={styles.backLink}>
          <Link href="/coastal">&larr; Back to Coastal Foraging</Link>
        </div>
      </main>
    </>
  );
}
