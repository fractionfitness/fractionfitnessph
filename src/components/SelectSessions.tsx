import { cn } from '@/lib/utils';
import { convertTwoDatesToTimeInterval } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-shadcn/Select';

export default function SelectSessions({
  sessions,
  setSelectedSession,
  value,
}) {
  return (
    <Select
      onValueChange={(e) => {
        // console.log('select', e);
        const selectedSession = sessions.filter((item) => item.name === e)[0];
        setSelectedSession(selectedSession);
      }}
      value={value}
    >
      {/* <div className="space-y-2"> */}
      <SelectTrigger className={cn('min-w-full h-14')} id="select-session">
        <SelectValue
          placeholder="Select a Session to Check-in"
          className="mt-0"
        />
      </SelectTrigger>
      {/* </div> */}
      <SelectContent className="w-[348px] bg-secondary">
        <SelectGroup>
          <SelectLabel>{"Today's Sessions"}</SelectLabel>
          {sessions.length > 0 &&
            sessions.map((item) => {
              const timeInterval = convertTwoDatesToTimeInterval([
                item.start_at,
                item.end_at,
              ]);
              return (
                <SelectItem
                  key={item.id}
                  value={item.name}
                  // className="cursor-pointer py-2 px-2 focus:bg-background"
                  className="cursor-pointer focus:bg-background"
                >
                  {`${timeInterval} ${item.group.name} ${item.name}`}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
