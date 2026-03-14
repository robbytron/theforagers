import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import LookalikeComparison from '@/components/species/LookalikeComparison';
import { getSpeciesBySlug, getAllSpeciesSlugs, getLookalikesForSpecies } from '@/lib/airtable';
import { resolveSpeciesPhotos } from '@/lib/inaturalist';
import type { FAQ } from '@/types';
import styles from './page.module.css';

export const revalidate = 3600;

function buildFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export async function generateStaticParams() {
  const slugs = await getAllSpeciesSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) return {};
  return { title: species.seoTitle || species.name, description: species.seoDescription || species.shortDescription };
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const species = await getSpeciesBySlug(slug);
  if (!species) notFound();

  const [photos, lookalikes] = await Promise.all([
    resolveSpeciesPhotos(species),
    getLookalikesForSpecies(species.id),
  ]);
  const hero    = photos[0];
  const gallery = photos.slice(1, 6);

  return (
    <>
      <Nav />
      <div className={styles.hero}>
        {hero ? (
          <Image src={hero.url} alt={species.name} fill priority sizes="100vw" className={styles.heroImg} />
        ) : <div className={styles.heroPlaceholder} />}
        <div className={styles.heroOverlay} />
        {hero?.source === 'inaturalist' && species.iNaturalistTaxonId && (
          <a href={`https://www.inaturalist.org/taxa/${species.iNaturalistTaxonId}`} target="_blank" rel="noopener noreferrer" className={styles.heroCredit}>iNaturalist CC-BY</a>
        )}
        <div className={styles.heroContent}>
          <Link href="/species" className={styles.breadcrumb}>← Species guide</Link>
          <div className={styles.heroTags}>
            <span className="tag tag-season">{species.type}</span>
            <span className={`tag ${species.difficulty === 'Beginner' ? 'tag-beginner' : species.difficulty === 'Expert Only' ? 'tag-caution' : 'tag-season'}`}>{species.difficulty}</span>
            {species.expertReviewed && <span className="tag tag-beginner">Expert reviewed ✓</span>}
          </div>
          <h1 className={styles.heroTitle}>{species.name}</h1>
          <p className={styles.heroLatin}>{species.latinName}</p>
          <p className={styles.heroDesc}>{species.shortDescription}</p>
        </div>
      </div>

      <div className={styles.layout}>
        <article className={styles.article}>
          {species.fullDescription && (
            <section className={styles.section}>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.fullDescription}} />
            </section>
          )}
          {species.identificationNotes && (
            <section className={styles.section}>
              <h2 className={styles.sectionHead}>How to identify it</h2>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.identificationNotes}} />
            </section>
          )}
          {species.lookalikesAndDangers && (
            <section className={`${styles.section} ${styles.dangerSection}`}>
              <h2 className={styles.dangerHead}><span>⚠</span> Lookalikes &amp; dangers</h2>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.lookalikesAndDangers}} />
            </section>
          )}
          <LookalikeComparison
            speciesName={species.name}
            speciesPhoto={hero ?? null}
            lookalikes={lookalikes}
          />
          {species.culinaryUses && (
            <section className={styles.section}>
              <h2 className={styles.sectionHead}>How to eat it</h2>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.culinaryUses}} />
            </section>
          )}
          {species.legalNotes && (
            <section className={styles.section}>
              <h2 className={styles.sectionHead}>Legal notes</h2>
              <div className={styles.prose} dangerouslySetInnerHTML={{__html: species.legalNotes}} />
            </section>
          )}
          {species.faqs.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionHead}>Common questions</h2>
              <div className={styles.faqList}>
                {species.faqs.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <h3 className={styles.faqQuestion}>{faq.q}</h3>
                    <p className={styles.faqAnswer}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className={styles.sidebar}>
          <div className={styles.factCard}>
            <h3 className={styles.factHead}>At a glance</h3>
            <dl className={styles.factList}>
              <div className={styles.factRow}><dt>Type</dt><dd>{species.type}</dd></div>
              <div className={styles.factRow}><dt>Difficulty</dt><dd>{species.difficulty}</dd></div>
              <div className={styles.factRow}><dt>Habitat</dt><dd>{species.habitat}</dd></div>
              {species.seasons.length > 0 && <div className={styles.factRow}><dt>In season</dt><dd>{species.seasons.join(', ')}</dd></div>}
              <div className={styles.factRow}><dt>Expert reviewed</dt><dd>{species.expertReviewed ? 'Yes ✓' : 'Pending'}</dd></div>
            </dl>
          </div>
          {gallery.length > 0 && (
            <div className={styles.galleryCard}>
              <h3 className={styles.factHead}>Photos</h3>
              <div className={styles.gallery}>
                {gallery.map((photo, i) => (
                  <a key={i} href={photo.url} target="_blank" rel="noopener noreferrer" className={styles.galleryItem}>
                    <Image src={photo.thumbUrl} alt={`${species.name} ${i+2}`} fill sizes="200px" className={styles.galleryImg} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {species.iNaturalistTaxonId && (
            <a href={`https://www.inaturalist.org/taxa/${species.iNaturalistTaxonId}`} target="_blank" rel="noopener noreferrer" className={styles.inatLink}>
              View on iNaturalist →
            </a>
          )}
        </aside>
      </div>
      {species.faqs.length > 0 && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema(species.faqs)) }}
        />
      )}
    </>
  );
}