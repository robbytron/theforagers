import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Foraging Law',
  description: 'Legal guidance for foraging in Britain — understanding land access, protected species, and commercial foraging rules.',
};

const LEGAL_SECTIONS = [
  {
    title: 'The Basics',
    content: [
      'In England and Wales, you can forage for personal use on public land without permission under the "four Fs" rule: fungi, flowers, foliage, and fruit that are growing wild.',
      'Uprooting any plant without the landowner\'s permission is illegal under the Wildlife and Countryside Act 1981.',
      'In Scotland, the Scottish Outdoor Access Code gives greater access rights, but the same principles of responsible foraging apply.',
    ],
  },
  {
    title: 'Private Land',
    content: [
      'You must have the landowner\'s permission to forage on private land.',
      'The right to roam (Countryside and Rights of Way Act 2000) allows access to certain land but does not include the right to forage.',
      'Trespass is a civil matter, not criminal, but you can be asked to leave and may face legal action for damages.',
    ],
  },
  {
    title: 'Protected Species',
    content: [
      'Certain species are legally protected under Schedule 8 of the Wildlife and Countryside Act 1981.',
      'It is an offence to pick, uproot, or destroy protected plants without a licence.',
      'Protected species include wild leek, shore dock, and various orchids. Always check before harvesting unfamiliar species.',
    ],
  },
  {
    title: 'Commercial Foraging',
    content: [
      'Commercial foraging always requires landowner permission.',
      'Some local authorities have bylaws restricting commercial harvesting in parks and public spaces.',
      'Selling foraged goods may require food hygiene certification and business registration.',
    ],
  },
];

const SPECIAL_AREAS = [
  {
    name: 'SSSIs',
    full: 'Sites of Special Scientific Interest',
    rules: 'Stricter rules apply. Many activities require Natural England consent. Contact them before foraging.',
  },
  {
    name: 'Nature Reserves',
    full: 'National and Local Nature Reserves',
    rules: 'Often prohibit all foraging. Check with the managing organisation before visiting.',
  },
  {
    name: 'National Parks',
    full: 'National Park Land',
    rules: 'Rules vary by park and land ownership. Personal foraging may be permitted; commercial usually is not.',
  },
  {
    name: 'Common Land',
    full: 'Registered Common Land',
    rules: 'Commoners may have specific foraging rights. Others typically need permission.',
  },
];

export default function LegalPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Know Your Rights</p>
          <h1 className={styles.title}>Foraging <em>Law</em></h1>
          <p className={styles.intro}>
            Understanding the legal framework around foraging in Britain. This is guidance, not
            legal advice — when in doubt, seek permission.
          </p>
        </header>

        <section className={styles.disclaimer}>
          <p>
            <strong>Disclaimer:</strong> This page provides general information about foraging
            law in Britain. It is not legal advice. Laws can change and interpretation varies.
            If you have specific legal questions, consult a qualified solicitor.
          </p>
        </section>

        <section className={styles.sections}>
          {LEGAL_SECTIONS.map((section) => (
            <div key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.sectionContent}>
                {section.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className={styles.specialAreas}>
          <h2 className={styles.areasTitle}>Special Areas</h2>
          <p className={styles.areasIntro}>
            Different types of protected land have different rules. Here&apos;s a quick overview:
          </p>
          <div className={styles.areasGrid}>
            {SPECIAL_AREAS.map((area) => (
              <div key={area.name} className={styles.areaCard}>
                <h3 className={styles.areaName}>{area.name}</h3>
                <p className={styles.areaFull}>{area.full}</p>
                <p className={styles.areaRules}>{area.rules}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.bestPractice}>
          <h2 className={styles.bpTitle}>Best Practice</h2>
          <ul className={styles.bpList}>
            <li>When in doubt, ask permission</li>
            <li>Never uproot plants without explicit landowner consent</li>
            <li>Take only what you need for personal use</li>
            <li>Respect all signage and local bylaws</li>
            <li>If challenged, be polite and leave if asked</li>
            <li>Keep records if foraging commercially</li>
          </ul>
        </section>

        <section className={styles.links}>
          <h2 className={styles.linksTitle}>Related Resources</h2>
          <div className={styles.linksGrid}>
            <Link href="/foragers-code" className={styles.linkCard}>
              <h3>The Forager&apos;s Code</h3>
              <p>Ethical principles beyond legal requirements.</p>
            </Link>
            <Link href="/safety" className={styles.linkCard}>
              <h3>Safety Guide</h3>
              <p>Stay safe while foraging.</p>
            </Link>
            <Link href="/dangers" className={styles.linkCard}>
              <h3>Dangerous Species</h3>
              <p>Know what to avoid.</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
