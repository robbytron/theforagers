import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Nav from '@/components/ui/Nav';
import { getDangerSpeciesBySlug, getAllDangerSpeciesSlugs } from '@/lib/airtable';
import type { DangerLevel } from '@/types';
import styles from './page.module.css';

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllDangerSpeciesSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const species = await getDangerSpeciesBySlug(slug);
  if (!species) return { title: 'Not Found' };
  return {
    title: `${species.name} — Dangerous Species`,
    description: species.shortDescription || `${species.name} (${species.latinName}) — identification, symptoms, and first aid information.`,
  };
}

function getDangerColor(level: DangerLevel): string {
  switch (level) {
    case 'Deadly': return '#8B0000';
    case 'Toxic': return '#C41E3A';
    case 'Inedible': return '#CD853F';
    case 'Caution': return '#DAA520';
    default: return '#666';
  }
}

export default async function DangerSpeciesPage({ params }: { params: Params }) {
  const { slug } = await params;
  const species = await getDangerSpeciesBySlug(slug);
  if (!species) notFound();

  const heroPhoto = species.photos[0];

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/dangers">Dangers</Link>
              <span>/</span>
              <span>{species.name}</span>
            </nav>
            <span
              className={styles.dangerBadge}
              style={{ background: getDangerColor(species.dangerLevel) }}
            >
              {species.dangerLevel}
            </span>
            <h1 className={styles.title}>{species.name}</h1>
            <p className={styles.latinName}>{species.latinName}</p>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.main}>
            {heroPhoto && (
              <div className={styles.heroImage}>
                <Image
                  src={heroPhoto.url}
                  alt={species.name}
                  fill
                  sizes="(max-width: 800px) 100vw, 800px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            )}

            {species.shortDescription && (
              <div className={styles.intro}>
                <p>{species.shortDescription}</p>
              </div>
            )}

            {species.fullDescription && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Overview</h2>
                <div className={styles.prose}>
                  {species.fullDescription.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {species.identificationNotes && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Identification</h2>
                <div className={styles.prose}>
                  {species.identificationNotes.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {species.confusedWith && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Commonly Confused With</h2>
                <div className={styles.prose}>
                  {species.confusedWith.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {species.habitat && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Where Found</h2>
                <div className={styles.prose}>
                  {species.habitat.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className={styles.sidebar}>
            {species.symptoms && (
              <div className={styles.warningBox}>
                <h3 className={styles.warningTitle}>Symptoms of Poisoning</h3>
                <div className={styles.warningContent}>
                  {species.symptoms.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            {species.firstAid && (
              <div className={styles.firstAidBox}>
                <h3 className={styles.firstAidTitle}>First Aid</h3>
                <div className={styles.firstAidContent}>
                  {species.firstAid.split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.emergency}>
              <h3>Emergency Contact</h3>
              <p><strong>999</strong> — Emergency services</p>
              <p><strong>111</strong> — NHS non-emergency</p>
              <p className={styles.emergencyNote}>
                If you suspect poisoning, call immediately. Bring a sample of what was eaten if possible.
              </p>
            </div>
          </aside>
        </div>

        <section className={styles.backLink}>
          <Link href="/dangers">&larr; Back to all dangerous species</Link>
        </section>
      </main>
    </>
  );
}
