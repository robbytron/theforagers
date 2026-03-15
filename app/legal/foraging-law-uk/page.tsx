import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Foraging Law UK',
  description: 'The law on foraging in the UK explained — what you can pick, where, and the legal framework for wild food gathering.',
};

export default function ForagingLawPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1638215640795-e5f064d3e0c9?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/legal">Legal</Link>
              <span>/</span>
              <span>The Law Explained</span>
            </nav>
            <h1 className={styles.title}>Foraging Law <em>Explained</em></h1>
            <p className={styles.subtitle}>
              The legal framework for picking wild food in Britain.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>The Basic Rule</h2>
            <div className={styles.prose}>
              <p>
                In England and Wales, you can pick the &ldquo;four Fs&rdquo; — <strong>fungi,
                flowers, foliage, and fruit</strong> — growing wild on public land for personal
                use without permission.
              </p>
              <p>
                This right comes from case law and custom rather than statute. It applies to
                genuinely wild plants, not cultivated ones, and only for personal consumption —
                not commercial sale.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>The Wildlife and Countryside Act 1981</h2>
            <div className={styles.prose}>
              <p>
                The key piece of legislation affecting foragers is the Wildlife and Countryside
                Act 1981. Under this Act:
              </p>
              <ul>
                <li><strong>Uprooting any wild plant</strong> without the landowner&apos;s permission is illegal, regardless of species.</li>
                <li><strong>Protected species</strong> (listed in Schedule 8) cannot be picked, uprooted, or destroyed at all without a licence.</li>
                <li>These rules apply to <strong>all land</strong>, public and private.</li>
              </ul>
              <p>
                The distinction between &ldquo;picking&rdquo; and &ldquo;uprooting&rdquo; is
                important. You can pick leaves, flowers, and fruits without permission, but you
                cannot dig up roots or remove the whole plant.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Use vs Commercial</h2>
            <div className={styles.prose}>
              <p>
                The right to forage applies to <strong>personal use only</strong>. If you intend
                to sell what you pick, different rules apply:
              </p>
              <ul>
                <li>You always need landowner permission for commercial foraging</li>
                <li>Local bylaws may restrict commercial harvesting in parks and public spaces</li>
                <li>Food hygiene regulations apply if you&apos;re selling to the public</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Scotland</h2>
            <div className={styles.prose}>
              <p>
                Scotland has different access laws under the Land Reform (Scotland) Act 2003.
                The Scottish Outdoor Access Code gives broader access rights, but the same
                principles of responsible foraging apply. Commercial foraging still requires
                permission.
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
