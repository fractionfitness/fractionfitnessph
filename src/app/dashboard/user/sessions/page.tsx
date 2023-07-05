import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { convertToMysqlDatetimeString } from '@/prisma/seedUtils';

function GroupSession({ groupSession: { group, session } }) {
  const sessionStart = convertToMysqlDatetimeString(session.start_at).slice(
    11,
    16,
  );
  const sessionEnd = convertToMysqlDatetimeString(session.end_at).slice(11, 16);
  return (
    <li className="w-40 mobile:w-80 border border-foreground" key={session.id}>
      <p>{session.name}</p>
      <p>
        <span className="capitalize">
          {session.day.toLowerCase().slice(0, 3)}
        </span>{' '}
        <span>{sessionStart}</span> - <span>{sessionEnd}</span>
      </p>
      <p>{group.name}</p>
    </li>
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

    const membershipGroups = user?.memberships.map((membership) => ({
      ...membership.group,
    }));

    const groupSessions = membershipGroups?.reduce((acc, group) => {
      acc.push(
        ...group.sessions.map((session) => ({
          group,
          session,
        })),
      );
      return acc;
    }, []);

    return (
      <div>
        <hr />
        <p>Sessions</p>
        <div className="flex flex-row space-x-1">
          <p>Filter by:</p>
          <p>Period</p>
          <p>Group</p>
        </div>
        <br />
        <hr />
        <br />
        <div className="flex flex-col">
          <ul className="flex flex-wrap space-x-1 space-y-1">
            {/* need this empty <li> is for applying correct margin on the first non-empty li */}
            <li></li>
            {groupSessions.length > 0 &&
              groupSessions?.map((item) => (
                <GroupSession key={item.session.id} groupSession={item} />
              ))}
          </ul>
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
