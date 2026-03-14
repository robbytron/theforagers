import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Poisonous Plants of Britain',
  description: 'The most dangerous poisonous plants in Britain that foragers need to recognise and avoid.',
};

const POISONOUS_PLANTS = [
  {
    name: 'Hemlock',
    latin: 'Conium maculatum',
    description: 'Tall umbelifer with purple-spotted stems. All parts highly toxic. Causes respiratory paralysis. Often confused with wild carrot or cow parsley.',
    danger: 'Deadly',
  },
  {
    name: 'Giant Hogweed',
    latin: 'Heracleum mantegazzianum',
    description: 'Massive umbelifer up to 5m tall. Sap causes severe burns and photosensitivity. Contact with skin in sunlight causes blistering.',
    danger: 'Severe burns',
  },
  {
    name: 'Foxglove',
    latin: 'Digitalis purpurea',
    description: 'Tall spikes of purple tubular flowers. Contains cardiac glycosides affecting the heart. All parts toxic, especially leaves.',
    danger: 'Deadly',
  },
  {
    name: 'Deadly Nightshade',
    latin: 'Atropa belladonna',
    description: 'Bushy plant with dull purple flowers and shiny black berries. All parts extremely toxic. Berries attractive but lethal.',
    danger: 'Deadly',
  },
  {
    name: 'Monkshood',
    latin: 'Aconitum napellus',
    description: 'Tall spikes of hooded purple-blue flowers. One of Britain\'s most toxic plants. Even handling can cause numbness.',
    danger: 'Deadly',
  },
  {
    name: 'Lords-and-Ladies',
    latin: 'Arum maculatum',
    description: 'Distinctive hooded flower and bright red berries in autumn. Contains calcium oxalate crystals causing intense burning.',
    danger: 'Toxic',
  },
  {
    name: 'Lily of the Valley',
    latin: 'Convallaria majalis',
    description: 'Fragrant white bell flowers, broad leaves. Contains cardiac glycosides. Can be confused with wild garlic leaves.',
    danger: 'Deadly',
  },
  {
    name: 'Hemlock Water Dropwort',
    latin: 'Oenanthe crocata',
    description: 'Waterside umbelifer. Britain\'s most poisonous plant. Roots resemble parsnips. Extremely dangerous.',
    danger: 'Deadly',
  },
];

export default function PoisonousPlantsPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/dangers">Dangers</Link>
              <span>/</span>
              <span>Poisonous Plants</span>
            </nav>
            <h1 className={styles.title}>Poisonous <em>Plants</em> of Britain</h1>
            <p className={styles.subtitle}>
              These are the most dangerous plants a forager might encounter. Learn to recognise
              them before you learn anything else.
            </p>
          </div>
        </header>

        <section className={styles.warning}>
          <div className={styles.warningInner}>
            <p>
              <strong>Warning:</strong> Several of these plants can kill with a single mouthful.
              Others cause severe injury from skin contact alone. Do not touch or handle
              unfamiliar plants.
            </p>
          </div>
        </section>

        <article className={styles.content}>
          <p className={styles.intro}>
            Britain is home to several extremely dangerous plants. Some are common, growing in
            hedgerows and gardens. Others resemble edible species closely enough to cause fatal
            confusion. Know these before you forage.
          </p>

          <div className={styles.speciesList}>
            {POISONOUS_PLANTS.map((plant) => (
              <div key={plant.name} className={styles.speciesCard}>
                <h2 className={styles.speciesName}>{plant.name}</h2>
                <p className={styles.speciesLatin}>{plant.latin}</p>
                <p className={styles.speciesDesc}>{plant.description}</p>
                <p className={styles.speciesDanger}>{plant.danger}</p>
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
