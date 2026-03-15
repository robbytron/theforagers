import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Commercial Foraging',
  description: 'Rules for selling foraged food in the UK — permissions, food hygiene, and legal requirements.',
};

export default function CommercialForagingPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1738692074163-b066702aa2db?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/legal">Legal</Link>
              <span>/</span>
              <span>Commercial Foraging</span>
            </nav>
            <h1 className={styles.title}>Commercial <em>Foraging</em></h1>
            <p className={styles.subtitle}>
              What changes when you forage for profit.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Permission Required</h2>
            <div className={styles.prose}>
              <p>
                Commercial foraging <strong>always</strong> requires explicit landowner permission.
                The informal right to pick for personal use does not extend to commercial activity.
              </p>
              <p>
                Many landowners welcome commercial foragers and will grant permission or negotiate
                a fee. Others refuse entirely. Always ask first.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Food Hygiene Regulations</h2>
            <div className={styles.prose}>
              <p>
                If you sell foraged food to the public, you must comply with food safety regulations:
              </p>
              <ul>
                <li>Register your business with your local authority</li>
                <li>Implement food safety management procedures</li>
                <li>Ensure traceability of ingredients</li>
                <li>Consider food hygiene certification (Level 2 minimum)</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Insurance</h2>
            <div className={styles.prose}>
              <p>
                Public liability insurance is essential for commercial foragers. If someone
                becomes ill from misidentified food, you could face substantial claims.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Local Bylaws</h2>
            <div className={styles.prose}>
              <p>
                Some local authorities have bylaws restricting commercial foraging in parks
                and public spaces. Check with your local council before harvesting in quantity.
              </p>
            </div>
          </section>
        </article>

        <div className={styles.backLink}>
          <Link href="/legal">&larr; Back to Legal Guide</Link>
        </div>
      </main>
    </>
  );
}
