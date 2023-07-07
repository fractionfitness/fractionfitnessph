import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

function Member({ member }) {
  return (
    <div className="w-fit flex flex-row space-x-2 space-y-2">
      <p></p>
      <p className="border border-foreground rounded-lg p-1">
        {member.userProfile.full_name}
      </p>
      <p className="border border-foreground rounded-lg p-1">
        {member.group.name}
      </p>
      <p className="border border-foreground rounded-lg p-1">{member.role}</p>
      {/* add this column */}
      {/* <p>member_status</p> */}
      {/* should be another column computed by a cronJob */}
      {/* <p>checkins/mo</p> */}
      {/* Add call-to-action to edit, delete, and add member depending on employee's group role */}
    </div>
  );
}

export default async function UserGroups({ params: { groupId } }) {
  try {
    console.log('params check===>', groupId);
    const session = await getAuthSession();

    // currently only querying one group at a time
    // correct query should search children and all descendants?
    const group = await prisma.group.findFirst({
      where: {
        id: +groupId,
      },
      include: {
        members: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });

    const groupMembers = group?.members.map((member) => ({
      // ...member,
      id: member.id,
      role: member.role,
      group,
      user: { id: member.user.id, email: member.user.email },
      userProfile: member.user.profile,
    }));

    return (
      <div className="space-y-2">
        <hr />
        <p>Group Members</p>
        <div className="flex flex-col justify-center">
          {groupMembers.length > 0 &&
            groupMembers.map((member) => (
              <Member key={member.id} member={member} />
            ))}
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
