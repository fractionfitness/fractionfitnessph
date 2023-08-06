import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { compareDateObjToSessionDay } from '@/lib/utils';

import FrontDeskSessions from '@/components/FrontDeskSessions';

export default async function Page({ params }) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error('unauthenticated');
    // should only get today's sessions
    // const sessions = await prisma.session.findMany({
    //   where: {
    //     group_id: +params.groupId,
    //   },
    //   include: {
    //     group: true,
    //   },
    // });
    // console.log('sessions', sessions);

    const group = await prisma.group.findFirst({
      where: {
        id: +params.groupId,
      },
      include: {
        sessions: {
          include: {
            group: true,
          },
        },
        children: true,
      },
    });

    if (!group) throw new Error('group and its sessions not found');

    const groupAndDescendantsNames = group.children;

    // DELETE AFTER TESTING
    // August 5, 2023 14:30
    const testDateObj = new Date(2023, 7, 5, 0, 0, 0);

    // check if current day is the same as session day
    const todaySessions = group.sessions.filter((session) => {
      // return true; // returns all sessions
      return compareDateObjToSessionDay(testDateObj, session.day); // return sessions for the specified testDateObj
      // return compareDateObjToSessionDay(new Date(Date.now()), session.day);
    });

    return (
      <div className="space-y-2">
        <hr />
        <p>Front Desk</p>
        {/* <div className="container mx-auto mt-1 mb-1"></div> */}
        <FrontDeskSessions sessions={todaySessions} />
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
