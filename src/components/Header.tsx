'use client';

import Link from 'next/link';
// import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import styles from './Header.module.css';
import LogoAvatar from './LogoAvatar';
import { Icons } from '@/components/Icons';
import NavAccount from './NavAccount';

export default function Header() {
  const currentUrl = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900 text-slate-300">
      <nav className={styles.nav}>
        <Link href={'/'} className="items-center flex mx-4 space-x-2">
          {/* <Image src="/ffph-logo.jpg" width={45} height={45} alt="FFPH Logo" /> */}
          <LogoAvatar
            src="/ffph-logo.jpg"
            alt="FFPH Logo"
            className="rounded-md"
            fallbackIcon={<Icons.logoPlaceholder className="h-10 w-10" />}
          />
          <span className="inline-block font-semibold text-lg">
            Fraction Fitness PH
          </span>
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
                {/* <LogoAvatar
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="h-10 w-10"
                  fallbackIcon={<Icons.user className="h-10 w-10" />}
                /> */}
                <NavAccount user={session.user} />
              </li>
              {/* <li>
                <Link href={'/api/auth/signout?callbackUrl=/'}>Sign out</Link>
              </li> */}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
