import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'The Foragers Journal — seasonal notes, foraging stories, and updates from the field.',
};

// Placeholder articles until Airtable is populated
const PLACEHOLDER_ARTICLES = [
  {
    title: 'Spring Has Arrived',
    excerpt: 'The first wild garlic is emerging in the woodlands. Here\'s what we\'re finding this week.',
    date: 'March 2024',
    category: 'Seasonal Notes',
  },
  {
    title: 'A Guide to Your First Forage',
    excerpt: 'Nervous about your first foraging trip? Here\'s everything you need to know to get started safely.',
    date: 'February 2024',
    category: 'Guides',
  },
  {
    title: 'The Ethics of Mushroom Hunting',
    excerpt: 'As fungi foraging grows in popularity, how do we ensure sustainable harvests?',
    date: 'January 2024',
    category: 'Opinion',
  },
];

export default function JournalPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>From the Field</p>
          <h1 className={styles.title}>The <em>Journal</em></h1>
          <p className={styles.intro}>
            Seasonal notes, foraging stories, and reflections on wild food in Britain.
          </p>
        </header>

        <section className={styles.categories}>
          <h2 className={styles.categoriesTitle}>Browse by Category</h2>
          <div className={styles.categoryGrid}>
            <Link href="/journal/in-season" className={styles.categoryCard}>
              <h3>In Season</h3>
              <p>Monthly dispatches on what&apos;s growing, what&apos;s ready, and what&apos;s worth finding right now.</p>
            </Link>
            <Link href="/journal/the-field" className={styles.categoryCard}>
              <h3>The Field</h3>
              <p>Notes from foraging expeditions — what we found, where we went, and what we learned.</p>
            </Link>
            <Link href="/journal/the-land" className={styles.categoryCard}>
              <h3>The Land</h3>
              <p>Essays on the British landscape, ecology, and our relationship with the land we forage.</p>
            </Link>
            <Link href="/journal/wild-table" className={styles.categoryCard}>
              <h3>Wild Table</h3>
              <p>Cooking with foraged ingredients — meals, experiments, and lessons from the kitchen.</p>
            </Link>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.comingSoon}>
            <h2>Coming Soon</h2>
            <p>
              We&apos;re building our journal with articles on seasonal foraging, traditional
              knowledge, and stories from the field. Check back soon for our first posts.
            </p>
          </div>

          <div className={styles.preview}>
            <h3 className={styles.previewTitle}>What to Expect</h3>
            <div className={styles.articleGrid}>
              {PLACEHOLDER_ARTICLES.map((article, i) => (
                <article key={i} className={styles.articleCard}>
                  <span className={styles.articleCategory}>{article.category}</span>
                  <h4 className={styles.articleTitle}>{article.title}</h4>
                  <p className={styles.articleExcerpt}>{article.excerpt}</p>
                  <span className={styles.articleDate}>{article.date}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.subscribe}>
          <h2 className={styles.subscribeTitle}>Stay Updated</h2>
          <p className={styles.subscribeDesc}>
            Want to know when we publish new articles? Follow along as we build The Foragers.
          </p>
          <div className={styles.subscribeActions}>
            <Link href="/species" className={styles.subscribeButton}>
              Explore the Species Guide
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
