import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Coastal Foraging',
  description: 'Foraging along Britain\'s coastline — seaweeds, samphire, sea vegetables, and coastal plants.',
};

const COASTAL_CATEGORIES = [
  {
    title: 'Seaweeds',
    description: 'Edible algae from the intertidal zone',
    species: [
      { name: 'Dulse', latin: 'Palmaria palmata', note: 'Rich, savoury flavour' },
      { name: 'Sea Lettuce', latin: 'Ulva lactuca', note: 'Mild, versatile green' },
      { name: 'Laver', latin: 'Porphyra umbilicalis', note: 'Welsh laverbread' },
      { name: 'Carrageen', latin: 'Chondrus crispus', note: 'Natural gelling agent' },
      { name: 'Kelp', latin: 'Laminaria digitata', note: 'Umami-rich, mineral dense' },
      { name: 'Bladderwrack', latin: 'Fucus vesiculosus', note: 'Traditional tonic' },
    ],
  },
  {
    title: 'Coastal Plants',
    description: 'Salt-tolerant plants of the shore',
    species: [
      { name: 'Samphire', latin: 'Salicornia europaea', note: 'Crunchy, salty, prized' },
      { name: 'Sea Beet', latin: 'Beta vulgaris maritima', note: 'Ancestor of beetroot' },
      { name: 'Sea Purslane', latin: 'Halimione portulacoides', note: 'Salt marsh succulent' },
      { name: 'Sea Kale', latin: 'Crambe maritima', note: 'Protected — observe only' },
      { name: 'Rock Samphire', latin: 'Crithmum maritimum', note: 'Strong aromatic flavour' },
      { name: 'Scurvy Grass', latin: 'Cochlearia officinalis', note: 'Peppery, vitamin C rich' },
    ],
  },
];

const SAFETY_TIPS = [
  {
    title: 'Check Tide Times',
    content: 'Know when high and low tides occur. Many foraging spots become dangerous or inaccessible at high tide.',
  },
  {
    title: 'Water Quality',
    content: 'Check local water quality before harvesting. Avoid areas near sewage outflows, industrial discharge, or heavy boat traffic.',
  },
  {
    title: 'Stable Footing',
    content: 'Rocks can be slippery with algae. Wear appropriate footwear and move carefully. Never turn your back on the sea.',
  },
  {
    title: 'Sustainable Harvest',
    content: 'Cut seaweeds rather than pulling up holdfasts. Leave plenty behind and don\'t harvest the same spot repeatedly.',
  },
];

export default function CoastalPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Sea &amp; Shore</p>
          <h1 className={styles.title}>Coastal <em>Foraging</em></h1>
          <p className={styles.intro}>
            Britain&apos;s 11,000 miles of coastline offer unique foraging opportunities.
            From seaweeds to salt marsh plants, the shore provides foods found nowhere else.
          </p>
        </header>

        <section className={styles.intro2}>
          <p>
            Coastal foraging requires understanding tides, water quality, and the specific
            habitats where these species thrive. The rewards — unique flavours and exceptional
            nutrition — are well worth the extra preparation.
          </p>
        </section>

        <section className={styles.categories}>
          {COASTAL_CATEGORIES.map((category) => (
            <div key={category.title} className={styles.category}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <p className={styles.categoryDesc}>{category.description}</p>
              </div>
              <div className={styles.speciesGrid}>
                {category.species.map((species) => (
                  <div key={species.name} className={styles.speciesCard}>
                    <h3 className={styles.speciesName}>{species.name}</h3>
                    <p className={styles.speciesLatin}>{species.latin}</p>
                    <p className={styles.speciesNote}>{species.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className={styles.safety}>
          <h2 className={styles.safetyTitle}>Coastal Safety</h2>
          <div className={styles.safetyGrid}>
            {SAFETY_TIPS.map((tip) => (
              <div key={tip.title} className={styles.safetyCard}>
                <h3 className={styles.safetyCardTitle}>{tip.title}</h3>
                <p className={styles.safetyCardContent}>{tip.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.habitats}>
          <h2 className={styles.habitatsTitle}>Coastal Habitats</h2>
          <div className={styles.habitatsList}>
            <div className={styles.habitatItem}>
              <h3>Rocky Shore</h3>
              <p>Home to most edible seaweeds. Best harvested at low spring tides when lower zones are exposed.</p>
            </div>
            <div className={styles.habitatItem}>
              <h3>Salt Marsh</h3>
              <p>Where samphire and sea purslane grow. Tidal, muddy, and ecologically sensitive — tread carefully.</p>
            </div>
            <div className={styles.habitatItem}>
              <h3>Sand Dunes</h3>
              <p>Sea holly, sea rocket, and other pioneers. Often protected — check local regulations.</p>
            </div>
            <div className={styles.habitatItem}>
              <h3>Shingle & Cliffs</h3>
              <p>Rock samphire and sea kale territory. Be aware of unstable ground and falling rocks.</p>
            </div>
          </div>
        </section>

        <section className={styles.links}>
          <h2 className={styles.linksTitle}>Related</h2>
          <div className={styles.linksGrid}>
            <Link href="/species" className={styles.linkCard}>
              <h3>Species Guide</h3>
              <p>Full details on coastal species.</p>
            </Link>
            <Link href="/calendar" className={styles.linkCard}>
              <h3>Seasonal Calendar</h3>
              <p>When to find coastal species.</p>
            </Link>
            <Link href="/safety" className={styles.linkCard}>
              <h3>Safety Guide</h3>
              <p>General foraging safety.</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
