import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Toxic Fungi of Britain',
  description: 'The most dangerous poisonous mushrooms in Britain — identification and safety information for foragers.',
};

const TOXIC_FUNGI = [
  {
    name: 'Death Cap',
    latin: 'Amanita phalloides',
    description: 'Greenish cap, white gills, ring on stem, volva at base. Responsible for most fatal mushroom poisonings worldwide. One cap can kill.',
    danger: 'Deadly',
  },
  {
    name: 'Destroying Angel',
    latin: 'Amanita virosa',
    description: 'Pure white throughout. Ring on stem, volva at base. As deadly as Death Cap. Often mistaken for edible white mushrooms.',
    danger: 'Deadly',
  },
  {
    name: 'Funeral Bell',
    latin: 'Galerina marginata',
    description: 'Small brown mushroom on rotting wood. Contains same toxins as Death Cap. Often confused with edible species.',
    danger: 'Deadly',
  },
  {
    name: 'Deadly Webcap',
    latin: 'Cortinarius rubellus',
    description: 'Tawny-orange cap, rusty gills. Causes delayed kidney failure up to two weeks after ingestion.',
    danger: 'Deadly',
  },
  {
    name: 'Fool\'s Webcap',
    latin: 'Cortinarius orellanus',
    description: 'Similar to Deadly Webcap. Both cause irreversible kidney damage. Symptoms delayed by days.',
    danger: 'Deadly',
  },
  {
    name: 'Panther Cap',
    latin: 'Amanita pantherina',
    description: 'Brown cap with white warts. Causes severe poisoning with hallucinations and seizures. Can be fatal.',
    danger: 'Very toxic',
  },
  {
    name: 'Yellow Stainer',
    latin: 'Agaricus xanthodermus',
    description: 'Looks like field mushroom but stains bright yellow when cut. Causes severe gastrointestinal distress.',
    danger: 'Toxic',
  },
  {
    name: 'False Chanterelle',
    latin: 'Hygrophoropsis aurantiaca',
    description: 'Orange, funnel-shaped. Thinner, more crowded gills than true chanterelle. Causes gastric upset.',
    danger: 'Mildly toxic',
  },
];

export default function ToxicFungiPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/dangers">Dangers</Link>
              <span>/</span>
              <span>Toxic Fungi</span>
            </nav>
            <h1 className={styles.title}>Toxic <em>Fungi</em> of Britain</h1>
            <p className={styles.subtitle}>
              The mushrooms that kill and hospitalise. Know these before you pick any fungi.
            </p>
          </div>
        </header>

        <section className={styles.warning}>
          <div className={styles.warningInner}>
            <p>
              <strong>Warning:</strong> There is no simple test to distinguish edible from
              poisonous mushrooms. Folk remedies do not work. The only safe approach is
              positive identification of every single specimen.
            </p>
          </div>
        </section>

        <article className={styles.content}>
          <p className={styles.intro}>
            Fungi poisoning kills people every year in Britain. The deadliest species look
            innocuous — even appetising. Some cause symptoms only after days, when treatment
            options have narrowed. Never eat a mushroom you cannot identify with absolute certainty.
          </p>

          <div className={styles.speciesList}>
            {TOXIC_FUNGI.map((fungus) => (
              <div key={fungus.name} className={styles.speciesCard}>
                <h2 className={styles.speciesName}>{fungus.name}</h2>
                <p className={styles.speciesLatin}>{fungus.latin}</p>
                <p className={styles.speciesDesc}>{fungus.description}</p>
                <p className={styles.speciesDanger}>{fungus.danger}</p>
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
