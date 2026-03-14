import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getAllSpecies } from '@/lib/airtable';
import type { Month } from '@/types';
import styles from './page.module.css';

export const metadata: Metadata = { title: "Forager's Calendar", description: 'What to forage in Britain, month by month.' };
export const revalidate = 3600;

const MONTHS: Month[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default async function CalendarPage() {
  const allSpecies   = await getAllSpecies();
  const now          = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const byMonth      = Object.fromEntries(MONTHS.map(m => [m, allSpecies.filter(s => s.seasons.includes(m))])) as Record<Month, typeof allSpecies>;

  return (
    <>
      <Nav />
      <div className={styles.pageHero}>
        <p className={styles.heroLabel}>Month by month</p>
        <h1 className={styles.heroTitle}>The forager&apos;s<br /><em>calendar</em></h1>
        <p className={styles.heroSub}>Every month has something worth finding. Use this to plan ahead or find out what&apos;s available right now.</p>
      </div>
      <div className={styles.monthNav}>
        {MONTHS.map(month => (
          <a key={month} href={`#${month.toLowerCase()}`} className={`${styles.monthPill} ${month===currentMonth ? styles.monthActive : ''}`}>
            <span className={styles.monthName}>{month.slice(0,3)}</span>
            <span className={styles.monthCount}>{byMonth[month].length}</span>
          </a>
        ))}
      </div>
      <div className={styles.calendar}>
        {MONTHS.map(month => (
          <section key={month} id={month.toLowerCase()} className={`${styles.monthSection} ${month===currentMonth ? styles.currentMonth : ''}`}>
            <div className={styles.monthHeader}>
              <div>
                {month === currentMonth && <p className={styles.nowBadge}>↑ Right now</p>}
                <h2 className={styles.monthTitle}>{month}</h2>
                <p className={styles.monthMeta}>{byMonth[month].length} species in season</p>
              </div>
            </div>
            {byMonth[month].length > 0 ? (
              <div className={styles.monthGrid}>
                {byMonth[month].map(s => <SpeciesCard key={s.id} species={s} />)}
              </div>
            ) : (
              <p className={styles.empty}>Species entries for {month} coming soon.</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
