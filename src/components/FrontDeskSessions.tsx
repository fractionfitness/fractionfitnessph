'use client';

import { useState, useEffect } from 'react';

import { DAY_NAMES } from '@/config';
import {
  capitalizeAllWords,
  convertDateObjValuesToStringValues,
  convertTwoDatesToTimeInterval,
  getJsDateObjValues,
  isCurrentSession,
  isUpcomingSession,
  isCompletedSession,
  sortDates,
  cn,
} from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui-shadcn/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui-shadcn/Tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui-shadcn/Popover';
import { ScrollArea } from '@/components/ui-shadcn/ScrollArea';
import { Button } from '@/components/ui-shadcn/Button';

function categorizeSessions(sessions, dateObj) {
  const current = sortDates(
    sessions.filter((item) =>
      isCurrentSession([item.start_at, item.end_at, dateObj]),
    ),
    'start_at',
    'desc',
  );
  const upcoming = sortDates(
    sessions.filter((item) =>
      isUpcomingSession([item.start_at, item.end_at, dateObj]),
    ),
    'start_at',
    'asc',
  );
  const completed = sortDates(
    sessions.filter((item) =>
      isCompletedSession([item.start_at, item.end_at, dateObj]),
    ),
    'end_at',
    'desc',
  );

  return { current, upcoming, completed };
}

function CheckinsToday({ checkins }) {
  return (
    <ScrollArea className="h-48">
      <p>Today&apos;s Checkins:</p>

      {checkins &&
        checkins.length > 0 &&
        checkins.map((item) => {
          const { time } = convertDateObjValuesToStringValues(
            getJsDateObjValues(item.datetime),
          );
          const { first_name, last_name } = item.member.user.profile;
          return (
            <div key={item.id}>
              <p>
                <span>checkin: {item.id}</span>{' '}
                {/* <span>session: {item.session_id}</span>{' '} */}
                {/* <span>member id: {item.member_id}</span> <span>{time}</span> */}
                <span>{`${first_name} ${last_name}`}</span> <span>{time}</span>
                {/* <span>{item.datetime.toString()}</span> */}
              </p>
            </div>
          );
        })}
    </ScrollArea>
  );
}

function SessionItem({ session }) {
  const { id, day, start_at, end_at, name, group } = session;
  const timeInterval = convertTwoDatesToTimeInterval([start_at, end_at]);
  return (
    <>
      {/* <span>{capitalizeFirstChar(day).slice(0, 3)}</span>{' '} */}
      <p>
        <span>{timeInterval}</span>{' '}
        <span>{capitalizeAllWords(group.name)}</span> <span>{name}</span>
      </p>
    </>
  );
}

function SessionsStatusCategory({ sessions, header }) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-zinc-700 hover:text-zinc-50 bg-zinc-900 text-zinc-50 p-2 w-80"
          >
            {header}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="text-gray-50 bg-zinc-900 w-80">
          {sessions && sessions.length > 0 ? (
            sessions.map((session) => {
              return <SessionItem key={session.id} session={session} />;
            })
          ) : (
            <p>None...</p>
          )}
        </PopoverContent>
      </Popover>
      {/* show all sessions w/c have the same start time */}
      {sessions &&
        sessions.length > 0 &&
        sessions
          .filter((item) =>
            Boolean(sessions[0].start_at.getTime() === item.start_at.getTime()),
          )
          .map((item) => <SessionItem key={item.id} session={item} />)}
    </div>
  );
}

function SessionCard({
  sessions,
  checkins,
  current,
  upcoming,
  completed,
  time,
}) {
  return (
    <Tabs defaultValue="status" className="w-[420px]">
      {/* CLOCK */}
      {time && (
        <div className="text-5xl">
          <span>{DAY_NAMES[time.getDay()].slice(0, 3)}</span>{' '}
          {/* how to fix width so that time element doesnt keep expanding/contracting because of the change in number chars */}
          <span className={cn('w-32 min-w-full')}>
            {time.toLocaleTimeString()}
          </span>
        </div>
      )}
      <TabsList className="grid w-full grid-cols-2 bg-gray-900 text-gray-50 border border-gray-700">
        <TabsTrigger
          value="status"
          className="data-[state=active]:bg-gray-400 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          Status
        </TabsTrigger>
        <TabsTrigger
          value="allSessions"
          className="data-[state=active]:bg-gray-400 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          All Sessions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="status">
        <Card className=" bg-zinc-900 text-zinc-50">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>
              {/* Make changes to your account here. Click save when you're done. */}
              Card description...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <SessionsStatusCategory sessions={current} header="Current" />
            <hr />
            <CheckinsToday checkins={checkins} />
            <hr />
            <SessionsStatusCategory sessions={upcoming} header="Upcoming" />
            <hr />
            <SessionsStatusCategory sessions={completed} header="Completed" />
          </CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="allSessions">
        <Card className=" bg-zinc-900 text-zinc-50">
          <CardHeader>
            <CardTitle>Today&apos;s Sessions</CardTitle>
            <CardDescription>Everything...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* use scroll area */}
            {/* <SessionsStatusCategory sessions={sessions} header="All Sessions" /> */}
            <hr />
            <ScrollArea className="h-96">
              {sessions &&
                sessions.length > 0 &&
                sessions.map((session) => {
                  return <SessionItem key={session.id} session={session} />;
                })}
            </ScrollArea>
            <hr />
          </CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default function FrontDeskSessions({ sessions, checkins }) {
  // console.log('comp render');

  //---------------------------------------------------------------------
  // HIDE AFTER TESTING
  // August 9, 2023 17:29:57
  // const [secs, setSecs] = useState(() => 55);
  // const dateObj = [2023, 7, 10, 17, 29, secs] as const;
  // const time = new Date(...dateObj);
  // const [mins, setMins] = useState(() => time.getMinutes());
  //---------------------------------------------------------------------

  // not recommended to mix side effects and state
  // better to let useEffect handle comp synchronization of side effects like 'new Date()'
  // const [time, setTime] = useState(new Date());
  // const [mins, setMins] = useState(() => time.getMinutes());

  const [time, setTime] = useState(null);
  const [mins, setMins] = useState(null);
  const [current, setCurrent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);

  // need to memoize since a useEffect dependency???
  const handleChangeInMins = () => {
    const { current, upcoming, completed } = time
      ? categorizeSessions(sessions, time)
      : new Date();
    setCurrent(current);
    setUpcoming(upcoming);
    setCompleted(completed);
  };

  // initialize clock and session categories
  useEffect(() => {
    const interval = window.setInterval(() => {
      //----------------------------
      // TEST
      // setSecs((s) => s + 1);
      //----------------------------

      setTime(new Date());
    }, 1000);

    handleChangeInMins();

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!time) return;

    const currentMins = time.getMinutes();
    if (!currentMins || mins === currentMins) return;

    // only execute below if minutes have changed, disregarding change in secs
    setMins(time.getMinutes());

    handleChangeInMins();
  }, [mins, time, sessions]);

  return (
    <SessionCard
      sessions={sessions}
      checkins={checkins}
      current={current}
      upcoming={upcoming}
      completed={completed}
      time={time}
    />
  );
}
