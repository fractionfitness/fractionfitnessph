import { eachHourOfInterval } from 'date-fns';

import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

function GroupSessions({ group }) {
  return (
    <div>
      <br />
      <ul className="flex flex-wrap space-x-1 space-y-1">
        <li></li>
        {/* need this empty <li> is for applying correct margin on the first non-empty li */}
        {group.sessions.map((session) => {
          const sessionInterval = eachHourOfInterval({
            start: session.start_at,
            end: session.end_at,
          });
          let sessionStart = sessionInterval[0];
          let sessionEnd = sessionInterval[sessionInterval.length - 1];
          let formattedSessionStart = `${sessionStart.getHours()}:${sessionStart.getMinutes()}`;
          let formattedSessionEnd = `${sessionEnd.getHours()}:${sessionEnd.getMinutes()}`;

          // why is javascript in wsl showing a tz offset of 450mins (+07:30) instead of 480 (+08:00)?
          // console.log('timezone offset', sessionEnd.getTimezoneOffset());

          return (
            <li className="w-40 border border-white" key={session.id}>
              <p>{session.name}</p>
              <p>
                <span>{session.day}</span> <span>{formattedSessionStart}</span>{' '}
                - <span>{formattedSessionEnd}</span>
              </p>
              <p>{group.name}</p>
            </li>
          );
        })}
      </ul>
      <br />
      <hr />
    </div>
  );
}

export default async function UserGroups({}) {
  try {
    const session = await getAuthSession();

    const user = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
      include: {
        groups: {
          include: {
            sessions: true,
          },
        },
        employments: {
          include: {
            group: {
              include: {
                sessions: true,
              },
            },
          },
        },
        memberships: {
          include: {
            group: {
              include: {
                sessions: true,
              },
            },
          },
        },
      },
    });

    const employmentGroups = user?.employments.map((employment) => ({
      ...employment.group,
      // role: employment.role,
    }));
    const membershipGroups = user?.memberships.map((membership) => ({
      ...membership.group,
      // role: membership.role,
    }));

    // user's group records
    const userGroupRecords = [...employmentGroups, ...membershipGroups];

    // collate all of user's roles for each group | make sure no repetition in group[] and group element's roles[]
    let userGroupsCollated = userGroupRecords.reduce((acc, group) => {
      // check if group already exists in accumulator
      let groupMatch;
      acc.forEach((g, i) => {
        let skipCheck = false;
        if (skipCheck) return; // will not break out of loop but will skip the following "if" block
        if (g.id === group.id) {
          groupMatch = { index: i, data: g };
          skipCheck = true;
          return;
        }
      });

      // no group matches in acc
      if (!groupMatch) {
        // add group record to acc, modifying group's role into an array
        const { role, ...groupProperties } = group;
        acc.push({ ...groupProperties, roles: [role] });
        return acc;
      } else {
        // add user's role to matched group in acc
        groupMatch.data.roles.push(group.role);
        acc.splice(groupMatch.index, 1, groupMatch.data);
        return acc;
      }
    }, []);

    // console.log('userGroupRecords', userGroupRecords);
    // console.log('userGroupsCollated', userGroupsCollated);

    return (
      <div>
        <hr />
        <p>Sessions</p>
        <div>
          <p>Filter by:</p>
          <p>Period</p>
          <p>Group</p>
        </div>
        <div className="flex flex-col">
          {userGroupsCollated.length > 0 &&
            userGroupsCollated.map((group) => (
              <GroupSessions key={group.id} group={group} />
            ))}
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
