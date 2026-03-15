import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Dangerous Berries of Britain',
  description: 'Toxic berries and fruits found in Britain — identification guide for foragers to stay safe.',
};

const DANGEROUS_BERRIES = [
  {
    name: 'Yew Berries',
    latin: 'Taxus baccata',
    description: 'Red berry-like arils on dark evergreen tree. The seed inside is deadly toxic, as are leaves and bark. The flesh is the only non-toxic part.',
    danger: 'Deadly',
  },
  {
    name: 'Deadly Nightshade',
    latin: 'Atropa belladonna',
    description: 'Shiny black berries, cherry-sized. Sweet taste makes them attractive to children. A handful can kill an adult.',
    danger: 'Deadly',
  },
  {
    name: 'Woody Nightshade',
    latin: 'Solanum dulcamara',
    description: 'Red berries in clusters on climbing vine. Less toxic than Deadly Nightshade but still dangerous, especially to children.',
    danger: 'Toxic',
  },
  {
    name: 'Lords-and-Ladies',
    latin: 'Arum maculatum',
    description: 'Bright red berries in autumn on a spike. Extremely attractive appearance. Causes intense burning and swelling of mouth and throat.',
    danger: 'Toxic',
  },
  {
    name: 'Mezereon',
    latin: 'Daphne mezereum',
    description: 'Bright red berries on leafless stems in spring. Extremely toxic — a few berries can kill a child. Also found as garden ornamental.',
    danger: 'Deadly',
  },
  {
    name: 'Spindle',
    latin: 'Euonymus europaeus',
    description: 'Distinctive pink and orange berries. Attractive appearance but toxic, causing violent vomiting and diarrhoea.',
    danger: 'Toxic',
  },
  {
    name: 'Privet',
    latin: 'Ligustrum spp.',
    description: 'Black berries on common hedging plant. Mildly toxic, causing gastric upset. Often accessible to children.',
    danger: 'Mildly toxic',
  },
  {
    name: 'Raw Elderberries',
    latin: 'Sambucus nigra',
    description: 'Raw berries and all green parts contain cyanogenic glycosides. Must be cooked before eating. Ripe, cooked berries are safe.',
    danger: 'Toxic when raw',
  },
];

export default function DangerousBerriesPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1666464278818-39435c15eb8b?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/dangers">Dangers</Link>
              <span>/</span>
              <span>Dangerous Berries</span>
            </nav>
            <h1 className={styles.title}>Dangerous <em>Berries</em> of Britain</h1>
            <p className={styles.subtitle}>
              Toxic berries and fruits that foragers must learn to recognise and avoid.
            </p>
          </div>
        </header>

        <section className={styles.warning}>
          <div className={styles.warningInner}>
            <p>
              <strong>Warning:</strong> Many toxic berries are brightly coloured and attractive.
              Some taste sweet. Children are particularly at risk. Never eat any berry you
              cannot positively identify.
            </p>
          </div>
        </section>

        <article className={styles.content}>
          <p className={styles.intro}>
            Britain&apos;s hedgerows and woodlands contain many toxic berries alongside the edible
            ones. Some are deadly; others cause severe illness. Several look superficially similar
            to safe species. Learn these dangers before you forage for fruit.
          </p>

          <div className={styles.speciesList}>
            {DANGEROUS_BERRIES.map((berry) => (
              <div key={berry.name} className={styles.speciesCard}>
                <h2 className={styles.speciesName}>{berry.name}</h2>
                <p className={styles.speciesLatin}>{berry.latin}</p>
                <p className={styles.speciesDesc}>{berry.description}</p>
                <p className={styles.speciesDanger}>{berry.danger}</p>
              </div>
            ))}
          </div>
        </article>

        <div className={styles.backLink}>
          <Link href="/dangers">&larr; Back to Dangers</Link>
        </div>
      </main>
    </>
  );
}
