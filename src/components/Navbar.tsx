'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import styles from './Navbar.module.css';
import UserAvatar from './Shared/UserAvatar';

export default function Navbar() {
  const currentUrl = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className={styles.nav}>
      <Link href={'/'}>
        {/* <Image src="/ffph-logo.jpg" width={45} height={45} alt="FFPH Logo" /> */}
        <UserAvatar src="/ffph-logo.jpg" alt="FFPH Logo" />
        <span>Fraction Fitness PH</span>
      </Link>
      <ul className={styles.links}>
        {/* ----------------delete this after------------------- */}
        <li>
          <Link href={'/dashboard/user'}>UserDashboard</Link>
        </li>
        {/* ----------------delete this after------------------- */}
        {!session && (
          <>
            <li>
              <Link href={`/api/auth/signin?callbackUrl=${currentUrl}`}>
                Sign in
              </Link>
            </li>
            <li>
              <Link href={'/register'}>Register</Link>
            </li>
          </>
        )}
        {session && (
          <>
            <li>
              <UserAvatar src="https://github.com/shadcn.png" alt="@shadcn" />
            </li>
            <li>
              <Link href={'/api/auth/signout?callbackUrl=/'}>Sign out</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
