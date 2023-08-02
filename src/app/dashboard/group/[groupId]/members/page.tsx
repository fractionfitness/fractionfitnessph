import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MemberRole, MemberStatus } from '@prisma/client';
import AddUserCommand from '@/components/AddUserCommand';
import GroupUserOptions from '@/components/GroupUserOptions';
import { memberContent } from '@/config';
import { editMember, removeMember } from '@/actions/user';

function Member({ groupUser }) {
  return (
    <div className="w-fit flex flex-row space-x-2 space-y-2">
      <p></p>
      <p className="border border-white rounded-lg pt-2  p-1 px-2">
        {groupUser.userProfile.full_name}
      </p>
      <p className="border border-white rounded-lg pt-2 p-1 px-2">
        {groupUser.group.name}
      </p>
      <p className="border border-white rounded-lg pt-2 p-1 px-2">
        {groupUser.role.charAt(0)}
      </p>
      <GroupUserOptions
        mode="member"
        groupUser={groupUser}
        roles={Object.keys(MemberRole)}
        statuses={
          MemberStatus ? Object.keys(MemberStatus) : memberContent.userStatus
        }
        editUser={editMember}
        removeUser={removeMember}
      />
      {/* add <p>member_status to Model</p> */}
      {/* add member_activity 3-mo moving average of session checkins | should be another column computed by a cronJob */}
      {/* Permissions to edit, delete, and add member should depend on employee's group role */}
    </div>
  );
}

export default async function UserGroups({ params: { groupId } }) {
  try {
    // console.log('params check===>', groupId);
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

        <AddUserCommand mode="member" />
        {/* <AddUserCommand mode="employment" /> */}

        {groupMembers.length > 0 && (
          <div className="flex flex-col justify-center">
            {groupMembers.map((member) => (
              <Member key={member.id} groupUser={member} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
