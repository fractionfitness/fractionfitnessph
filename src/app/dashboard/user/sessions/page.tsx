import { getAuthSession } from '@/lib/auth';
import { convertToMysqlDatetimeString } from '@/lib/utils';
import getUserGroupsSessions from '@/lib/prismaQueries/getUserGroupsSessions';

function GroupSession({ groupSession: { group, session } }) {
  const sessionStart = convertToMysqlDatetimeString(session.start_at).slice(
    11,
    16,
  );
  const sessionEnd = convertToMysqlDatetimeString(session.end_at).slice(11, 16);
  return (
    <li className="w-40 mobile:w-80 border border-white" key={session.id}>
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

export default async function Page({}) {
  try {
    const session = await getAuthSession();

    const groupSessions = await getUserGroupsSessions(session?.user);

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
