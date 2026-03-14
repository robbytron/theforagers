import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div>
          <div className={styles.footerBrand}>The <em>Foragers</em></div>
          <p className={styles.footerTagline}>Wild food of Britain</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerCol}>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/species">Species</Link></li>
              <li><Link href="/calendar">Calendar</Link></li>
              <li><Link href="/where-to-forage">Where to Forage</Link></li>
              <li><Link href="/coastal">Coastal</Link></li>
              <li><Link href="/beginners">Beginners</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Learn</h4>
            <ul>
              <li><Link href="/recipes">Recipes</Link></li>
              <li><Link href="/guides">Guides</Link></li>
              <li><Link href="/prepare-and-preserve">Prepare & Preserve</Link></li>
              <li><Link href="/field-guides-and-kit">Field Guides & Kit</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Safety</h4>
            <ul>
              <li><Link href="/dangers">Dangers</Link></li>
              <li><Link href="/safety">Safety</Link></li>
              <li><Link href="/legal">Legal</Link></li>
              <li><Link href="/foragers-code">The Code</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Journal</h4>
            <ul>
              <li><Link href="/journal/in-season">In Season</Link></li>
              <li><Link href="/journal/the-field">The Field</Link></li>
              <li><Link href="/journal/the-land">The Land</Link></li>
              <li><Link href="/journal/wild-table">Wild Table</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>About</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/newsletter">Newsletter</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p className={styles.footerLegal}>© {year} The Foragers.</p>
        <p className={styles.footerSafety}>Never eat anything you cannot positively identify.</p>
      </div>
    </footer>
  );
}
