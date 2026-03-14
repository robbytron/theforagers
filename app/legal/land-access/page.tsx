import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Land Access for Foraging',
  description: 'Where you can and cannot forage in the UK — public land, private land, national parks, and access rights.',
};

export default function LandAccessPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/legal">Legal</Link>
              <span>/</span>
              <span>Land Access</span>
            </nav>
            <h1 className={styles.title}>Land <em>Access</em></h1>
            <p className={styles.subtitle}>
              Where you can and cannot forage in Britain.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Public Rights of Way</h2>
            <div className={styles.prose}>
              <p>
                Footpaths and bridleways cross private land but give you the right to pass along
                them. You can forage for personal use <strong>on the path itself</strong> and
                within reaching distance, but you cannot leave the path to harvest.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Access Land (CRoW Act)</h2>
            <div className={styles.prose}>
              <p>
                The Countryside and Rights of Way Act 2000 created &ldquo;access land&rdquo; —
                mapped areas of mountain, moor, heath, and down where you can walk freely. However,
                the right to roam does not automatically include foraging rights. Check locally.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>National Parks</h2>
            <div className={styles.prose}>
              <p>
                National Parks are not publicly owned — they contain a mix of private land,
                common land, and public land. Rules vary by area. Personal foraging is generally
                tolerated but commercial foraging requires specific permissions.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Private Land</h2>
            <div className={styles.prose}>
              <p>
                You need the landowner&apos;s permission to forage on private land. Trespass is
                a civil matter (not criminal) in England and Wales, but you can be asked to leave
                and may face legal action for damages if you refuse or cause harm.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>SSSIs and Nature Reserves</h2>
            <div className={styles.prose}>
              <p>
                <strong>Sites of Special Scientific Interest (SSSIs)</strong> have stricter rules.
                Many activities require consent from Natural England. Contact them before foraging.
              </p>
              <p>
                <strong>Nature Reserves</strong> often prohibit foraging entirely. Check with
                the managing organisation before visiting.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Forestry England Land</h2>
            <div className={styles.prose}>
              <p>
                Public forests managed by Forestry England often allow personal foraging, but
                check site-specific rules. Some areas restrict mushroom picking during peak season.
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
