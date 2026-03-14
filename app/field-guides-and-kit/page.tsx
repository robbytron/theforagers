import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Field Guides & Kit',
  description: 'Recommended field guides, foraging equipment, and wild food cookbooks for British foragers.',
};

const FIELD_GUIDES = [
  {
    title: 'Food for Free',
    author: 'Richard Mabey',
    description: 'The classic that started it all. Comprehensive coverage of British wild food with excellent illustrations.',
    category: 'General',
  },
  {
    title: 'The Forager Handbook',
    author: 'Miles Irving',
    description: 'Detailed species accounts with outstanding culinary guidance. The professional forager\'s reference.',
    category: 'General',
  },
  {
    title: 'Mushrooms',
    author: 'Roger Phillips',
    description: 'The definitive British fungi guide. Essential for anyone serious about mushroom foraging.',
    category: 'Fungi',
  },
  {
    title: 'Collins Wild Flower Guide',
    author: 'David Streeter',
    description: 'Comprehensive botanical identification. The standard reference for British plants.',
    category: 'Plants',
  },
  {
    title: 'Seaweeds of Britain and Ireland',
    author: 'Francis Bunker et al.',
    description: 'The authoritative guide to British seaweeds. Essential for coastal foragers.',
    category: 'Coastal',
  },
  {
    title: 'River Cottage Handbook: Mushrooms',
    author: 'John Wright',
    description: 'Accessible introduction to fungi foraging with excellent photographs and recipes.',
    category: 'Fungi',
  },
];

const KIT_ITEMS = [
  {
    name: 'Foraging Basket',
    description: 'Traditional wicker or willow trug. Allows air circulation, prevents crushing. The classic choice.',
  },
  {
    name: 'Mushroom Knife',
    description: 'Curved blade with integrated brush. Clean cuts and in-field cleaning in one tool.',
  },
  {
    name: 'Hand Lens (10x)',
    description: 'Essential for examining spores, gill attachment, and fine identification features.',
  },
  {
    name: 'Paper Bags',
    description: 'For separating specimens and keeping fungi fresh. Paper breathes; plastic sweats.',
  },
  {
    name: 'Secateurs',
    description: 'For woody stems, elderflower heads, and clean cuts that help plants recover.',
  },
  {
    name: 'Field Notebook',
    description: 'Waterproof paper preferred. Record locations, conditions, and build your foraging diary.',
  },
];

const COOKBOOKS = [
  {
    title: 'The Wild Food Cookbook',
    author: 'Roger Phillips',
    description: 'Companion to his identification guides. Practical recipes for wild ingredients.',
  },
  {
    title: 'Abundance',
    author: 'Alys Fowler',
    description: 'Modern approach to wild and foraged cooking. Accessible and inspiring.',
  },
  {
    title: 'The Hedgerow Handbook',
    author: 'Adele Nozedar',
    description: 'Recipes and remedies from the hedgerow. Traditional knowledge beautifully presented.',
  },
];

export default function FieldGuidesAndKitPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Recommended</p>
          <h1 className={styles.title}>Field Guides <em>& Kit</em></h1>
          <p className={styles.intro}>
            The books we trust and the equipment we use. Curated recommendations for
            British foragers.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Field Guides</h2>
          <p className={styles.sectionIntro}>
            Physical guides work when phones fail. These are the books worth owning.
          </p>
          <div className={styles.grid}>
            {FIELD_GUIDES.map((guide) => (
              <div key={guide.title} className={styles.card}>
                <span className={styles.category}>{guide.category}</span>
                <h3 className={styles.cardTitle}>{guide.title}</h3>
                <p className={styles.cardAuthor}>{guide.author}</p>
                <p className={styles.cardDesc}>{guide.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Essential Kit</h2>
          <p className={styles.sectionIntro}>
            Quality equipment makes foraging safer and more enjoyable.
          </p>
          <div className={styles.kitGrid}>
            {KIT_ITEMS.map((item) => (
              <div key={item.name} className={styles.kitCard}>
                <h3 className={styles.kitName}>{item.name}</h3>
                <p className={styles.kitDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cookbooks</h2>
          <p className={styles.sectionIntro}>
            Wild food cookbooks worth owning.
          </p>
          <div className={styles.grid}>
            {COOKBOOKS.map((book) => (
              <div key={book.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{book.title}</h3>
                <p className={styles.cardAuthor}>{book.author}</p>
                <p className={styles.cardDesc}>{book.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.note}>
          <p>
            <strong>Note:</strong> We may earn a small commission from purchases made through
            our links. This helps support the site at no extra cost to you. We only recommend
            products we genuinely use and trust.
          </p>
        </section>
      </main>
    </>
  );
}
