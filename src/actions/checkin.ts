'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { convertToMysqlDateString } from '@/lib/utils';

export async function addMemberCheckin(session, member, pin) {
  // impossible to get non-existent user since only group members are sent as an argument to the action, so no need to query user
  // const user = prisma.user.findFirst({ where: { id: session.user_id } });

  try {
    // let start = performance.now();
    const matchingUserProfile = await prisma.userProfile.findUnique({
      where: {
        user_id: member.user_id,
      },
    });
    // console.log('matchingUserProfile', matchingUserProfile);
    // let end = performance.now();
    // console.log(`find user: ${end - start} ms`);

    if (matchingUserProfile?.pin !== pin) {
      // Can't return an error object from server actions
      // Error: Warning: Only plain objects can be passed to Client Components from Server Components. Error objects are not supported.
      // return new Error("PIN doesn't match");

      throw new Error("PIN doesn't match");
    }

    // start = performance.now();
    const memberCheckin = await prisma.memberCheckin.create({
      data: {
        session_id: session.id,
        member_id: member.id,
        date: convertToMysqlDateString(new Date()),
      },
    });
    // end = performance.now();
    // console.log(`memberCheckin exec time: ${end - start} ms`);

    // return memberCheckin;

    // need to pass the current path if you want to have a dyhnamic path to revalidate
    // currently, this action won't revalidate other pages, when used by a client component in that page
    // groupId also assumes that the session coincides with the current groupId in the URL w/c may not be the case when the group has children or descendants
    revalidatePath(`dashboard/group/${session.group_id}/front-desk`);
  } catch (e) {
    console.error(e);
    // don't throw error here since it will cause app/ui to crash
  }
}

export async function addEmployeeCheckin(employee, pin) {
  try {
    let start = performance.now();
    const matchingUserProfile = await prisma.userProfile.findUnique({
      where: {
        id: employee.user_id,
      },
    });
    let end = performance.now();
    console.log(`find user: ${end - start} ms`);

    if (matchingUserProfile?.pin !== pin) {
      // Can't return an error object from server actions
      // Error: Warning: Only plain objects can be passed to Client Components from Server Components. Error objects are not supported.
      // return new Error("PIN doesn't match");
      throw new Error("PIN doesn't match");
    }

    // start = performance.now();
    const employeeCheckin = await prisma.employeeCheckin.create({
      data: {
        group_id: employee.group_id,
        user_id: employee.user_id,
        date: convertToMysqlDateString(new Date()),
      },
    });
    // end = performance.now();
    // console.log(`employeeCheckin: ${end - start} ms`);

    // return employeeCheckin;

    // use revalidatePath if no need to handle error/success states, client-side, after executing server action
    revalidatePath(`dashboard/group/${employee.group_id}/front-desk`);
  } catch (e) {
    // console.error('error message', e.message);
    console.error(e);

    // don't throw error here since it will cause app/ui to crash

    // Can't return an error object from server actions
    // return e;
  }
}
