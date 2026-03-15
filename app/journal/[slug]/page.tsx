import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/ui/Nav';
import { getJournalEntryBySlug, getAllJournalSlugs } from '@/lib/airtable';
import styles from './page.module.css';

export const revalidate = 3600;

// Custom hero images for specific articles
const ARTICLE_HERO_IMAGES: Record<string, string> = {
  'the-blackbird-at-dusk': '/journal/blackbird-hero.png',
};

// Inline images for articles
const ARTICLE_INLINE_IMAGES: Record<string, string[]> = {
  'the-blackbird-at-dusk': [
    '/journal/blackbird-1.png',
    '/journal/blackbird-2.png',
    '/journal/blackbird-3.png',
  ],
};

// Fallback images by category
const CATEGORY_IMAGES: Record<string, string> = {
  'In Season': '/journal/categories/in-season-wide.png',
  'From The Field': '/journal/categories/from-the-field-wide.png',
  'The Land': '/journal/categories/the-land-wide.jpg',
  'The Wild Table': '/journal/categories/the-wild-table-wide.png',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&q=80';

// Calculate reading time
function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

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

  // Get hero image
  const heroImageUrl = ARTICLE_HERO_IMAGES[slug]
    || entry.heroImage?.url
    || CATEGORY_IMAGES[entry.category]
    || DEFAULT_IMAGE;

  // Get inline images for this article
  const inlineImages = ARTICLE_INLINE_IMAGES[slug] || [];

  // Calculate reading time
  const readingTime = getReadingTime(entry.body);

  // Format date - try parsing it
  let formattedDate: string | null = null;
  if (entry.publishDate) {
    const date = new Date(entry.publishDate);
    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }

  // Split body into paragraphs
  const paragraphs = entry.body.split('\n\n').filter(p => p.trim());

  // Calculate where to insert inline images (evenly spaced, avoiding positions after headings)
  const rawInsertPoints = inlineImages.map((_, i) =>
    Math.floor((paragraphs.length / (inlineImages.length + 1)) * (i + 1))
  );

  // Adjust points that fall after headings - shift them forward
  const imageInsertPoints = rawInsertPoints.map(point => {
    let adjusted = point;
    while (adjusted > 0 && adjusted < paragraphs.length) {
      const prevParagraph = paragraphs[adjusted - 1];
      if (prevParagraph?.startsWith('## ') || prevParagraph?.startsWith('### ')) {
        adjusted++;
      } else {
        break;
      }
    }
    return adjusted;
  });

  return (
    <div className={styles.page}>
      <Nav />

      {/* Hero Image */}
      <div className={styles.heroImage}>
        <Image
          src={heroImageUrl}
          alt={entry.title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Link href={`/journal/${categorySlug}`}>{entry.category}</Link>
        </div>

        <div className={styles.meta}>
          <span>The Foragers</span>
          <span className={styles.metaDivider} />
          {formattedDate ? (
            <span>{formattedDate}</span>
          ) : (
            <span>March 2025</span>
          )}
          <span className={styles.metaDivider} />
          <span>{readingTime} min read</span>
        </div>

        <h1 className={styles.title}>{entry.title}</h1>
      </header>

      {/* Article Content */}
      <article className={styles.article}>
        <div className={styles.content}>
          {paragraphs.map((paragraph, i) => {
            const elements = [];

            // Check if we should insert an image before this paragraph
            const imageIndex = imageInsertPoints.indexOf(i);
            if (imageIndex !== -1 && inlineImages[imageIndex]) {
              elements.push(
                <figure key={`img-${i}`} className={styles.inlineImage}>
                  <img
                    src={inlineImages[imageIndex]}
                    alt=""
                  />
                </figure>
              );
            }

            // Add the paragraph
            if (paragraph.startsWith('## ')) {
              elements.push(<h2 key={i} className={styles.heading}>{paragraph.replace('## ', '')}</h2>);
            } else if (paragraph.startsWith('### ')) {
              elements.push(<h3 key={i} className={styles.subheading}>{paragraph.replace('### ', '')}</h3>);
            } else {
              elements.push(<p key={i} className={styles.paragraph}>{paragraph}</p>);
            }

            return elements;
          })}
        </div>

        <footer className={styles.footer}>
          <Link href={`/journal/${categorySlug}`} className={styles.backLink}>← Back to {entry.category}</Link>
        </footer>
      </article>
    </div>
  );
}
