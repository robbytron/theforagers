import type { Metadata } from 'next';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'The Forager\'s Code',
  description: 'Ethical principles for sustainable wild food gathering in Britain.',
};

const CODE_PRINCIPLES = [
  {
    number: '01',
    title: 'Positive Identification',
    principle: 'Never eat anything you cannot positively identify.',
    detail: 'Use multiple sources. Check every identifying feature. If in doubt, leave it out. A moment of uncertainty is not worth a lifetime of regret.',
  },
  {
    number: '02',
    title: 'Take Only What You Need',
    principle: 'Forage for sustenance, not for show.',
    detail: 'A handful of wild garlic for tonight\'s dinner. A small basket of blackberries. Take what you will use, and leave the rest for wildlife and fellow foragers.',
  },
  {
    number: '03',
    title: 'Leave No Trace',
    principle: 'The woodland should not know you were there.',
    detail: 'Tread lightly. Don\'t trample vegetation to reach a prize. Pick cleanly without damaging the parent plant. Leave the site as you found it — or better.',
  },
  {
    number: '04',
    title: 'Never Uproot',
    principle: 'Leaves, fruits, and flowers only. Leave the roots.',
    detail: 'Unless you have landowner permission and the plant is abundant, never take the whole plant. Allow it to regenerate for next year.',
  },
  {
    number: '05',
    title: 'Respect Private Land',
    principle: 'Ask permission. Know the law.',
    detail: 'The right to roam does not include the right to forage commercially. Always seek permission on private land. Know the specific rules for SSSIs and nature reserves.',
  },
  {
    number: '06',
    title: 'Share Knowledge Responsibly',
    principle: 'Teach others, but never assume.',
    detail: 'When introducing others to foraging, emphasise identification skills and caution above all else. Never give someone wild food to eat unless they have identified it themselves.',
  },
  {
    number: '07',
    title: 'Protect Rare Species',
    principle: 'Some things are not ours to take.',
    detail: 'Never forage protected species. If you find something rare, celebrate its existence — don\'t harvest it. Report unusual finds to local wildlife trusts.',
  },
  {
    number: '08',
    title: 'Consider the Ecosystem',
    principle: 'You are not the only one who eats here.',
    detail: 'Berries feed birds through winter. Nuts sustain squirrels. Flowers provide nectar for pollinators. Take your share, but remember the wild creatures who depend on these foods.',
  },
  {
    number: '09',
    title: 'Know Your Limits',
    principle: 'Experience cannot be rushed.',
    detail: 'Start with the easy species. Master them completely before moving on. There is no shame in a small repertoire — only in overconfidence.',
  },
  {
    number: '10',
    title: 'Pass It On',
    principle: 'This knowledge is a gift. Share it.',
    detail: 'Foraging connects us to our ancestors and to the land. Teach your children. Share with friends. Keep this tradition alive for future generations.',
  },
];

export default function ForagersCodePage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Ethics & Responsibility</p>
          <h1 className={styles.title}>The Forager&apos;s <em>Code</em></h1>
          <p className={styles.intro}>
            Ten principles for ethical, sustainable foraging. These are not rules imposed from above —
            they are the hard-won wisdom of generations of foragers who understood that our right to
            gather wild food comes with profound responsibilities.
          </p>
        </header>

        <section className={styles.principles}>
          {CODE_PRINCIPLES.map((item) => (
            <article key={item.number} className={styles.principle}>
              <div className={styles.principleNumber}>{item.number}</div>
              <div className={styles.principleContent}>
                <h2 className={styles.principleTitle}>{item.title}</h2>
                <p className={styles.principleMain}>{item.principle}</p>
                <p className={styles.principleDetail}>{item.detail}</p>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.closing}>
          <blockquote className={styles.quote}>
            &ldquo;Take only photographs, leave only footprints&rdquo; is good advice for hikers.
            For foragers, we might say: <em>take only what feeds you today, leave enough to feed the land forever.</em>
          </blockquote>
        </section>
      </main>
    </>
  );
}
