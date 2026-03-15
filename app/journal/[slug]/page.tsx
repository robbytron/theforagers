import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/ui/Nav';
import { getJournalEntryBySlug, getAllJournalSlugs } from '@/lib/airtable';
import styles from './page.module.css';

export const revalidate = 3600;

// Placeholder images by category
const PLACEHOLDER_IMAGES: Record<string, string> = {
  'In Season': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
  'The Field': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80',
  'The Land': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80',
  'Wild Table': 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=1600&q=80',
};

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&q=80';

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
  const heroImageUrl = entry.heroImage?.url || PLACEHOLDER_IMAGES[entry.category] || DEFAULT_PLACEHOLDER;

  // Split body into paragraphs
  const paragraphs = entry.body.split('\n\n');

  return (
    <div className={styles.page}>
      <Nav />

      {/* Hero Header with Image */}
      <header className={styles.heroHeader}>
        <div className={styles.heroImage}>
          <Image
            src={heroImageUrl}
            alt={entry.title}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.breadcrumbs}>
            <Link href="/journal">Journal</Link>
            <span>/</span>
            <Link href={`/journal/${categorySlug}`}>{entry.category}</Link>
          </div>
          <h1 className={styles.title}>{entry.title}</h1>
          {entry.excerpt && <p className={styles.excerpt}>{entry.excerpt}</p>}
          <div className={styles.meta}>
            <span>{entry.category}</span>
            {entry.publishDate && (
              <>
                <span>·</span>
                <span>{new Date(entry.publishDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className={styles.article}>
        <div className={styles.content}>
          {paragraphs.map((paragraph, i) => {
            // Handle headings
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className={styles.heading}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i} className={styles.subheading}>{paragraph.replace('### ', '')}</h3>;
            }
            // First paragraph gets special treatment
            if (i === 0) {
              return <p key={i} className={styles.leadParagraph}>{paragraph}</p>;
            }
            // Regular paragraphs
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
