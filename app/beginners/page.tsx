import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getAllSpecies } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Beginners Start Here', description: "New to foraging? Start here." };
export const revalidate = 3600;

const CODE = [
  { rule: 'Take only what you need', detail: 'Leave enough for wildlife and other foragers. Take no more than a third.' },
  { rule: 'Be absolutely certain of your ID', detail: 'If you have any doubt, leave it. Use multiple identification features — never rely on one alone.' },
  { rule: 'Know the law', detail: 'In England, Wales and Scotland you can generally pick fruit, fungi and foliage from public land for personal use. Uprooting plants without permission is illegal.' },
  { rule: 'Respect private land', detail: 'Most land in Britain is privately owned. Always get permission before foraging on private property.' },
  { rule: 'Protect rare species', detail: "Never pick species that are rare or protected. Check the Vascular Plant Red List before harvesting anything unusual." },
  { rule: 'Leave no trace', detail: "Take nothing but what you're harvesting. Close gates, leave paths clear, treat the land as if you'll need to return." },
];

export default async function BeginnersPage() {
  const allSpecies      = await getAllSpecies();
  const beginnerSpecies = allSpecies.filter(s => s.difficulty === 'Beginner').slice(0, 6);

  return (
    <>
      <Nav />
      <div className={styles.pageHero}>
        <p className={styles.heroLabel}>New to foraging?</p>
        <h1 className={styles.heroTitle}>Start with <em>ten species.</em><br />Learn them properly.</h1>
        <p className={styles.heroSub}>You don&apos;t need to know 200 plants. You need to know ten, really well.</p>
      </div>

      <section id="code" className={styles.codeSection}>
        <div className={styles.sectionIntro}>
          <p className="section-label">Before you go out</p>
          <h2 className={styles.sectionTitle}>The forager&apos;s <em>code</em></h2>
        </div>
        <ol className={styles.codeList}>
          {CODE.map((item, i) => (
            <li key={i} className={styles.codeItem}>
              <span className={styles.codeNumber}>{String(i+1).padStart(2,'0')}</span>
              <div>
                <h3 className={styles.codeRule}>{item.rule}</h3>
                <p className={styles.codeDetail}>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div id="safety" className={styles.safetyBox}>
        <div className={styles.safetyInner}>
          <h2 className={styles.safetyTitle}><span>⚠</span> The single most important rule</h2>
          <p className={styles.safetyRule}>Never eat anything you cannot positively identify using at least three separate features — shape, smell, habitat, season.</p>
          <p className={styles.safetySub}>Some of Britain&apos;s most dangerous plants resemble edible species closely. Hemlock Water Dropwort, Death Cap, Destroying Angel. These are fatal. If in doubt, leave it out.</p>
        </div>
      </div>

      <section id="species" className={styles.speciesSection}>
        <div className={styles.sectionIntro}>
          <p className="section-label">Where to start</p>
          <h2 className={styles.sectionTitle}>Your first <em>six species</em></h2>
          <p className={styles.sectionSub}>Beginner-friendly, widely available, and distinctive enough that confident identification is straightforward.</p>
        </div>
        <div className={styles.speciesGrid}>
          {beginnerSpecies.map(s => <SpeciesCard key={s.id} species={s} />)}
        </div>
        {beginnerSpecies.length === 0 && <p className={styles.empty}>Set some species to Difficulty: Beginner in Airtable to see them here.</p>}
      </section>

      <section className={styles.guidesSection}>
        <div className={styles.sectionIntro}>
          <p className="section-label">More for beginners</p>
          <h2 className={styles.sectionTitle}>Beginner <em>Guides</em></h2>
        </div>
        <div className={styles.guidesGrid}>
          <Link href="/beginners/first-10-species" className={styles.guideCard}>
            <h3>First 10 Species</h3>
            <p>The ten species every beginner should learn first — easy to identify and no dangerous lookalikes.</p>
          </Link>
          <Link href="/beginners/kit" className={styles.guideCard}>
            <h3>Beginner Kit</h3>
            <p>Essential equipment for new foragers — what you need for your first trips.</p>
          </Link>
          <Link href="/beginners/field-guides" className={styles.guideCard}>
            <h3>Field Guides</h3>
            <p>The books we recommend for learning to identify wild food.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
