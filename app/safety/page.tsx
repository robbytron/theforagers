import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Foraging Safety',
  description: 'Essential safety guidance for foraging in Britain — identification rules, preparation requirements, and emergency procedures.',
};

const SAFETY_RULES = [
  {
    number: '1',
    title: 'Positive Identification',
    content: 'Never eat anything you cannot positively identify. Use multiple identification features and cross-reference with reliable sources. A single misidentification can be fatal.',
  },
  {
    number: '2',
    title: 'Learn the Dangers First',
    content: 'Before learning what you can eat, learn what can kill you. Know the most dangerous species in your area and their lookalikes intimately.',
  },
  {
    number: '3',
    title: 'Start Simple',
    content: 'Begin with easily identifiable species that have no dangerous lookalikes. Build your repertoire slowly over years, not weeks.',
  },
  {
    number: '4',
    title: 'Check Preparation Requirements',
    content: 'Some species are only edible after specific preparation. Always verify cooking requirements before consumption.',
  },
  {
    number: '5',
    title: 'Test for Allergies',
    content: 'Try a small amount of any new species first and wait 24 hours before eating more. Individual reactions vary.',
  },
  {
    number: '6',
    title: 'Consider the Location',
    content: 'Avoid foraging near busy roads, in areas treated with pesticides, or in polluted waterways. Know the history of your foraging sites.',
  },
];

const EMERGENCY_INFO = {
  title: 'If You Suspect Poisoning',
  steps: [
    'Stop eating immediately',
    'Keep a sample of what was eaten',
    'Note the time of ingestion',
    'Call emergency services (999) or NHS 111',
    'Do not induce vomiting unless advised',
    'Bring the sample to the hospital',
  ],
  contacts: [
    { name: 'Emergency Services', number: '999' },
    { name: 'NHS Non-Emergency', number: '111' },
    { name: 'Poisons Information', number: '0344 892 0111' },
  ],
};

export default function SafetyPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Essential Knowledge</p>
          <h1 className={styles.title}>Foraging <em>Safely</em></h1>
          <p className={styles.intro}>
            Foraging connects us to the land and provides incredible food — but it comes with
            real risks. These guidelines will help you forage safely.
          </p>
        </header>

        <section className={styles.rules}>
          <h2 className={styles.sectionTitle}>The Golden Rules</h2>
          <div className={styles.rulesGrid}>
            {SAFETY_RULES.map((rule) => (
              <div key={rule.number} className={styles.ruleCard}>
                <span className={styles.ruleNumber}>{rule.number}</span>
                <div>
                  <h3 className={styles.ruleTitle}>{rule.title}</h3>
                  <p className={styles.ruleContent}>{rule.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.emergency}>
          <div className={styles.emergencyInner}>
            <h2 className={styles.emergencyTitle}>{EMERGENCY_INFO.title}</h2>
            <div className={styles.emergencyContent}>
              <div className={styles.emergencySteps}>
                <h3>What to do:</h3>
                <ol>
                  {EMERGENCY_INFO.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className={styles.emergencyContacts}>
                <h3>Emergency Contacts</h3>
                {EMERGENCY_INFO.contacts.map((contact) => (
                  <div key={contact.name} className={styles.contactRow}>
                    <span>{contact.name}</span>
                    <strong>{contact.number}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.preparation}>
          <h2 className={styles.sectionTitle}>Preparation &amp; Handling</h2>
          <div className={styles.prepGrid}>
            <div className={styles.prepCard}>
              <h3>Cooking Requirements</h3>
              <p>
                Some wild foods must be cooked before eating. Raw elderberries, for example,
                contain toxins that are destroyed by heat. Always check species-specific
                preparation requirements.
              </p>
            </div>
            <div className={styles.prepCard}>
              <h3>Cleaning</h3>
              <p>
                Wild foods may harbour parasites, bacteria, or environmental contaminants.
                Wash thoroughly before use. Some foragers avoid eating raw wild foods entirely.
              </p>
            </div>
            <div className={styles.prepCard}>
              <h3>Storage</h3>
              <p>
                Many wild foods deteriorate rapidly. Process or consume your harvest promptly.
                When preserving, follow tested recipes and methods to avoid spoilage.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.links}>
          <h2 className={styles.linksTitle}>Related Resources</h2>
          <div className={styles.linksGrid}>
            <Link href="/dangers" className={styles.linkCard}>
              <h3>Dangerous Species</h3>
              <p>Know the toxic plants and fungi to avoid.</p>
            </Link>
            <Link href="/foragers-code" className={styles.linkCard}>
              <h3>The Forager&apos;s Code</h3>
              <p>Ethical principles for sustainable foraging.</p>
            </Link>
            <Link href="/beginners" className={styles.linkCard}>
              <h3>Beginner&apos;s Guide</h3>
              <p>Start your foraging journey the right way.</p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
