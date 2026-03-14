import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Foraging Guides',
  description: 'In-depth guides for foraging in Britain — from mushroom hunting to seasonal harvesting techniques.',
};

const GUIDE_CATEGORIES = [
  {
    title: 'Getting Started',
    description: 'Essential knowledge for new foragers',
    guides: [
      { title: 'Your First Foraging Trip', description: 'What to bring, where to go, and how to start safely.' },
      { title: 'Building Your Kit', description: 'The tools and equipment every forager needs.' },
      { title: 'Identification Basics', description: 'How to approach plant and fungi identification systematically.' },
    ],
  },
  {
    title: 'Seasonal Guides',
    description: 'What to look for throughout the year',
    guides: [
      { title: 'Spring Foraging', description: 'Wild garlic, nettles, and the first greens of the year.' },
      { title: 'Summer Abundance', description: 'Berries, flowers, and coastal harvests.' },
      { title: 'Autumn Mushrooms', description: 'The fungi forager\'s favourite season.' },
      { title: 'Winter Foraging', description: 'What\'s still available when the land sleeps.' },
    ],
  },
  {
    title: 'Habitat Guides',
    description: 'Foraging by environment',
    guides: [
      { title: 'Woodland Foraging', description: 'Trees, fungi, and forest floor plants.' },
      { title: 'Hedgerow Harvests', description: 'The bounty of Britain\'s field margins.' },
      { title: 'Urban Foraging', description: 'Finding wild food in towns and cities.' },
      { title: 'Meadow & Grassland', description: 'Wildflowers and herbs of open spaces.' },
    ],
  },
  {
    title: 'Special Topics',
    description: 'Deep dives into specific areas',
    guides: [
      { title: 'Mushroom Hunting', description: 'A beginner\'s guide to fungi foraging.' },
      { title: 'Edible Flowers', description: 'Using flowers in cooking and drinks.' },
      { title: 'Wild Teas & Infusions', description: 'Making drinks from foraged plants.' },
      { title: 'Foraging with Children', description: 'Introducing young people to wild food.' },
    ],
  },
];

export default function GuidesPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Learn</p>
          <h1 className={styles.title}>Foraging <em>Guides</em></h1>
          <p className={styles.intro}>
            In-depth guides to help you forage confidently and safely. From your first trip
            to advanced techniques, we&apos;ve got you covered.
          </p>
        </header>

        <section className={styles.featured}>
          <Link href="/beginners" className={styles.featuredCard}>
            <span className={styles.featuredLabel}>Start Here</span>
            <h2 className={styles.featuredTitle}>Beginner&apos;s Guide</h2>
            <p className={styles.featuredDesc}>
              New to foraging? Start with our comprehensive introduction to wild food in Britain.
            </p>
            <span className={styles.featuredLink}>Read the guide &rarr;</span>
          </Link>
        </section>

        <section className={styles.categories}>
          {GUIDE_CATEGORIES.map((category) => (
            <div key={category.title} className={styles.category}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <p className={styles.categoryDesc}>{category.description}</p>
              </div>
              <div className={styles.guideGrid}>
                {category.guides.map((guide) => (
                  <div key={guide.title} className={styles.guideCard}>
                    <h3 className={styles.guideTitle}>{guide.title}</h3>
                    <p className={styles.guideDesc}>{guide.description}</p>
                    <span className={styles.comingSoon}>Coming soon</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Looking for species information?</h2>
          <p className={styles.ctaDesc}>
            Our species guide covers over 200 edible plants, fungi, and seaweeds with detailed
            identification notes and culinary guidance.
          </p>
          <Link href="/species" className={styles.ctaButton}>Browse Species Guide</Link>
        </section>
      </main>
    </>
  );
}
