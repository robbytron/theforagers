'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { JournalEntry, JournalCategory } from '@/types';
import styles from './page.module.css';

const CATEGORIES: { slug: string; title: string; category: JournalCategory; image: string }[] = [
  {
    slug: 'in-season',
    title: 'In Season',
    category: 'In Season',
    image: '/journal/categories/in-season-card.png',
  },
  {
    slug: 'the-field',
    title: 'From The Field',
    category: 'From The Field',
    image: '/journal/categories/from-the-field-card.png',
  },
  {
    slug: 'the-land',
    title: 'The Land',
    category: 'The Land',
    image: '/journal/categories/the-land-card.png',
  },
  {
    slug: 'wild-table',
    title: 'The Wild Table',
    category: 'The Wild Table',
    image: '/journal/categories/the-wild-table-card.png',
  },
];

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface JournalClientProps {
  entries: JournalEntry[];
}

export default function JournalClient({ entries }: JournalClientProps) {
  const [activeCategory, setActiveCategory] = useState<JournalCategory | 'all'>('all');

  const filteredEntries = activeCategory === 'all'
    ? entries
    : entries.filter(e => e.category === activeCategory);

  return (
    <main className={styles.page}>
      {/* Hero */}
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>The Journal</h1>
        <p className={styles.heroIntro}>
          Four perspectives on wild food in Britain — seasonal guides, field notes, essays on landscape, and recipes from the kitchen.
        </p>
      </header>

      {/* Category Filters */}
      <section className={styles.filters}>
        <div className={styles.filtersInner}>
          <button
            className={`${styles.filterAll} ${activeCategory === 'all' ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          <div className={styles.filterCategories}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                className={`${styles.filterCard} ${activeCategory === cat.category ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat.category)}
              >
                <img src={cat.image} alt={cat.title} className={styles.filterImage} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className={styles.articles}>
        <div className={styles.articlesInner}>
          {filteredEntries.length === 0 ? (
            <div className={styles.noArticles}>
              <p>No articles yet in this category. Check back soon.</p>
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {filteredEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.slug}`}
                  className={styles.articleCard}
                >
                  <span className={styles.articleCategory}>{entry.category}</span>
                  <h2 className={styles.articleTitle}>{entry.title}</h2>
                  <p className={styles.articleExcerpt}>{entry.excerpt}</p>
                  <div className={styles.articleMeta}>
                    {formatDate(entry.publishDate) && <span>{formatDate(entry.publishDate)}</span>}
                    <span>{getReadingTime(entry.body)} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Start Exploring</h2>
        <p className={styles.ctaText}>
          New to foraging? Begin with our species guide or check what's in season this month.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/species" className={styles.ctaButton}>Species Guide</Link>
          <Link href="/journal/in-season" className={styles.ctaButtonAlt}>What's In Season</Link>
        </div>
      </section>
    </main>
  );
}
