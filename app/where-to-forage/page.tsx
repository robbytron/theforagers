import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Where to Forage',
  description: 'Finding foraging spots in Britain — public land, access rights, and habitat guidance.',
};

const HABITATS = [
  {
    name: 'Woodlands',
    description: 'Ancient woods, managed forests, and copses',
    finds: ['Wild garlic', 'Wood sorrel', 'Fungi', 'Nuts', 'Wild cherries'],
    tips: 'Look for diverse, mature woodlands with varied tree species. Ancient woodland indicators like bluebells and wood anemones suggest good foraging potential.',
  },
  {
    name: 'Hedgerows',
    description: 'Field boundaries and country lanes',
    finds: ['Blackberries', 'Sloes', 'Elderflower', 'Hawthorn', 'Wild plums'],
    tips: 'Old hedgerows with multiple species are most productive. Avoid those alongside busy roads or recently sprayed fields.',
  },
  {
    name: 'Meadows & Grassland',
    description: 'Unimproved pastures and field margins',
    finds: ['Sorrel', 'Yarrow', 'Meadowsweet', 'Wild herbs', 'Dandelions'],
    tips: 'Unimproved grassland without chemical treatment is best. Look for diversity of wildflowers as an indicator.',
  },
  {
    name: 'Wetlands & Riversides',
    description: 'Streams, ponds, marshes, and riverbanks',
    finds: ['Watercress', 'Mint', 'Meadowsweet', 'Comfrey', 'Sweet cicely'],
    tips: 'Check water quality — avoid stagnant or polluted water. Watercress should only be gathered from clean, flowing streams.',
  },
  {
    name: 'Urban Areas',
    description: 'Parks, cemeteries, canal paths, and wasteland',
    finds: ['Nettles', 'Chickweed', 'Dandelions', 'Lime flowers', 'Elderflower'],
    tips: 'Avoid busy roadsides and areas treated with pesticides. Cemeteries and old parks often have undisturbed areas.',
  },
  {
    name: 'Coastal',
    description: 'Beaches, cliffs, salt marshes, and dunes',
    finds: ['Samphire', 'Sea beet', 'Seaweeds', 'Sea purslane', 'Rock samphire'],
    tips: 'Check tide times and water quality. Many coastal areas have restricted access — verify before visiting.',
  },
];

const ACCESS_TYPES = [
  {
    title: 'Public Rights of Way',
    description: 'Footpaths and bridleways across private land. You can forage for personal use on the path itself.',
  },
  {
    title: 'Access Land',
    description: 'Open land mapped as access under CRoW Act. Walking permitted but foraging rights vary — check locally.',
  },
  {
    title: 'Common Land',
    description: 'Land with registered commons. Commoners may have foraging rights; others should seek permission.',
  },
  {
    title: 'Forestry England Land',
    description: 'Public forests often allow personal foraging. Check specific site rules before harvesting.',
  },
  {
    title: 'National Trust',
    description: 'Policies vary by property. Many allow limited personal foraging — check with the local property.',
  },
  {
    title: 'Local Authority Land',
    description: 'Parks and green spaces. Rules vary widely — some councils prohibit all foraging.',
  },
];

export default function WhereToForagePage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Finding Spots</p>
          <h1 className={styles.title}>Where to <em>Forage</em></h1>
          <p className={styles.intro}>
            Britain offers diverse foraging habitats, from ancient woodlands to urban parks.
            Here&apos;s how to find productive spots while respecting access rights.
          </p>
        </header>

        <section className={styles.habitats}>
          <h2 className={styles.sectionTitle}>Foraging Habitats</h2>
          <div className={styles.habitatGrid}>
            {HABITATS.map((habitat) => (
              <div key={habitat.name} className={styles.habitatCard}>
                <h3 className={styles.habitatName}>{habitat.name}</h3>
                <p className={styles.habitatDesc}>{habitat.description}</p>
                <div className={styles.habitatFinds}>
                  <strong>Typical finds:</strong>
                  <span>{habitat.finds.join(', ')}</span>
                </div>
                <p className={styles.habitatTips}>{habitat.tips}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.access}>
          <h2 className={styles.accessTitle}>Understanding Access</h2>
          <p className={styles.accessIntro}>
            Different types of land have different rules. Always check before foraging.
          </p>
          <div className={styles.accessGrid}>
            {ACCESS_TYPES.map((type) => (
              <div key={type.title} className={styles.accessCard}>
                <h3 className={styles.accessCardTitle}>{type.title}</h3>
                <p className={styles.accessCardDesc}>{type.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.tips}>
          <h2 className={styles.tipsTitle}>Finding Good Spots</h2>
          <ul className={styles.tipsList}>
            <li>Use OS maps to identify public land, woods, and rights of way</li>
            <li>Look for areas with diverse plant communities — monocultures are less productive</li>
            <li>Visit the same spots in different seasons to learn what grows there</li>
            <li>Talk to local foragers and join guided walks to discover new areas</li>
            <li>Keep records of what you find and when — build your personal foraging map</li>
            <li>Consider volunteering with conservation groups to access managed land</li>
          </ul>
        </section>

        <section className={styles.links}>
          <h2 className={styles.linksTitle}>Related</h2>
          <div className={styles.linksGrid}>
            <Link href="/legal" className={styles.linkCard}>
              <h3>Legal Guide</h3>
              <p>Understand foraging law and access rights.</p>
            </Link>
            <Link href="/foragers-code" className={styles.linkCard}>
              <h3>The Forager&apos;s Code</h3>
              <p>Ethical foraging principles.</p>
            </Link>
            <Link href="/coastal" className={styles.linkCard}>
              <h3>Coastal Foraging</h3>
              <p>Specialist guide to the shore.</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
