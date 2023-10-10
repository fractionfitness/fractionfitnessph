'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

// temporary solution for the member search bar
// members should just be passed to the checkin component beforehand and just a filter function on the array
// diff function to be used to search guests(no accounts) and visitors(users w/ accounts but not a member)
export async function searchMemberAction(
  query: string,
  groupId: number | null,
) {
  // console.log('searching members...', query, groupId);
  if (query.length === 0 || !groupId) return null;

  const matchingMembers = await prisma.member.findMany({
    where: {
      group_id: groupId,
      user: {
        profile: {
          full_name: {
            contains: query,
          },
        },
      },
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!matchingMembers) return null;
  return matchingMembers;
}

export async function addUsersToGroupMembershipAction(usersToAdd, groupId) {
  const members = usersToAdd.map((user) => ({
    user_id: user.id,
    group_id: groupId,
  }));

  const result = await prisma.member.createMany({
    data: members,
    skipDuplicates: true,
  });

  revalidatePath(`/dashboard/group/${groupId}/members`);
  // return result;
}

export async function editMemberAction(
  { user_id, group_id, id },
  role,
  status,
) {
  // console.log('editing member', member.id, role, status);
  try {
    // throw new Error('test error');
    const result = await prisma.member.update({
      // if querying by @@unique constraint
      // where: {
      //   user_id_group_id: {
      //     user_id: member.user.id,
      //     group_id: member.group.id,
      //   },
      // },
      where: { id },
      data: {
        role,
        // status
      },
    });
    revalidatePath(`/dashboard/group/${group_id}/members`);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function removeMemberAction({ user_id, group_id, id }) {
  // console.log('removing member');

  const deletedCheckins = await prisma['member'].update({
    where: { id },
    data: {
      checkins: {
        deleteMany: {},
      },
    },
    include: {
      checkins: true,
    },
  });
  // console.log('deleted checkins', deletedCheckins);

  if (!deletedCheckins) return;

  const removedMember = await prisma['member'].delete({
    where: { id },
    select: {
      user_id: true,
      user: { include: { profile: { select: { full_name: true } } } },
    },
  });
  // console.log('removed member', removedMember);

  revalidatePath(`/dashboard/group/${group_id}/members`);
  return removedMember;
}
