import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'First 10 Species to Learn',
  description: 'The ten best species for beginner foragers — easy to identify, no dangerous lookalikes, and delicious to eat.',
};

const FIRST_TEN = [
  { name: 'Wild Garlic', latin: 'Allium ursinum', description: 'Unmistakable garlic smell when crushed. Broad leaves, white flowers. Abundant in spring woodlands.' },
  { name: 'Nettle', latin: 'Urtica dioica', description: 'Everyone knows nettles. Young tops in spring make excellent soup. Gloves essential!' },
  { name: 'Blackberry', latin: 'Rubus fruticosus', description: 'Britain\'s most foraged fruit. No lookalikes. Available August to October.' },
  { name: 'Elder', latin: 'Sambucus nigra', description: 'Elderflowers in June, elderberries in September. Must be cooked. Learn to recognise the tree.' },
  { name: 'Hawthorn', latin: 'Crataegus monogyna', description: 'Young leaves (bread and cheese), flowers, and berries all edible. Common hedgerow tree.' },
  { name: 'Wood Sorrel', latin: 'Oxalis acetosella', description: 'Shamrock-shaped leaves with pleasant lemony tang. Shady woodland floors.' },
  { name: 'Dandelion', latin: 'Taraxacum officinale', description: 'Leaves, flowers, and roots all edible. Common everywhere. No lookalikes.' },
  { name: 'Chickweed', latin: 'Stellaria media', description: 'Mild salad green available almost year-round. Look for single line of hairs on stem.' },
  { name: 'Sweet Chestnut', latin: 'Castanea sativa', description: 'Spiny cases, glossy brown nuts. Roast or boil. Not horse chestnut (which is toxic).' },
  { name: 'Rosehips', latin: 'Rosa canina', description: 'Bright red hips in autumn. Make into syrup. Remove irritating hairs before use.' },
];

export default function FirstTenPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/beginners">Beginners</Link>
              <span>/</span>
              <span>First 10 Species</span>
            </nav>
            <h1 className={styles.title}>First <em>10 Species</em></h1>
            <p className={styles.subtitle}>
              Master these and you&apos;ll always find something edible.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <p className={styles.intro}>
            These species are ideal for beginners: easy to identify, no dangerous lookalikes,
            widely available, and genuinely good to eat. Learn them properly before moving on.
          </p>

          <div className={styles.speciesList}>
            {FIRST_TEN.map((species, i) => (
              <div key={species.name} className={styles.speciesCard}>
                <h2 className={styles.speciesName}>{i + 1}. {species.name}</h2>
                <p className={styles.speciesLatin}>{species.latin}</p>
                <p className={styles.speciesDesc}>{species.description}</p>
              </div>
            ))}
          </div>
        </article>

        <div className={styles.backLink}>
          <Link href="/beginners">&larr; Back to Beginners Guide</Link>
        </div>
      </main>
    </>
  );
}
