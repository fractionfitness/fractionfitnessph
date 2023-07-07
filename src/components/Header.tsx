'use client';

import Link from 'next/link';
// import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import styles from './Header.module.css';
import { cn } from '@/lib/utils';
import LogoAvatar from './LogoAvatar';
import { Icons } from '@/components/Icons';
import NavAccount from './NavAccount';

export default function Header() {
  const currentUrl = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <nav className={styles.nav}>
        <Link href={'/'} className="items-center flex mx-4 space-x-2">
          {/* <Image src="/ffph-logo.jpg" width={45} height={45} alt="FFPH Logo" /> */}
          <LogoAvatar
            src="/ffph-logo.jpg"
            alt="FFPH Logo"
            className="rounded-md"
            fallbackIcon={<Icons.logoPlaceholder className="h-10 w-10" />}
          />
          <span className="inline-block font-semibold text-lg text-foreground">
            Fraction Fitness PH
          </span>
        </Link>
        <ul className={cn(styles.links, 'text-muted-foreground')}>
          {/* client components cannot import server components */}
          {/* {currentUrl.startsWith('/dashboard') && (
            <li>
              <p>Dashboard: </p>&nbsp;
            </li>
          )}
          {currentUrl.startsWith('/dashboard/group') && (
            <li>
              <SelectUserGroup groups={groups} />
            </li>
          )} */}
          {/* ----------------delete this after------------------- */}

          {session && currentUrl === '/' && (
            <li className={cn(styles.links, 'hover:text-foreground')}>
              <Link href={'/dashboard/user'}>UserDash</Link>
            </li>
          )}
          {session && currentUrl === '/' && (
            <li className={cn(styles.links, 'hover:text-foreground')}>
              <Link href={'/dashboard/group'}>GroupDash</Link>
            </li>
          )}
          {/* ----------------delete this after------------------- */}
          {!session && (
            <>
              <li className={cn(styles.links, 'hover:text-foreground')}>
                <Link href={`/api/auth/signin?callbackUrl=${currentUrl}`}>
                  Sign in
                </Link>
              </li>
              <li className={cn(styles.links, 'hover:text-foreground')}>
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
