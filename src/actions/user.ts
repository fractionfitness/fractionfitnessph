'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

export async function searchUsersAction(query: string) {
  const names = query.split(' ');

  if (query.length === 0) return null;

  // solution if using sequential operations via transaction API
  const queryResultsArr = await prisma.$transaction([
    ...names.map((name) =>
      prisma.userProfile.findMany({
        where: {
          full_name: {
            contains: name,
          },
        },
        include: { user: true },
      }),
    ),
  ]);

  const userResults = [];
  queryResultsArr.forEach((arr) => {
    arr.forEach((item) => {
      // checks if item already exists in userResults[] already in array
      const match =
        userResults.filter((user) => item.user_id === user.user_id).length > 0;

      // only push to array if userResults[] is empty or no match found
      if (!match || userResults.length === 0) {
        userResults.push(item);
      }
    });
  });

  return userResults;
}

export async function addMembersToGroupAction(usersToAdd, groupId) {
  const members = usersToAdd.map((user) => ({
    user_id: user.id,
    group_id: groupId,
  }));

  const result = await prisma.member.createMany({
    data: members,
    skipDuplicates: true,
  });

  revalidatePath(`/dashboard/group/${groupId}/members`);
  return result;
}

export async function addEmployeesToGroupAction(usersToAdd, groupId) {
  const employees = usersToAdd.map((user) => ({
    user_id: user.id,
    group_id: groupId,
  }));

  const result = await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true,
  });

  revalidatePath(`/dashboard/group/${groupId}/employees`);
  return result;
}

export async function editMember(member, role, status) {
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
      where: { id: member.id },
      data: {
        role,
        // status
      },
    });
    revalidatePath(`/dashboard/group/${member.group.id}/members`);
    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function removeMember(member) {
  // console.log('removing member');

  const deletedCheckins = await prisma['member'].update({
    where: { id: member.id },
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
    where: { id: member.id },
    select: {
      user_id: true,
      user: { include: { profile: { select: { full_name: true } } } },
    },
  });
  // console.log('removed member', removedMember);

  revalidatePath(`/dashboard/group/${member.group.id}/members`);
  return removedMember;
}

// original query based on sadmann7/skateshop repo
// export async function searchUsersAction2(query: string) {
//   const name = query.trim();
//   if (name.length === 0) return null;

//   // solution if using sequential operations via transaction API
//   const queryResultsArr = await prisma.userProfile.findMany({
//     where: {
//       full_name: {
//         contains: name,
//       },
//     },
//     include: { user: true },
//   });

//   return queryResultsArr;
// }

// using prisma's Full-Text Search feature (currently in preview)
// won't work with current setup since all names are concatenated with no spaces
// partial matches only works if there are spaces in between words
// export async function searchUsersAction3(query: string) {
//   console.log('query===>', query);
//   if (query.length === 0) return null;

//   const filteredUsers = await prisma.userProfile.findMany({
//     where: {
//       full_name: {
//         search: `+${query}`,
//       },
//     },
//     include: { user: true },
//   });
//   console.log('filteredUsers', filteredUsers);
//   return filteredUsers;
// }
