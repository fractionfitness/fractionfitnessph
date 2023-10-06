import Link from 'next/link';

import { buttonVariants } from '@/components/ui-shadcn/Button';
import React from 'react';

export default async function RootLayout({
  children,
  params: { groupId },
}: {
  children: React.ReactNode;
  params: {
    groupId: string;
  };
}) {
  return (
    <>
      {/* NavGroupDashboard */}
      <nav>
        <ul className="m-2 space-x-1 flex justify-center">
          <li>
            <Link
              href={`/dashboard/group/${groupId}/front-desk`}
              className={buttonVariants({ variant: 'default' })}
            >
              Front Desk
            </Link>
          </li>
          <li>
            <Link
              href={`/dashboard/group/${groupId}/members`}
              className={buttonVariants({ variant: 'default' })}
            >
              Members
            </Link>
          </li>
          <li>
            <Link
              href={`/dashboard/group/${groupId}/employees`}
              className={buttonVariants({ variant: 'default' })}
            >
              Employees
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
}
