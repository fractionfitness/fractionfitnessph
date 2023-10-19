'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';
import { convertToMysqlDateString } from '@/lib/utils';

//  handleSelectUser({
//   id,
//   user_id,
//   group_id,
//   role,
//   full_name,
//   email,
// })
// addMemberCheckin(selectedSession, selectedUser, userPinRef.current.value)
export async function addMemberCheckin(session, member, pin) {
  // add pin check here
  // const user = prisma.user.findFirst({ where: { id: session.user_id } });
  // // impossible to get non-existent user since only group members are sent as an argument to the action
  // if (user && user.pin === pin) throw new Error('user account non-existent / wrong pin')

  try {
    // console.log('member', member);
    const matchingUser = await prisma.user.findUnique({
      where: {
        id: member.user_id,
      },
      include: { profile: true },
    });
    // console.log('matchingUser', matchingUser);

    if (matchingUser?.profile?.pin !== pin) {
      // Can't return an error object from server actions
      // Error: Warning: Only plain objects can be passed to Client Components from Server Components. Error objects are not supported.
      // return new Error("PIN doesn't match");

      throw new Error("PIN doesn't match");
    }

    const checkin = await prisma.memberCheckin.create({
      data: {
        session_id: session.id,
        member_id: member.id,
        date: convertToMysqlDateString(new Date()),
      },
    });

    // return checkin;

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
  // add pin check here

  // console.log('addEmployeeCheckin args', employee, pin);

  try {
    const matchingUser = await prisma.user.findUnique({
      where: {
        id: employee.user_id,
      },
      include: { profile: true },
    });

    if (matchingUser?.profile?.pin !== pin) {
      // Can't return an error object from server actions
      // Error: Warning: Only plain objects can be passed to Client Components from Server Components. Error objects are not supported.
      // return new Error("PIN doesn't match");
      throw new Error("PIN doesn't match");
    }

    // console.log('Date now', convertToMysqlDateString(new Date()));

    const checkin = await prisma.employeeCheckin.create({
      data: {
        group_id: employee.group_id,
        user_id: employee.user_id,
        date: convertToMysqlDateString(new Date()),
      },
    });
    // return checkin;

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
