import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Wild Table — Journal',
  description: 'Cooking with foraged ingredients — meals, experiments, and lessons from the kitchen.',
};

export default function WildTablePage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1695088957803-0f2bf5d2d202?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/journal">Journal</Link>
              <span>/</span>
              <span>Wild Table</span>
            </nav>
            <h1 className={styles.title}>Wild <em>Table</em></h1>
            <p className={styles.subtitle}>
              Cooking with foraged ingredients.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <p className={styles.intro}>
            What we cooked, how it turned out, and what we learned. Meals built around
            foraged ingredients, from simple preparations to more ambitious experiments.
          </p>

          <div className={styles.comingSoon}>
            <h2>Coming Soon</h2>
            <p>
              We&apos;re documenting our kitchen experiments. Check back soon for
              stories of cooking with wild food.
            </p>
          </div>
        </article>

        <div className={styles.backLink}>
          <Link href="/journal">&larr; Back to Journal</Link>
        </div>
      </main>
    </>
  );
}
