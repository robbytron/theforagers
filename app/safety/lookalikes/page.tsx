import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Dangerous Lookalikes',
  description: 'The most commonly confused edible and poisonous species in Britain — critical knowledge for safe foraging.',
};

export default function LookalikesPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/safety">Safety</Link>
              <span>/</span>
              <span>Lookalikes</span>
            </nav>
            <h1 className={styles.title}>Dangerous <em>Lookalikes</em></h1>
            <p className={styles.subtitle}>
              The most commonly confused pairs in Britain.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <div className={styles.warning}>
            <p>
              <strong>These confusions kill people every year.</strong> Study these pairs
              carefully before foraging for any of the edible species listed.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Wild Garlic vs Lily of the Valley</h2>
            <div className={styles.prose}>
              <p>
                <strong>Edible:</strong> Wild garlic (Allium ursinum) — strong garlic smell when
                crushed, single leaf per stem from bulb.
              </p>
              <p>
                <strong>Deadly:</strong> Lily of the Valley (Convallaria majalis) — no smell,
                paired leaves from single stem, bell-shaped flowers.
              </p>
              <p>
                <strong>The test:</strong> Crush a leaf. Wild garlic smells unmistakably of garlic.
                Lily of the Valley has no smell.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Field Mushroom vs Yellow Stainer</h2>
            <div className={styles.prose}>
              <p>
                <strong>Edible:</strong> Field mushroom (Agaricus campestris) — flesh stays white
                or turns slightly pink when cut.
              </p>
              <p>
                <strong>Toxic:</strong> Yellow Stainer (Agaricus xanthodermus) — flesh turns
                bright chrome yellow when cut, especially at base of stem.
              </p>
              <p>
                <strong>The test:</strong> Cut the base of the stem. Yellow Stainer shows
                immediate bright yellow staining and has an unpleasant inky smell.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Chanterelle vs False Chanterelle</h2>
            <div className={styles.prose}>
              <p>
                <strong>Edible:</strong> Chanterelle (Cantharellus cibarius) — thick, forked ridges
                (not true gills), apricot smell, solid flesh.
              </p>
              <p>
                <strong>Mildly toxic:</strong> False Chanterelle (Hygrophoropsis aurantiaca) —
                thin, crowded, true gills, no distinctive smell.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Cow Parsley vs Hemlock</h2>
            <div className={styles.prose}>
              <p>
                <strong>Edible:</strong> Cow Parsley (Anthriscus sylvestris) — hairy stems,
                fern-like leaves, pleasant smell.
              </p>
              <p>
                <strong>Deadly:</strong> Hemlock (Conium maculatum) — smooth stems with purple
                blotches, musty unpleasant smell, hairless.
              </p>
              <p>
                <strong>The test:</strong> Look for purple spots on smooth stems — that&apos;s Hemlock.
                Never eat any umbelifer unless you are absolutely certain.
              </p>
            </div>
          </section>
        </article>

        <div className={styles.backLink}>
          <Link href="/safety">&larr; Back to Safety Guide</Link>
        </div>
      </main>
    </>
  );
}
