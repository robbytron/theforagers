import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Seaweed Foraging',
  description: 'Introduction to foraging seaweed in Britain — species identification, harvesting techniques, and culinary uses.',
};

export default function SeaweedPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1728142233948-bf3b8c0a370b?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/coastal">Coastal</Link>
              <span>/</span>
              <span>Seaweed</span>
            </nav>
            <h1 className={styles.title}><em>Seaweed</em> Foraging</h1>
            <p className={styles.subtitle}>
              Harvesting edible seaweeds from British shores.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Common Edible Seaweeds</h2>
            <div className={styles.prose}>
              <ul>
                <li><strong>Dulse</strong> (Palmaria palmata) — Red-purple fronds with rich, savoury flavour. Eat raw or dried.</li>
                <li><strong>Laver</strong> (Porphyra umbilicalis) — Dark purple sheets. Used for Welsh laverbread.</li>
                <li><strong>Sea Lettuce</strong> (Ulva lactuca) — Bright green, mild flavour. Versatile in cooking.</li>
                <li><strong>Kelp</strong> (Laminaria digitata) — Large brown fronds. High in umami. Use in stocks.</li>
                <li><strong>Carrageen</strong> (Chondrus crispus) — Natural gelling agent. Used in desserts.</li>
                <li><strong>Pepper Dulse</strong> (Osmundea pinnatifida) — Intense peppery taste. Use sparingly.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Harvesting</h2>
            <div className={styles.prose}>
              <p>
                Cut seaweed rather than pulling — this leaves the holdfast attached to allow
                regrowth. Harvest only what you need and never strip an area bare.
              </p>
              <p>
                Best harvested at low spring tides when lower zones are exposed. Avoid areas
                with poor water quality or heavy boat traffic.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Preparation</h2>
            <div className={styles.prose}>
              <p>
                Rinse thoroughly in fresh water. Check for small creatures — shake well and
                inspect. Most seaweeds can be eaten fresh, dried for later use, or cooked
                into dishes.
              </p>
              <p>
                Drying preserves seaweed for months. Spread on racks or hang in bundles until
                crisp. Store in airtight containers away from light.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Culinary Uses</h2>
            <div className={styles.prose}>
              <ul>
                <li>Add dried seaweed to stocks and broths for umami depth</li>
                <li>Use as a seasoning — dried and crumbled over dishes</li>
                <li>Make seaweed butter or seaweed salt</li>
                <li>Include in salads (fresh or rehydrated)</li>
                <li>Wrap around fish before baking</li>
              </ul>
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
