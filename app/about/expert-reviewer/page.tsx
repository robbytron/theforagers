import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'Expert Reviewer',
  description: 'Meet the botanists, mycologists, and field experts who verify The Foragers content.',
};

export default function ExpertReviewerPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/about">About</Link>
              <span>/</span>
              <span>Expert Reviewer</span>
            </nav>
            <h1 className={styles.title}>Expert <em>Review</em></h1>
            <p className={styles.subtitle}>
              Our content is verified by qualified specialists to ensure accuracy and safety.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Why Expert Review Matters</h2>
            <div className={styles.prose}>
              <p>
                Foraging involves life-and-death decisions. A single misidentification can have
                devastating consequences. That&apos;s why we don&apos;t publish identification
                guides without verification from people who truly know their field.
              </p>
              <p>
                Our reviewers aren&apos;t hobbyists — they&apos;re specialists with years of
                academic training and practical field experience. They check our work against
                their own knowledge and flag anything that needs correction or clarification.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Review Team</h2>
            <div className={styles.prose}>
              <p>
                Content on The Foragers is reviewed by specialists including:
              </p>
              <ul>
                <li>
                  <strong>Botanists</strong> — Experts in plant taxonomy and identification,
                  with particular knowledge of British flora.
                </li>
                <li>
                  <strong>Mycologists</strong> — Fungi specialists who can distinguish edible
                  species from their dangerous lookalikes.
                </li>
                <li>
                  <strong>Professional Foragers</strong> — Experienced practitioners who lead
                  foraging courses and understand practical field identification.
                </li>
                <li>
                  <strong>Ethnobotanists</strong> — Researchers who study traditional plant use
                  and historical foraging practices.
                </li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>The Review Process</h2>
            <div className={styles.prose}>
              <p>
                Each species guide goes through several stages before publication:
              </p>
              <ul>
                <li>
                  <strong>Research and drafting</strong> — We compile information from multiple
                  authoritative sources.
                </li>
                <li>
                  <strong>Expert review</strong> — A qualified specialist checks all identification
                  features, safety information, and culinary guidance.
                </li>
                <li>
                  <strong>Revision</strong> — We address any concerns raised during review.
                </li>
                <li>
                  <strong>Final check</strong> — The reviewer confirms the guide is accurate
                  and safe to publish.
                </li>
              </ul>
              <p>
                This process takes time, but accuracy cannot be rushed.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Join Our Review Team</h2>
            <div className={styles.prose}>
              <p>
                If you have relevant qualifications and would like to contribute to our review
                process, we&apos;d love to hear from you. We&apos;re particularly interested in
                specialists with expertise in British fungi, coastal plants, and regional flora.
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
