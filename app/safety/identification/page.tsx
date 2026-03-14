import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Safe Identification',
  description: 'How to identify wild plants and fungi safely — the rule of three, using field guides, and when not to pick.',
};

export default function IdentificationPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/safety">Safety</Link>
              <span>/</span>
              <span>Identification</span>
            </nav>
            <h1 className={styles.title}>Safe <em>Identification</em></h1>
            <p className={styles.subtitle}>
              How to be certain before you eat anything.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>The Rule of Three</h2>
            <div className={styles.prose}>
              <p>
                Never rely on a single identifying feature. For every species you intend to eat,
                you should be able to confirm <strong>at least three independent characteristics</strong>
                that match your identification.
              </p>
              <p>
                For example, identifying wild garlic requires: the distinctive garlic smell when
                crushed, the broad lance-shaped leaves, and the white star-shaped flowers or
                characteristic habitat in damp woodland.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Using Field Guides</h2>
            <div className={styles.prose}>
              <p>
                Physical field guides remain invaluable. Digital resources can fail when you need
                them most — out of signal range, in rain, with a dying battery.
              </p>
              <ul>
                <li>Use guides specific to Britain — American or European guides may show different species or distributions.</li>
                <li>Cross-reference with multiple sources if possible.</li>
                <li>Pay close attention to the &ldquo;similar species&rdquo; sections.</li>
                <li>Note the distribution maps — not all species grow everywhere.</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>When Not to Pick</h2>
            <div className={styles.prose}>
              <p>
                If any of the following apply, do not eat what you&apos;ve found:
              </p>
              <ul>
                <li>You are not 100% certain of the identification</li>
                <li>You have not checked for toxic lookalikes</li>
                <li>The specimen is old, damaged, or atypical</li>
                <li>You cannot verify all key identification features</li>
                <li>Your field guide says &ldquo;expert identification required&rdquo;</li>
              </ul>
            </div>
            <div className={styles.warning}>
              <p>
                <strong>When in doubt, leave it out.</strong> No meal is worth the risk of
                serious poisoning.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Building Experience</h2>
            <div className={styles.prose}>
              <p>
                Start with easy species that have no dangerous lookalikes. Master these completely
                before moving on. Consider joining guided forays with experienced foragers to
                build confidence under supervision.
              </p>
            </div>
          </section>
        </article>

        <div className={styles.backLink}>
          <Link href="/safety">&larr; Back to Safety Guide</Link>
        </div>
      </main>
    </>
  );
}
