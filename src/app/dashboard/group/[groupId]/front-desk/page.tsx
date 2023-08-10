import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  addOneDayToDateObj,
  convertDateObjValuesToStringValues,
  // compareDateObjToSessionDay,
  didDateOccurInASpecific24HourPeriod,
  cn,
  getJsDateObjValues,
  sortDates,
} from '@/lib/utils';

import FrontDeskSessions from '@/components/FrontDeskSessions';

export default async function Page({ params }) {
  try {
    const session = await getAuthSession();
    if (!session) throw new Error('unauthenticated');

    //------------------------------------------
    // HIDE AFTER TESTING
    // August 9, 2023
    // const now = getJsDateObjValues(new Date(2023, 7, 10, 0, 0, 0));
    //------------------------------------------

    const now = getJsDateObjValues(new Date());
    const { year, month, day } = now;
    const dateWithoutTime = [year, month, day, 0, 0, 0] as const;
    const todaysDate = new Date(...dateWithoutTime);

    // get today's dayOfWeek (string format e.g. SATURDAY) to compare it with Session model's day field (also string)
    const { dayOfWeek: dayOfWeekToday } =
      convertDateObjValuesToStringValues(now);

    const origDateValues = getJsDateObjValues(todaysDate);

    console.log(
      'filter condition check ===>',
      'today obj values: ',
      origDateValues,
      '\n',
      'interval:',
      todaysDate,
      '-',
      addOneDayToDateObj(todaysDate),
      ' | ',
      // '2023-07-31T18:50:16.664Z',
      // '2023-08-01T07:15:32.476Z',
      'checkin in interval?',
      todaysDate <= new Date('2023-08-10T15:00:00.000Z') &&
        new Date('2023-08-09T15:00:00.000Z') < addOneDayToDateObj(todaysDate),
      didDateOccurInASpecific24HourPeriod(
        new Date('2023-08-09T16:00:00.000Z'),
        todaysDate,
      ),
    );

    // old query
    // const group = await prisma.group.findFirst({
    //   where: {
    //     id: +params.groupId,
    //   },
    //   include: {
    //     sessions: {
    //       include: {
    //         group: true,
    //       },
    //     },
    //     children: true,
    //   },
    // });

    // // check if current day is the same as session day
    // const todaySessions = group.sessions.filter((session) => {
    //   // return true; // returns all sessions
    //   return compareDateObjToSessionDay(todaysDate, session.day); // return sessions for the specified todaysDate
    //   // return compareDateObjToSessionDay(new Date(Date.now()), session.day);
    // });

    const groupId = +params.groupId;

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
      },
      include: {
        sessions: {
          where: {
            day: {
              equals: `${dayOfWeekToday}`,
            },
          },
          include: {
            group: true,
            member_checkins: {
              orderBy: [{ datetime: 'desc' }], // from newest to oldest checkin
              where: {
                datetime: {
                  gte: todaysDate,
                  lte: addOneDayToDateObj(todaysDate),
                },
              },
              include: {
                member: {
                  include: { user: { include: { profile: true } } },
                },
              },
            },
          },
        },
        children: true,
      },
    });

    // should be a 404/NotFound page if no group found | don't throw an error
    if (!group) throw new Error('group and its sessions not found');

    const groupAndDescendantsNames = group.children;

    let unsortedTodayMemberCheckins: object[] = [];
    group.sessions.forEach((session) => {
      session.member_checkins.forEach((checkin) => {
        unsortedTodayMemberCheckins.push(checkin);
      });
    });

    const todayMemberCheckins = sortDates(
      unsortedTodayMemberCheckins,
      'datetime',
      'desc',
    );

    console.log(
      'group',
      group.sessions.map((item) => item.member_checkins),
    );
    console.log('query group checkins====>', todayMemberCheckins);

    return (
      <div>
        <hr />
        {/* <div className={cn("container mx-auto mt-1 mb-1")}></div> */}
        <div className={cn('flex space-x-4 p-4 justify-center')}>
          <FrontDeskSessions
            sessions={group.sessions}
            checkins={todayMemberCheckins ?? []}
          />
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
