import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/ui/Nav';
import styles from '../shared.module.css';

export const metadata: Metadata = {
  title: 'First Aid for Poisoning',
  description: 'What to do if you suspect poisoning from foraged food — symptoms, emergency response, and when to call 999.',
};

export default function FirstAidPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.header} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1708634963641-fb92aa850546?w=1600&q=80')" }}>
          <div className={styles.headerInner}>
            <nav className={styles.breadcrumb}>
              <Link href="/safety">Safety</Link>
              <span>/</span>
              <span>First Aid</span>
            </nav>
            <h1 className={styles.title}>First <em>Aid</em></h1>
            <p className={styles.subtitle}>
              What to do if something goes wrong.
            </p>
          </div>
        </header>

        <article className={styles.content}>
          <div className={styles.warning}>
            <p>
              <strong>Emergency Numbers:</strong> 999 (Emergency) | 111 (NHS Non-Emergency) |
              0344 892 0111 (National Poisons Information Service)
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>If You Suspect Poisoning</h2>
            <div className={styles.prose}>
              <ol>
                <li><strong>Stop eating immediately</strong> — do not finish what&apos;s on your plate.</li>
                <li><strong>Keep a sample</strong> — of what was eaten and any remaining raw material.</li>
                <li><strong>Note the time</strong> — when ingestion occurred.</li>
                <li><strong>Call for help</strong> — 999 if symptoms are severe, 111 otherwise.</li>
                <li><strong>Do not induce vomiting</strong> — unless specifically advised by medical professionals.</li>
                <li><strong>Bring the sample to hospital</strong> — this helps with identification and treatment.</li>
              </ol>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Symptoms to Watch For</h2>
            <div className={styles.prose}>
              <p>
                Symptoms of poisoning vary widely depending on the species. They may appear
                within minutes or be delayed for hours or even days. Watch for:
              </p>
              <ul>
                <li>Nausea, vomiting, diarrhoea</li>
                <li>Abdominal pain or cramping</li>
                <li>Dizziness, confusion, drowsiness</li>
                <li>Sweating, salivation, or dry mouth</li>
                <li>Visual disturbances</li>
                <li>Difficulty breathing</li>
                <li>Irregular heartbeat</li>
              </ul>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Delayed Symptoms</h2>
            <div className={styles.prose}>
              <p>
                Some of the most dangerous poisonings show delayed symptoms. Death Cap and
                Destroying Angel mushrooms may cause no symptoms for 6-12 hours, then severe
                illness. Webcap mushrooms can delay symptoms for up to two weeks.
              </p>
              <p>
                <strong>If you have eaten something you are now unsure about</strong>, seek
                medical advice even if you feel fine. Early treatment can be lifesaving.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>At the Hospital</h2>
            <div className={styles.prose}>
              <p>
                Bring any samples of what was eaten — raw material, cooked remains, photographs.
                The more information you can provide, the faster appropriate treatment can begin.
              </p>
              <p>
                Be prepared to describe: what was eaten, how much, when, where it was found,
                and how it was prepared.
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
