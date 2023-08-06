'use client';

import { useState, useEffect } from 'react';

import { DAY_NAMES } from '@/config';
import {
  capitalizeFirstChar,
  capitalizeAllWords,
  convertTwoDatesToTimeInterval,
  isCurrentSession,
  isUpcomingSession,
  isCompletedSession,
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
  console.log('categorizing...');
  const current = sessions.filter((item) =>
    isCurrentSession([item.start_at, item.end_at, dateObj]),
  );
  const upcoming = sessions.filter((item) =>
    isUpcomingSession([item.start_at, item.end_at, dateObj]),
  );
  const completed = sessions.filter((item) =>
    isCompletedSession([item.start_at, item.end_at, dateObj]),
  );

  return { current, upcoming, completed };
}

function SessionItem({ session }) {
  const { id, day, start_at, end_at, name, group } = session;
  const timeInterval = convertTwoDatesToTimeInterval([start_at, end_at]);
  return (
    <div>
      <p>
        <span>{`${capitalizeFirstChar(day).slice(0, 3)} ${timeInterval}`}</span>{' '}
        <span>{capitalizeAllWords(group.name)}</span> <span>{name}</span>
      </p>
    </div>
  );
}

function SessionStatusCategory({ sessions, header }) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-zinc-700 hover:text-zinc-50 bg-zinc-900 text-zinc-50 p-2 w-32"
          >
            {header}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="text-gray-50 bg-zinc-900 w-80">
          {sessions.length > 0 ? (
            sessions.map((session) => {
              return <SessionItem key={session.id} session={session} />;
            })
          ) : (
            <p>None...</p>
          )}
        </PopoverContent>
      </Popover>
      {sessions.length > 0 && <SessionItem session={sessions[0]} />}
    </div>
  );
}

function SessionCard({ sessions, current, upcoming, completed, time }) {
  return (
    <Tabs defaultValue="status" className="w-[400px]">
      {/* CLOCK */}
      <div className="text-5xl">
        <span>{DAY_NAMES[time.getDay()].slice(0, 3)}</span>{' '}
        <span>{time && time.toLocaleTimeString()}</span>
      </div>
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
            <hr />
            <SessionStatusCategory sessions={current} header="Current" />
            <hr />
            <SessionStatusCategory sessions={upcoming} header="Upcoming" />
            {/* <hr />
            <SessionStatusCategory sessions={completed} header="Completed" /> */}
            {/* <SessionStatusCategory sessions={sessions} header="All Sessions" /> */}
          </CardContent>
          <CardFooter>
            {/* <Button>Save changes</Button> */}
            Footer
          </CardFooter>
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
            {/* <SessionStatusCategory sessions={sessions} header="All Sessions" /> */}
            <hr />
            <ScrollArea className="h-96">
              {sessions.length > 0 &&
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

export default function FrontDeskSessions({ sessions }) {
  // console.log('comp render');

  //---------------------------------------------------------------------
  // DELETE AFTER TESTING
  // August 5, 2023 14:30
  const [secs, setSecs] = useState(() => 57);
  const dateObj = [2023, 7, 5, 16, 29, secs] as const;
  // memoize???
  const time = new Date(...dateObj);
  //---------------------------------------------------------------------

  //---------------------------------------------------------------------
  // const dateObj = [];
  // const [time, setTime] = useState(null);
  //---------------------------------------------------------------------

  const [mins, setMins] = useState(() => time.getMinutes());
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
      setSecs((s) => s + 1);
      //----------------------------

      // setTime(new Date())
      // setTime(time);
    }, 1000);

    handleChangeInMins();

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentMins = time ? time.getMinutes() : null;
    if (!currentMins || mins === currentMins) return;

    // only execute below if minutes have changed, disregarding change in secs
    setMins(time.getMinutes());

    handleChangeInMins();
  }, [mins, time, sessions]);

  return (
    <>
      <SessionCard
        sessions={sessions}
        current={current}
        upcoming={upcoming}
        completed={completed}
        time={time}
      />

      {/* INSERT CHECK-IN COMPONENT */}

      {/* <hr />
      <Label>Upcoming</Label>
      {upcoming.length > 0 &&
        upcoming.map((session) => {
          return <FrontDeskSession key={session.id} session={session} />;
        })}
      <hr />
      <Label>Completed</Label>
      {completed.length > 0 &&
        completed.map((session) => {
          return <FrontDeskSession key={session.id} session={session} />;
        })}
      <hr />

      <Label>Today</Label>
      {sessions.length > 0 &&
        sessions.map((session) => {
          return <FrontDeskSession key={session.id} session={session} />;
        })} */}
    </>
  );
}
