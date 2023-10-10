'use server';

import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

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
  // const user = prisma.user.findFirst({ where: { id: session.user_id } });
  // // impossible to get non-existent user since only group members are sent as an argument to the action
  // if (user && user.pin === pin) throw new Error('user account non-existent / wrong pin')

  const checkin = await prisma.memberCheckin.create({
    data: {
      session_id: session.id,
      member_id: member.id,
    },
  });
  console.log(checkin);

  // need to pass the current path if you want to have a dyhnamic path to revalidate
  // currently, this action won't revalidate other pages, when used by a client component in that page
  // groupId also assumes that the session coincides with the current groupId in the URL w/c may not be the case when the group has children or descendants
  revalidatePath(`dashboard/group/${session.group_id}/front-desk`);

  // return checkin
}
