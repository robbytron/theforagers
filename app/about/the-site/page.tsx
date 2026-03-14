import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'The Site',
  description: 'What The Foragers is building and why — our mission to create the definitive UK foraging resource.',
};

export default function TheSitePage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/about">About</Link>
              <span>/</span>
              <span>The Site</span>
            </nav>
            <h1 className={styles.title}>What we&apos;re <em>building</em></h1>
            <p className={styles.subtitle}>
              The Foragers aims to be the most comprehensive, accurate, and beautifully presented
              foraging resource for Britain.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <div className={styles.prose}>
              <p>
                Britain has an extraordinary wealth of wild food — from coastal samphire to woodland
                mushrooms, hedgerow berries to meadow herbs. Yet this knowledge, once commonplace,
                has become fragmented and obscure.
              </p>
              <p>
                We&apos;re building The Foragers to change that. Our goal is simple: to create a
                resource that is <strong>comprehensive enough</strong> to cover every edible species
                in Britain, <strong>accurate enough</strong> to be trusted with your safety, and
                <strong> accessible enough</strong> for anyone to use — from complete beginners to
                experienced foragers.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What We Cover</h2>
            <div className={styles.prose}>
              <ul>
                <li>
                  <strong>Species Guides</strong> — Detailed identification guides for edible plants,
                  fungi, and seaweeds found in Britain, with photographs, lookalike warnings, and
                  culinary guidance.
                </li>
                <li>
                  <strong>Seasonal Calendar</strong> — Know what&apos;s available each month, so you
                  can plan your foraging trips around nature&apos;s timetable.
                </li>
                <li>
                  <strong>Safety Information</strong> — Clear, thorough coverage of poisonous species,
                  safe foraging practices, and first aid guidance.
                </li>
                <li>
                  <strong>Recipes</strong> — Traditional and contemporary recipes that make the most
                  of your wild harvest.
                </li>
                <li>
                  <strong>Preservation</strong> — Techniques for drying, pickling, fermenting, and
                  storing wild foods.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Always Evolving</h2>
            <div className={styles.prose}>
              <p>
                The Foragers is a living project. We&apos;re constantly adding new species, refining
                our guides, and incorporating feedback from the foraging community. If you spot an
                error or have suggestions, we want to hear from you.
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
