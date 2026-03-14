import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Prepare & Preserve',
  description: 'Techniques for preparing and preserving wild foods — drying, pickling, fermenting, and storing your foraged harvest.',
};

const TECHNIQUES = [
  {
    title: 'Drying',
    description: 'Remove moisture to preserve herbs, mushrooms, and fruits for long-term storage.',
    details: [
      'Best for: Herbs, mushrooms, berries, rose hips',
      'Methods: Air drying, oven drying, dehydrator',
      'Storage: Airtight containers, cool dark place',
      'Shelf life: 6-12 months when properly dried',
    ],
  },
  {
    title: 'Freezing',
    description: 'The simplest preservation method for many wild foods.',
    details: [
      'Best for: Berries, blanched greens, prepared dishes',
      'Methods: Flash freeze, then bag; or freeze in portions',
      'Tips: Blanch greens before freezing; spread berries on trays first',
      'Shelf life: 6-12 months',
    ],
  },
  {
    title: 'Pickling',
    description: 'Use vinegar or brine to preserve and add flavour.',
    details: [
      'Best for: Samphire, wild garlic buds, mushrooms, walnuts',
      'Methods: Quick pickle, fermented pickle, preserved in oil',
      'Storage: Refrigerate quick pickles; fermented can be cool-stored',
      'Shelf life: Weeks to months depending on method',
    ],
  },
  {
    title: 'Fermenting',
    description: 'Harness beneficial bacteria for preservation and enhanced nutrition.',
    details: [
      'Best for: Wild garlic, nettles, elderflower, berries (for wine)',
      'Methods: Lacto-fermentation, wild fermentation, vinegar making',
      'Tips: Use salt to control fermentation; keep submerged',
      'Shelf life: Months when properly fermented',
    ],
  },
  {
    title: 'Syrups & Cordials',
    description: 'Capture flavours in sugar-preserved liquids.',
    details: [
      'Best for: Elderflower, rose petals, berries, herbs',
      'Methods: Hot infusion, cold infusion, reduction',
      'Storage: Refrigerate; add citric acid for longer life',
      'Shelf life: 2-4 weeks refrigerated; longer with preservatives',
    ],
  },
  {
    title: 'Jams & Jellies',
    description: 'Traditional preservation using sugar and pectin.',
    details: [
      'Best for: Berries, rose hips, crab apples, elderberries',
      'Methods: Standard jam, low-sugar jam, fruit butter',
      'Tips: Test for set; use high-pectin fruits or add pectin',
      'Shelf life: 1 year unopened; refrigerate after opening',
    ],
  },
];

const SAFETY_NOTES = [
  'Always positively identify species before preserving',
  'Some wild foods require cooking before preservation — check species requirements',
  'Use clean equipment and proper sterilisation for jars',
  'When in doubt about a preserved food, throw it out',
  'Label everything with contents and date',
];

export default function PreserveAndPreparePage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Make It Last</p>
          <h1 className={styles.title}>Prepare &amp; <em>Preserve</em></h1>
          <p className={styles.intro}>
            Wild foods are seasonal and fleeting. These preservation techniques let you enjoy
            your harvest throughout the year.
          </p>
        </header>

        <section className={styles.intro2}>
          <p>
            The key to preserving wild foods is working quickly. Most foraged items deteriorate
            rapidly — process your harvest as soon as possible after picking for the best results.
          </p>
        </section>

        <section className={styles.techniques}>
          <h2 className={styles.sectionTitle}>Preservation Techniques</h2>
          <div className={styles.techGrid}>
            {TECHNIQUES.map((tech) => (
              <div key={tech.title} className={styles.techCard}>
                <h3 className={styles.techTitle}>{tech.title}</h3>
                <p className={styles.techDesc}>{tech.description}</p>
                <ul className={styles.techDetails}>
                  {tech.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.safety}>
          <h2 className={styles.safetyTitle}>Safety Notes</h2>
          <ul className={styles.safetyList}>
            {SAFETY_NOTES.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>

        <section className={styles.links}>
          <h2 className={styles.linksTitle}>Related</h2>
          <div className={styles.linksGrid}>
            <Link href="/recipes" className={styles.linkCard}>
              <h3>Recipes</h3>
              <p>Put your preserved foods to use.</p>
            </Link>
            <Link href="/species" className={styles.linkCard}>
              <h3>Species Guide</h3>
              <p>Find species to forage and preserve.</p>
            </Link>
            <Link href="/calendar" className={styles.linkCard}>
              <h3>Seasonal Calendar</h3>
              <p>Know when to harvest.</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
