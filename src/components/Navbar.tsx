import Link from 'next/link';
import Image from 'next/image';

import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href={'/'}>
        <Image src="/ffph-logo.jpg" width={45} height={45} alt="FFPH Logo" />
        Fraction Fitness PH
      </Link>
      <ul className={styles.links}>
        {/* ----------------delete this after------------------- */}
        <li>
          <Link href={'/dashboard/user'}>UserDashboard</Link>
        </li>
        {/* ----------------delete this after------------------- */}
        <li>
          <Link href={'/api/auth/signin'}>Sign in</Link>
        </li>
        <li>
          <Link href={'/api/auth/signout'}>Sign out</Link>
        </li>
        <li>
          <Link href={'/register'}>Register</Link>
        </li>
      </ul>
    </nav>
  );
}
