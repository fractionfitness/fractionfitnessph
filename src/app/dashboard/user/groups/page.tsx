import Link from 'next/link';

import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { buttonVariants } from '@/components/ui-shadcn/Button';

export default async function UserGroups({}) {
  const session = await getAuthSession();

  const user = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      groups: true,
      employments: true,
      memberships: true,
    },
  });

  const ownedGroups = user.groups;

  const [...employmentGroups] = await prisma.$transaction([
    ...user.employments.map((employment) =>
      prisma.group.findFirst({
        where: {
          id: employment.group_id,
        },
      }),
    ),
  ]);

  const [...membershipGroups] = await prisma.$transaction([
    ...user.memberships.map((membership) =>
      prisma.group.findFirst({
        where: {
          id: membership.group_id,
        },
      }),
    ),
  ]);

  // console.log('employmentGroups', employmentGroups);
  // console.log('membershipGroups', membershipGroups);

  return (
    <div>
      <p>/dashboard/user/groups</p>

      <p>Owned Groups</p>
      {ownedGroups.length > 0 &&
        ownedGroups.map((group) => (
          <Link
            href={`/dashboard/group/${group.id}`}
            key={group.id}
            className={buttonVariants({ variant: 'default' })}
          >
            {group.name}
          </Link>
        ))}

      <p>Employers</p>
      {employmentGroups.length > 0 &&
        employmentGroups.map((group) => (
          <Link
            href={`/dashboard/group/${group.id}`}
            key={group.id}
            className={buttonVariants({ variant: 'default' })}
          >
            {group.name}
          </Link>
        ))}

      <p>Memberships</p>
      {membershipGroups.length > 0 &&
        membershipGroups.map((group) => (
          <Link
            href={`/dashboard/group/${group.id}`}
            key={group.id}
            className={buttonVariants({ variant: 'default' })}
          >
            {group.name}
          </Link>
        ))}
    </div>
  );
}
