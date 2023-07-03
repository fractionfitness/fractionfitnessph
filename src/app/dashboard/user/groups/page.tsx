import Link from 'next/link';

import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { buttonVariants } from '@/components/ui-shadcn/Button';

function GroupLink({ group }) {
  return (
    <div className="w-fit border border-white">
      <Link
        href={`/dashboard/group/${group.id}`}
        className={buttonVariants({ variant: 'default' })}
      >
        <p>{group.name}</p>
      </Link>
      {/* make this a pillbox */}
      <p className="lowercase">{group.role}</p>
    </div>
  );
}

export default async function UserGroups({}) {
  try {
    const session = await getAuthSession();

    const user = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
      include: {
        groups: true,
        employments: {
          include: {
            group: true,
          },
        },
        memberships: {
          include: {
            group: true,
          },
        },
      },
    });

    // solution if using sequential operations via transaction API
    // const [...employmentGroups] = await prisma.$transaction([
    //   ...user.employments.map((employment) =>
    //     prisma.group.findFirst({
    //       where: {
    //         id: employment.group_id,
    //       },
    //     }),
    //   ),
    // ]);

    // const [...membershipGroups] = await prisma.$transaction([
    //   ...user.memberships.map((membership) =>
    //     prisma.group.findFirst({
    //       where: {
    //         id: membership.group_id,
    //       },
    //     }),
    //   ),
    // ]);

    const ownedGroups = user.groups.map((group) => ({
      ...group,
      role: 'OWNER',
    }));

    const employmentGroups = user?.employments.map((employment) => ({
      ...employment.group,
      role: employment.role,
    }));
    const membershipGroups = user?.memberships.map((membership) => ({
      ...membership.group,
      role: membership.role,
    }));

    return (
      <div className="space-y-2">
        <p>/dashboard/user/groups</p>

        <hr />
        <p>Owned Groups</p>
        <div className="flex flex-row justify-center">
          {ownedGroups.length > 0 &&
            ownedGroups.map((group) => (
              <GroupLink key={group.id} group={group} />
            ))}
        </div>

        <hr />
        <p>Employers</p>
        <div className="flex flex-row justify-center">
          {employmentGroups.length > 0 &&
            employmentGroups.map((group) => (
              <GroupLink key={group.id} group={group} />
            ))}
        </div>

        <hr />
        <p>Memberships</p>
        <div className="flex flex-row justify-center">
          {membershipGroups.length > 0 &&
            membershipGroups.map((group) => (
              <GroupLink key={group.id} group={group} />
            ))}
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
