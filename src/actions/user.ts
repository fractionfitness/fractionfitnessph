'use server';

import prisma from '@/lib/prisma';

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