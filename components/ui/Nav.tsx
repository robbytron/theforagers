import Link from 'next/link';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>The Foragers <span style={{color: 'red', fontSize: '10px'}}>v3</span></Link>
      <ul className={styles.links}>
        <li><Link href="/species">Species</Link></li>
        <li><Link href="/calendar">Calendar</Link></li>
        <li><Link href="/beginners">Beginners</Link></li>
      </ul>
    </nav>
  );
}
