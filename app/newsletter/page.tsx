import type { Metadata } from 'next';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Subscribe to The Foragers newsletter — seasonal foraging updates, new species guides, and field notes delivered to your inbox.',
};

export default function NewsletterPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>Stay Updated</p>
          <h1 className={styles.title}>The Foragers <em>Newsletter</em></h1>
          <p className={styles.intro}>
            Seasonal updates on what&apos;s out there, new guides and recipes, and
            occasional notes from the field. No spam, just wild food.
          </p>
        </header>

        <section className={styles.signup}>
          <div className={styles.signupBox}>
            <h2 className={styles.signupTitle}>What you&apos;ll receive</h2>
            <ul className={styles.benefits}>
              <li>Weekly updates on what&apos;s in season right now</li>
              <li>New species guides and recipes as they&apos;re published</li>
              <li>Seasonal foraging tips and safety reminders</li>
              <li>Occasional field notes and stories</li>
            </ul>
            <div className={styles.formPlaceholder}>
              <p>Newsletter signup coming soon.</p>
              <p className={styles.small}>We&apos;re setting up our mailing list. Check back shortly.</p>
            </div>
          </div>
        </section>

        <section className={styles.promise}>
          <h3>Our Promise</h3>
          <p>
            We respect your inbox. You&apos;ll receive one email per week during peak season,
            less frequently in winter. No selling your data, no third-party marketing,
            and you can unsubscribe at any time.
          </p>
        </section>
      </main>
    </>
  );
}
