import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/ui/Nav';
import { getAllDangerSpecies } from '@/lib/airtable';
import type { DangerSpecies, DangerLevel } from '@/types';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Dangerous Species',
  description: 'Poisonous plants, toxic fungi, and dangerous lookalikes found in Britain. Essential knowledge for safe foraging.',
};

export const revalidate = 3600;

const DANGER_LEVEL_ORDER: DangerLevel[] = ['Deadly', 'Toxic', 'Inedible', 'Caution'];

function getDangerColor(level: DangerLevel): string {
  switch (level) {
    case 'Deadly': return '#8B0000';
    case 'Toxic': return '#C41E3A';
    case 'Inedible': return '#CD853F';
    case 'Caution': return '#DAA520';
    default: return '#666';
  }
}

// Placeholder data for when Airtable is empty
const PLACEHOLDER_DANGERS = [
  { name: 'Death Cap', latinName: 'Amanita phalloides', level: 'Deadly' as DangerLevel, description: 'Responsible for the majority of fatal mushroom poisonings worldwide.' },
  { name: 'Destroying Angel', latinName: 'Amanita virosa', level: 'Deadly' as DangerLevel, description: 'Pure white and deadly — often mistaken for edible species.' },
  { name: 'Foxglove', latinName: 'Digitalis purpurea', level: 'Deadly' as DangerLevel, description: 'Contains cardiac glycosides that can cause fatal heart arrhythmias.' },
  { name: 'Hemlock', latinName: 'Conium maculatum', level: 'Deadly' as DangerLevel, description: 'Highly toxic — famously used to execute Socrates.' },
  { name: 'Deadly Nightshade', latinName: 'Atropa belladonna', level: 'Deadly' as DangerLevel, description: 'All parts are toxic, especially the attractive black berries.' },
  { name: 'Lords-and-Ladies', latinName: 'Arum maculatum', level: 'Toxic' as DangerLevel, description: 'Bright red berries are very attractive to children but highly toxic.' },
];

export default async function DangersPage() {
  const dangers = await getAllDangerSpecies();
  const hasData = dangers.length > 0;

  // Group by danger level
  const grouped = DANGER_LEVEL_ORDER.reduce((acc, level) => {
    acc[level] = dangers.filter(d => d.dangerLevel === level);
    return acc;
  }, {} as Record<DangerLevel, DangerSpecies[]>);

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Safety First</p>
          <h1 className={styles.title}>Dangerous <em>Species</em></h1>
          <p className={styles.intro}>
            Britain is home to some extremely toxic plants and fungi. Knowing these species —
            and their edible lookalikes — is essential knowledge for any forager.
          </p>
        </header>

        <section className={styles.warning}>
          <div className={styles.warningInner}>
            <h2 className={styles.warningTitle}>Before you forage</h2>
            <p>
              <strong>Never eat anything you cannot positively identify.</strong> Many poisonous
              species closely resemble edible ones. A single mistake can be fatal. When in doubt,
              leave it out.
            </p>
          </div>
        </section>

        <section className={styles.categories}>
          <div className={styles.categoriesGrid}>
            <Link href="/dangers/poisonous-plants" className={styles.categoryCard}>
              <h3>Poisonous Plants</h3>
              <p>Hemlock, Foxglove, Deadly Nightshade, and other toxic plants of Britain.</p>
            </Link>
            <Link href="/dangers/toxic-fungi" className={styles.categoryCard}>
              <h3>Toxic Fungi</h3>
              <p>Death Cap, Destroying Angel, and the mushrooms that kill.</p>
            </Link>
            <Link href="/dangers/dangerous-berries" className={styles.categoryCard}>
              <h3>Dangerous Berries</h3>
              <p>Yew, Nightshade, and toxic fruits that foragers must avoid.</p>
            </Link>
          </div>
        </section>

        {!hasData ? (
          <>
            <section className={styles.placeholderSection}>
              <p className={styles.placeholderNote}>
                Our comprehensive danger species database is being developed. Below are some of
                Britain&apos;s most dangerous species — detailed guides coming soon.
              </p>
              <div className={styles.placeholderGrid}>
                {PLACEHOLDER_DANGERS.map((danger, i) => (
                  <div key={i} className={styles.placeholderCard}>
                    <span
                      className={styles.dangerBadge}
                      style={{ background: getDangerColor(danger.level) }}
                    >
                      {danger.level}
                    </span>
                    <h3 className={styles.cardName}>{danger.name}</h3>
                    <p className={styles.cardLatin}>{danger.latinName}</p>
                    <p className={styles.cardDesc}>{danger.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {DANGER_LEVEL_ORDER.map(level => {
              const levelSpecies = grouped[level];
              if (levelSpecies.length === 0) return null;
              return (
                <section key={level} className={styles.levelSection}>
                  <h2
                    className={styles.levelTitle}
                    style={{ color: getDangerColor(level) }}
                  >
                    {level}
                  </h2>
                  <div className={styles.speciesGrid}>
                    {levelSpecies.map(species => (
                      <Link
                        key={species.id}
                        href={`/dangers/${species.slug}`}
                        className={styles.speciesCard}
                      >
                        {species.photos[0] && (
                          <div className={styles.cardImage}>
                            <Image
                              src={species.photos[0].thumbUrl}
                              alt={species.name}
                              fill
                              sizes="280px"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <div className={styles.cardContent}>
                          <span
                            className={styles.dangerBadge}
                            style={{ background: getDangerColor(species.dangerLevel) }}
                          >
                            {species.dangerLevel}
                          </span>
                          <h3 className={styles.cardName}>{species.name}</h3>
                          <p className={styles.cardLatin}>{species.latinName}</p>
                          <p className={styles.cardDesc}>{species.shortDescription}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}

        <section className={styles.resources}>
          <h2 className={styles.resourcesTitle}>Safety Resources</h2>
          <div className={styles.resourcesGrid}>
            <Link href="/safety" className={styles.resourceCard}>
              <h3>Safe Foraging Practices</h3>
              <p>How to forage safely and avoid common mistakes.</p>
            </Link>
            <Link href="/foragers-code" className={styles.resourceCard}>
              <h3>The Forager&apos;s Code</h3>
              <p>Ethical principles for sustainable foraging.</p>
            </Link>
            <Link href="/legal" className={styles.resourceCard}>
              <h3>Legal Information</h3>
              <p>Know your rights and responsibilities.</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
