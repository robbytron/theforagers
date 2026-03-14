import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'About The Foragers — our mission, approach, and the experts behind our guides.',
};

const ABOUT_SECTIONS = [
  {
    href: '/about/the-site',
    title: 'The Site',
    description: 'What we\'re building and why. Our mission to create the definitive UK foraging resource.',
  },
  {
    href: '/about/our-approach',
    title: 'Our Approach',
    description: 'How we research, verify, and present information. Our commitment to accuracy and safety.',
  },
  {
    href: '/about/expert-reviewer',
    title: 'Expert Reviewer',
    description: 'Meet the botanists, mycologists, and field experts who verify our content.',
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.label}>About Us</p>
          <h1 className={styles.title}>Behind <em>The Foragers</em></h1>
          <p className={styles.intro}>
            We believe wild food knowledge should be accessible, accurate, and presented with the
            respect it deserves. Here&apos;s who we are and how we work.
          </p>
        </header>

        <section className={styles.sections}>
          {ABOUT_SECTIONS.map((section) => (
            <Link key={section.href} href={section.href} className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionDesc}>{section.description}</p>
              <span className={styles.sectionLink}>Read more &rarr;</span>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
