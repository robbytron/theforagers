import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Protected Species',
  description: 'Plants you cannot pick in the UK — Schedule 8 protected species under the Wildlife and Countryside Act.',
};

export default function ProtectedSpeciesPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/legal">Legal</Link>
              <span>/</span>
              <span>Protected Species</span>
            </nav>
            <h1 className={styles.title}>Protected <em>Species</em></h1>
            <p className={styles.subtitle}>
              Plants you cannot pick under any circumstances.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Schedule 8 Plants</h2>
            <div className={styles.prose}>
              <p>
                Schedule 8 of the Wildlife and Countryside Act 1981 lists plants that receive
                full legal protection. It is an offence to pick, uproot, or destroy these
                species, or to sell them, without a licence.
              </p>
              <p>
                Protected species with foraging relevance include:
              </p>
              <ul>
                <li><strong>Wild Leek</strong> (Allium ampeloprasum var. babingtonii)</li>
                <li><strong>Shore Dock</strong> (Rumex rupestris)</li>
                <li><strong>Plymouth Pear</strong> (Pyrus cordata)</li>
                <li><strong>Various orchid species</strong></li>
              </ul>
              <p>
                The full list contains over 100 species. Before foraging any unfamiliar plant,
                check whether it has protected status.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Penalties</h2>
            <div className={styles.prose}>
              <p>
                Offences under the Wildlife and Countryside Act can result in fines of up to
                £5,000 per plant and potential imprisonment for serious cases. Ignorance is
                not a defence.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Practical Advice</h2>
            <div className={styles.prose}>
              <p>
                Most common edible species are not protected. However, if you encounter
                something rare or unfamiliar, leave it alone. Report unusual finds to your
                local wildlife trust — they&apos;ll appreciate the sighting.
              </p>
            </div>
          </section>
        </article>

        <div className={styles.backLink}>
          <Link href="/legal">&larr; Back to Legal Guide</Link>
        </div>
      </main>
    </>
  );
}
