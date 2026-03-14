import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import SpeciesCard from '@/components/species/SpeciesCard';
import { getFeaturedSpecies, getAllSpecies } from '@/lib/airtable';
import type { Month } from '@/types';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'The Foragers — Wild Food of Britain',
  description: 'A seasonal UK foraging guide. Find, identify, and cook wild food.',
};

export const revalidate = 3600;

const MONTHS: Month[] = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const TICKER = [
  {name:'Wild Garlic',note:'in leaf now'},{name:'Wood Sorrel',note:'emerging'},
  {name:'Hawthorn Buds',note:'first flush'},{name:'Nettles',note:'young tops only'},
  {name:'Chickweed',note:'widespread'},{name:'Bittercress',note:'hedgerows'},
  {name:'Cleavers',note:'young shoots'},{name:'Alexanders',note:'coastal areas'},
];

export default async function HomePage() {
  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const [featured, allSpecies] = await Promise.all([
    getFeaturedSpecies(3),
    getAllSpecies(),
  ]);
  const monthCounts = Object.fromEntries(
    MONTHS.map(m => [m, allSpecies.filter(s => s.seasons.includes(m)).length])
  ) as Record<Month, number>;

  return (
    <>
      <Nav />
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <p className={styles.heroSeason}>{currentMonth} · Britain&apos;s Woodlands &amp; Hedgerows</p>
        <h1 className={styles.heroTitle}>The land is<br /><em>waking up.</em><br />Go and find it.</h1>
        <p className={styles.heroSub}>Everything you need to forage wild food in Britain — what&apos;s out there, when to find it, and how to be sure you&apos;re eating the right thing.</p>
        <div className={styles.heroActions}>
          <Link href="/species" className="btn-primary">What&apos;s in season now</Link>
          <Link href="/beginners" className="btn-ghost">Start here →</Link>
        </div>
      </section>

      <div className={styles.seasonStrip}>
        <div className={styles.seasonScroll}>
          {[...TICKER,...TICKER].map((item,i) => (
            <div key={i} className={styles.seasonItem}>
              <span className={styles.dot} /><strong>{item.name}</strong><span>{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      <section className={styles.inSeason}>
        <div className={styles.inSeasonIntro}>
          <p className="section-label">In season — {currentMonth} {now.getFullYear()}</p>
          <h2 className={styles.sectionTitle}>The best finds<br />this <em>fortnight</em></h2>
          <p>Spring is just beginning. These are the species worth going out for right now.</p>
        </div>
        <div className={styles.speciesGrid}>
          {featured.map(s => <SpeciesCard key={s.id} species={s} />)}
        </div>
      </section>

      <section className={styles.calendarSection}>
        <p className="section-label" style={{color:'var(--sage)'}}>The forager&apos;s year</p>
        <h2 className={styles.sectionTitle} style={{color:'var(--cream)'}}>
          Every month has<br />something <em style={{color:'var(--brown-light)'}}>worth finding</em>
        </h2>
        <div className={styles.calendarGrid}>
          {MONTHS.map(month => (
            <Link key={month} href={`/calendar`}
              className={`${styles.calMonth} ${month===currentMonth ? styles.calActive : ''}`}>
              <div className={styles.calName}>{month.slice(0,3)}</div>
              <div className={styles.calCount}>{monthCounts[month]} species</div>
            </Link>
          ))}
        </div>
      </section>

      <div className={styles.editorial}>
        <div className={styles.editorialPanel} style={{background:'var(--parchment)'}}>
          <p className="section-label">The species guide</p>
          <h3 className={styles.editorialTitle}>Every plant,<br />properly <em>identified</em></h3>
          <p>Over 200 species with photographs, lookalike warnings, and culinary guidance.</p>
          <Link href="/species">Browse the full guide →</Link>
        </div>
        <div className={styles.editorialPanel}>
          <p className="section-label">New to foraging?</p>
          <h3 className={styles.editorialTitle}>Start with <em>ten species.</em><br />Learn them properly.</h3>
          <p>Master these and you&apos;ll always find something edible.</p>
          <Link href="/beginners">Beginner&apos;s guide →</Link>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div>
            <div className={styles.footerBrand}>The <em>Foragers</em></div>
            <p className={styles.footerTagline}>Wild food of Britain</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4>Explore</h4>
              <ul>
                <li><Link href="/species">Species Guide</Link></li>
                <li><Link href="/calendar">Calendar</Link></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Learn</h4>
              <ul>
                <li><Link href="/beginners">Beginners</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerLegal}>© {now.getFullYear()} The Foragers.</p>
          <p className={styles.footerSafety}>Never eat anything you cannot positively identify.</p>
        </div>
      </footer>
    </>
  );
}
