import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AddUserCommand from '@/components/AddUserCommand';
import { DataTable } from '@/components/DataTable';
import { Member as MemberColumns, columns } from './columns';

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

    // INSERT FUNCTION HERE THAT GETS ALL OF THE GROUP'S DESCENDANTS AND CREATES A HIERARCHY
    const groupAndDescendantsNames = [group?.name, 'test group'];

    // const groupMembers = group?.members.map((member) => ({
    //   // ...member,
    //   id: member.id,
    //   role: member.role,
    //   group,
    //   user: { id: member.user.id, email: member.user.email },
    //   userProfile: member.user.profile,
    // }));

    const groupMembers: MemberColumns[] = group?.members.map(
      ({ user, role, id }) => ({
        id, // member id
        name: user.profile?.full_name!,
        email: user.email,
        group: group.name,
        user_id: user.id,
        group_id: group.id,
        role,
        // status,
      }),
    )!;

    return (
      <div className="space-y-2">
        <hr />
        <p>Group Members</p>

        <AddUserCommand mode="member" />

        <div className="container mx-auto mt-1 mb-1">
          <DataTable
            columns={columns}
            data={groupMembers}
            groups={groupAndDescendantsNames}
          />
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
