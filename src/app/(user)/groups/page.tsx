import Link from 'next/link';

import { getAuthSession } from '@/lib/auth';
import { buttonVariants } from '@/components/ui-shadcn/Button';
import getUserGroups from '@/lib/prismaQueries/getUserGroups';

export const dynamic = 'force-dynamic';

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

export default async function Page({}) {
  try {
    const session = await getAuthSession();
    const userGroupsCollated = await getUserGroups(session?.user);

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
