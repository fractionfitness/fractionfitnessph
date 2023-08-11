import { getAuthSession } from '@/lib/auth';
import { convertToMysqlDatetimeString } from '@/lib/utils';
import { DAY_NAMES } from '@/config';
import getUserCheckins from '@/lib/prismaQueries/getUserCheckins';

export const dynamic = 'force-dynamic';

function Checkin({ checkinRecord: { group, checkin, role } }) {
  const { session } = checkin;

  const sessionStart = convertToMysqlDatetimeString(session.start_at).slice(
    11,
    16,
  );
  const sessionEnd = convertToMysqlDatetimeString(session.end_at).slice(11, 16);
  const checkinTime = convertToMysqlDatetimeString(checkin.datetime).slice(
    11,
    16,
  );
  return (
    <ul>
      <li key={checkin.id} className="flex flex-row space-x-1">
        <p className="w-12">
          <span>{checkin.datetime.getMonth() + 1}</span>
          {'/'}
          <span>{checkin.datetime.getDate()}</span>
        </p>
        <p className="w-12">
          {DAY_NAMES[checkin.datetime.getDay()].slice(0, 3)}
        </p>
        {/* <p>Session Id: {session.id}</p> */}
        <p className="w-28">
          <span>{sessionStart}</span> - <span>{sessionEnd}</span>
        </p>
        <p className="capitalize text-center w-44">{group.name}</p>
        <p className="lowercase text-center w-20">{role}</p>
        <p className="text-center w-12">{checkinTime}</p>
        {/* <p>Checkin Id: {checkin.id}</p> */}
      </li>
    </ul>
  );
}

export default async function Page({}) {
  try {
    const session = await getAuthSession();
    const membershipCheckins = await getUserCheckins(session?.user);

    return (
      <div>
        <hr />
        <p>Sessions</p>
        <div className="flex flex-row space-x-1">
          <p>Filter by:</p>
          <p>Period</p>
          <p>Group</p>
        </div>
        <div className="flex flex-row space-x-1">
          <p>Sort by:</p>
          <p>Period</p>
          <p>Time</p>
          <p>Group</p>
        </div>
        <br />
        <hr />
        <br />
        <div className="flex flex-col">
          {membershipCheckins.length > 0 &&
            membershipCheckins.map((item) => (
              <Checkin key={item.id} checkinRecord={item} />
            ))}
        </div>
        {/* Add EmployeeCheckins here */}
      </div>
    );
  } catch (err) {
    console.error(err);
  }
}
