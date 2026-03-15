import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/ui/Nav';
import { getJournalEntryBySlug, getAllJournalSlugs } from '@/lib/airtable';
import styles from './page.module.css';

export const revalidate = 3600;

// Specific hero images for articles
const ARTICLE_IMAGES: Record<string, string> = {
  'march-the-first-real-push-of-spring': '/journal/march-spring-1.png',
  'the-blackbird-at-dusk': '/journal/blackbird-1.png',
};

// Fallback images by category
const CATEGORY_IMAGES: Record<string, string> = {
  'In Season': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
  'The Field': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80',
  'The Land': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80',
  'Wild Table': 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=1600&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&q=80';

export async function generateStaticParams() {
  const slugs = await getAllJournalSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.seoTitle || entry.title,
    description: entry.seoDescription || entry.excerpt,
  };
}

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry) notFound();

  const categorySlug = entry.category.toLowerCase().replace(/\s+/g, '-');

  // Get hero image: specific article image > entry hero > category fallback > default
  const heroImageUrl = ARTICLE_IMAGES[slug]
    || entry.heroImage?.url
    || CATEGORY_IMAGES[entry.category]
    || DEFAULT_IMAGE;

  // Format date
  const formattedDate = entry.publishDate
    ? new Date(entry.publishDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null;

  // Split body into paragraphs
  const paragraphs = entry.body.split('\n\n').filter(p => p.trim());

  return (
    <div className={styles.page}>
      <Nav />

      {/* Hero Image - clean, no text */}
      <div className={styles.heroImage}>
        <Image
          src={heroImageUrl}
          alt={entry.title}
          fill
          priority
          sizes="100vw"
        />
      </div>

      {/* Header - below image */}
      <header className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Link href="/journal">Journal</Link>
          <span>/</span>
          <Link href={`/journal/${categorySlug}`}>{entry.category}</Link>
        </div>

        <div className={styles.meta}>
          <span>The Foragers</span>
          {formattedDate && (
            <>
              <span className={styles.metaDivider} />
              <span>{formattedDate}</span>
            </>
          )}
        </div>

        <h1 className={styles.title}>{entry.title}</h1>
      </header>

      {/* Article Content */}
      <article className={styles.article}>
        <div className={styles.content}>
          {paragraphs.map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className={styles.heading}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i} className={styles.subheading}>{paragraph.replace('### ', '')}</h3>;
            }
            return <p key={i} className={styles.paragraph}>{paragraph}</p>;
          })}
        </div>

        <footer className={styles.footer}>
          <Link href="/journal" className={styles.backLink}>← Back to Journal</Link>
          <Link href={`/journal/${categorySlug}`} className={styles.category}>{entry.category}</Link>
        </footer>
      </article>
    </div>
  );
}
