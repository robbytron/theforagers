import Link from 'next/link';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>The Foragers</Link>
      <ul className={styles.links}>
        <li><Link href="/species">Species</Link></li>
        <li><Link href="/calendar">Calendar</Link></li>
        <li><Link href="/recipes">Recipes</Link></li>
        <li><Link href="/guides">Guides</Link></li>
        <li><Link href="/dangers">Dangers</Link></li>
      </ul>
    </nav>
  );
}
