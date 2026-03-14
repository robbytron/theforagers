import type { Metadata } from 'next';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getAllSpecies } from '@/lib/airtable';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Species Guide',
  description: 'Browse wild food species found in Britain.',
};

export const revalidate = 3600;

export default async function SpeciesIndexPage() {
  const species = await getAllSpecies();

  return (
    <>
      <Nav />
      <div className={styles.pageHero}>
        <p className={styles.heroLabel}>The complete guide</p>
        <h1 className={styles.heroTitle}>Wild food<br /><em>of Britain</em></h1>
        <p className={styles.heroSub}>{species.length} species — each with photographs, identification notes, lookalike warnings, and culinary uses.</p>
      </div>
      <div className={styles.grid}>
        {species.length === 0 ? (
          <p className={styles.empty}>No live species yet. Add some in Airtable and set Status to Live.</p>
        ) : (
          species.map(s => <SpeciesCard key={s.id} species={s} />)
        )}
      </div>
    </>
  );
}
