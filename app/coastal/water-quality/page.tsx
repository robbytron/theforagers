import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Water Quality for Coastal Foraging',
  description: 'How to check water quality before coastal foraging — official classifications, pollution sources, and staying safe.',
};

export default function WaterQualityPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/coastal">Coastal</Link>
              <span>/</span>
              <span>Water Quality</span>
            </nav>
            <h1 className={styles.title}>Water <em>Quality</em></h1>
            <p className={styles.subtitle}>
              The single most important safety consideration for coastal foraging.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <div className={styles.warning}>
            <p>
              <strong>Always check water quality before harvesting shellfish or seaweed.</strong> Contamination
              can cause serious illness and is not visible to the naked eye.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Official Classifications</h2>
            <div className={styles.prose}>
              <p>
                The Food Standards Agency classifies shellfish waters in England and Wales.
                Classifications range from A (safe for direct human consumption) to Prohibited
                (no harvesting permitted).
              </p>
              <p>
                Check the FSA shellfish classifications before any coastal foraging trip. These
                are updated regularly and reflect actual contamination levels.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pollution Sources to Avoid</h2>
            <div className={styles.prose}>
              <ul>
                <li><strong>Sewage outflows</strong> — Both treated and untreated. Keep well clear.</li>
                <li><strong>Harbours and marinas</strong> — Fuel, antifouling paint, general pollution.</li>
                <li><strong>Industrial discharge</strong> — Heavy metals and chemical contamination.</li>
                <li><strong>Agricultural runoff</strong> — Fertilisers and pesticides.</li>
                <li><strong>Stormwater drains</strong> — Street pollution washed to sea.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>After Heavy Rainfall</h2>
            <div className={styles.prose}>
              <p>
                Heavy rain causes combined sewer overflows in many areas, releasing untreated
                sewage to rivers and coasts. It also increases agricultural runoff.
              </p>
              <p>
                <strong>Wait at least 48 hours after heavy rainfall</strong> before harvesting
                shellfish. Longer in areas with known issues.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Biotoxin Alerts</h2>
            <div className={styles.prose}>
              <p>
                Algal blooms can produce dangerous biotoxins that accumulate in filter-feeding
                shellfish. These toxins are not destroyed by cooking.
              </p>
              <p>
                Check for biotoxin alerts before harvesting mussels, oysters, or other bivalves.
                The Food Standards Agency issues warnings when levels are unsafe.
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
