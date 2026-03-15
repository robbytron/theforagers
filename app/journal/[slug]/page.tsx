import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/ui/Nav';
import { getJournalEntryBySlug, getAllJournalSlugs } from '@/lib/airtable';
import styles from './page.module.css';

export const revalidate = 3600;

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

  return (
    <>
      <Nav />
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.breadcrumbs}>
            <Link href="/journal">Journal</Link>
            <span>/</span>
            <Link href={`/journal/${categorySlug}`}>{entry.category}</Link>
          </div>
          <h1 className={styles.title}>{entry.title}</h1>
          {entry.excerpt && <p className={styles.excerpt}>{entry.excerpt}</p>}
        </header>

        {entry.heroImage && (
          <div className={styles.hero}>
            <Image
              src={entry.heroImage.url}
              alt={entry.title}
              fill
              priority
              sizes="100vw"
              className={styles.heroImg}
            />
          </div>
        )}

        <div className={styles.content}>
          {entry.body.split('\n\n').map((paragraph, i) => {
            // Handle headings
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className={styles.heading}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i} className={styles.subheading}>{paragraph.replace('### ', '')}</h3>;
            }
            // Regular paragraphs
            return <p key={i} className={styles.paragraph}>{paragraph}</p>;
          })}
        </div>

        <footer className={styles.footer}>
          <Link href="/journal" className={styles.backLink}>← Back to Journal</Link>
        </footer>
      </article>
    </>
  );
}
