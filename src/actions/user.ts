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

export async function editEmployeeAction(
  { user_id, group_id },
  role,
  // status,
) {
  // console.log('editing employee action');
  try {
    const editedEmployee = await prisma.employee.update({
      where: {
        user_id_group_id: {
          user_id,
          group_id,
        },
      },
      data: {
        role,
        // status
      },
    });
    revalidatePath(`/dashboard/group/${group_id}/employees`);
    return editedEmployee;
  } catch (err) {
    console.error(err);
  }
}

export async function removeEmployeeAction({ user_id, group_id }) {
  // console.log('removing employee action');

  const removedEmployee = await prisma['employee'].delete({
    where: {
      user_id_group_id: {
        user_id,
        group_id,
      },
    },
    select: {
      user_id: true,
      user: { include: { profile: { select: { full_name: true } } } },
    },
  });
  console.log('removed employee', removedEmployee);

  revalidatePath(`/dashboard/group/${group_id}/employee`);
  return removedEmployee;
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
