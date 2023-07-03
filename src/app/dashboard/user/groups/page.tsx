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
      <ul className="flex space-x-2 justify-center">
        {group.roles.map((role) => (
          <li key={role} className="lowercase">
            {role}
          </li>
        ))}
      </ul>
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

    // not needed since references to user's owned groups is already included in employmentGroups
    // const ownedGroups = user.groups.map((group) => ({
    //   ...group,
    //   role: 'OWNER',
    // }));

    const employmentGroups = user?.employments.map((employment) => ({
      ...employment.group,
      role: employment.role,
    }));
    const membershipGroups = user?.memberships.map((membership) => ({
      ...membership.group,
      role: membership.role,
    }));

    // user's group records
    const userGroupRecords = [...employmentGroups, ...membershipGroups];

    // collate all of user's roles for each group | make sure no repetition in group[] and group element's roles[]
    let userGroupsCollated = userGroupRecords.reduce((acc, group) => {
      // check if group already exists in accumulator
      let groupMatch;
      acc.forEach((g, i) => {
        let skipCheck = false;
        if (skipCheck) return; // will not break out of loop but will skip the following "if" block
        if (g.id === group.id) {
          groupMatch = { index: i, data: g };
          skipCheck = true;
          return;
        }
      });

      // no group matches in acc
      if (!groupMatch) {
        // add group record to acc, modifying group's role into an array
        const { role, ...groupProperties } = group;
        acc.push({ ...groupProperties, roles: [role] });
        return acc;
      } else {
        // add user's role to matched group in acc
        groupMatch.data.roles.push(group.role);
        acc.splice(groupMatch.index, 1, groupMatch.data);
        return acc;
      }
    }, []);

    // console.log('userGroupRecords', userGroupRecords);
    // console.log('userGroupsCollated', userGroupsCollated);

    return (
      <div className="space-y-2">
        <hr />
        <p>User&apos;s Groups</p>
        <div className="flex flex-row justify-center">
          {userGroupsCollated.length > 0 &&
            userGroupsCollated.map((group) => (
              <GroupLink key={group.id} group={group} />
            ))}
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
