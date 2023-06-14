'use client';

import { useSession } from 'next-auth/react';
import { usePathname, redirect } from 'next/navigation';

export default function UserDashboard() {
  const currentUrl = usePathname();
  const { data: session, status } = useSession({
    // required: true,
    // already default config | not needed
    // onUnauthenticated() {
    //   redirect(`/api/auth/signin?callbackUrl=${currentUrl}`);
    // },
  });
  console.log('status====>', status);
  console.log('session====>', session);
  return <>UserDashboard</>;
}
