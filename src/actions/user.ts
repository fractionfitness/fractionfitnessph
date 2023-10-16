'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/serverUtils';

export async function searchUsersAction(query: string) {
  // replace all commas (,) with a space then split values in between spaces
  const names = query.replace(/[,]+/g, ' ').trim().split(/[\s]+/);

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
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
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

export async function createUserProfileMember({
  email,
  password,
  first_name,
  middle_name,
  last_name,
  suffix_name,
  group_id,
}) {
  try {
    const result = await prisma.user.create({
      data: {
        email: email.length === 0 ? null : email,
        password: password.length === 0 ? null : await hashPassword(password),
        role: email.length === 0 ? 'GUEST' : 'USER',
        profile: {
          create: {
            first_name,
            // we don't want to write empty strings into the db | all other fields, w/o this expression, are required
            // either null or undefined works
            middle_name: middle_name.length === 0 ? null : middle_name,
            last_name,
            suffix_name: suffix_name.length === 0 ? null : suffix_name,
            full_name: `${first_name},${middle_name},${last_name},${suffix_name}`,
          },
        },
        memberships: {
          create: {
            group_id,
          },
        },
      },
    });
    console.log('result', result);
    revalidatePath(`dashboard/group/${group_id}/front-desk`);
  } catch (e) {
    // console.error(new Error(e));
    console.error(e);
  }
}

export async function createUserProfileMemberCheckin({
  email,
  password,
  first_name,
  middle_name,
  last_name,
  suffix_name,
  session_id,
  group_id,
}) {
  try {
    const result = await prisma.user.create({
      data: {
        email: email.length === 0 ? null : email,
        password: password.length === 0 ? null : await hashPassword(password),
        role: email.length === 0 ? 'GUEST' : 'USER',
        profile: {
          create: {
            first_name,
            // we don't want empty strings in the db | all other fields are required
            // use either null or undefined
            middle_name: middle_name.length === 0 ? null : middle_name,
            last_name,
            suffix_name: suffix_name.length === 0 ? null : suffix_name,
            full_name: `${first_name},${middle_name},${last_name},${suffix_name}`,
          },
        },
        memberships: {
          create: {
            group_id,
            checkins: {
              create: {
                session_id,
              },
            },
          },
        },
      },
    });
    console.log('result', result);
    revalidatePath(`dashboard/group/${group_id}/front-desk`);
  } catch (e) {
    console.error(e);
  }
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
