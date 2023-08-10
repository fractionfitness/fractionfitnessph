'use client';

import {
  useState,
  useRef,
  useEffect,
  useTransition,
  // experimental_useOptimistic,
} from 'react';
// import { useParams } from 'next/navigation';

import { memberContent, employeeContent } from '@/config';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { convertTwoDatesToTimeInterval } from '@/lib/utils';
import { searchMemberAction } from '@/actions/member';
import { addMemberCheckin } from '@/actions/checkin';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui-shadcn/Card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-shadcn/Select';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui-shadcn/Form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui-shadcn/Command';
import { Skeleton } from '@/components/ui-shadcn/Skeleton';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui-shadcn/Popover';
import { Button } from '@/components/ui-shadcn/Button';
import { Icons } from '@/components/Icons';
import { Input } from '@/components/ui-shadcn/Input';
import { Label } from '@/components/ui-shadcn/Label';

function SelectSessions({ sessions, handleSelectSession }) {
  return (
    <Select
      onValueChange={(e) => {
        // console.log('select', e);
        const selectedSession = sessions.filter((item) => item.name === e)[0];
        handleSelectSession(selectedSession);
      }}
    >
      <Label htmlFor="session">Check-in for:</Label>
      <SelectTrigger className={cn('min-w-full h-14')} name="session">
        <SelectValue
          placeholder="Select a Session to Check-in"
          className="mt-0"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Today&apos;s Sessions</SelectLabel>
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
                  className="cursor-pointer py-2"
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

function SearchSelectOneUserCommand({
  userContent,
  handleSelectUser,
  selectedSession,
}) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [commandOpen, setCommandOpen] = useState(false);

  const hasValidQuery = Boolean(debouncedQuery.length > 0);
  const hasSearchResults = Boolean(searchResults.length > 0);

  // const params = useParams();
  // const groupId = +params.groudId;

  const { userType, groupType, userRoles, userStatus } = userContent;

  // reset query and inputValue to empty string when page reloads
  useEffect(() => {
    setInputValue('');
    setQuery('');
    setSearchResults([]);
    handleSelectUser(null);
  }, []);

  useEffect(() => {
    let ignore = false;

    const handleFetchData = async () => {
      if (debouncedQuery.length === 0) {
        setSearchResults([]);
        handleSelectUser(null);
      }
      // no need to check debouncedQuery.length since already checked above
      if (debouncedQuery.length > 0) {
        try {
          setLoading(true);
          setSearchResults([]);
          handleSelectUser(null);
          const results = await searchMemberAction(
            debouncedQuery,
            selectedSession ? selectedSession.group_id : null,
          );

          // ignore query result and do not setSearchResults, if cleanup function executed
          if (ignore === false && results) {
            setSearchResults(results);
          }
          setCommandOpen(true);
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
    };

    handleFetchData();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    setInputValue(e);

    // trim spaces and make sure input change is different to previous query
    // disregard input if user just added spaces and no new chars
    if (e.trim() !== query) {
      setQuery(e.trim());
      handleSelectUser(null);
    }

    // clear results if empty search bar
    if (e.trim().length === 0) {
      setSearchResults([]);
      handleSelectUser(null);
    }
  };

  const handleSelectSearchResults = ({
    id,
    user_id,
    group_id,
    role,
    full_name,
    email,
  }) => {
    handleSelectUser({
      id,
      user_id,
      group_id,
      role,
      full_name,
      email,
    });
    setInputValue(full_name);
    setCommandOpen(false);
  };

  return (
    <Command shouldFilter={false}>
      <div className={cn('grid grid-cols-8')}>
        <div className={cn('col-span-7')}>
          <CommandInput
            required
            placeholder={`Search ${userType.toLowerCase()} names...`}
            value={inputValue}
            onValueChange={handleInputChange}
          />
        </div>
        <div className={cn('col-span-1 border-b flex')}>
          <Button
            variant="ghost"
            onClick={(e) => {
              setCommandOpen((s) => !s);
            }}
            // disabled={!hasSearchResults}
            // the same as above
            // disabled={inputValue.trim().length === 0}
            disabled={!hasValidQuery}
            className={cn(
              ' hover:bg-gray-700 bg-gray-900 disabled:bg-zinc-400',
              'h-8 w-8 rounded-md px-2 py-1',
              'm-auto',
            )}
          >
            <Icons.chevronDown color="white" />
          </Button>
        </div>
      </div>
      <CommandList>
        {!hasSearchResults && hasValidQuery && (
          <CommandEmpty
            className={cn(loading ? 'hidden' : 'py-6 text-center text-sm')}
          >
            {`Using Command Empty: ${userType} not found.`}
          </CommandEmpty>
        )}
        {/* alternative to CommandEmpty behavior | will disappear once button is clicked */}
        {!hasSearchResults && hasValidQuery && commandOpen && (
          <p>{`Custom Empty Search: ${userType} not found.`}</p>
        )}
        {loading && (
          <div className="space-y-1 overflow-hidden px-1 py-2">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-10 rounded-sm" />
            <Skeleton className="h-10 rounded-sm" />
          </div>
        )}
        {hasSearchResults && commandOpen && (
          <CommandGroup className="capitalize" heading="Matching Users">
            {searchResults?.map(
              ({
                id,
                user_id,
                group_id,
                role,
                user: {
                  email,
                  profile: { full_name },
                },
              }) => {
                return (
                  <CommandItem
                    key={id}
                    value={full_name}
                    className="cursor-pointer normal-case"
                    onSelect={(e) =>
                      handleSelectSearchResults({
                        id,
                        user_id,
                        group_id,
                        role,
                        full_name,
                        email,
                      })
                    }
                  >
                    {`${full_name} | ${email}`}
                  </CommandItem>
                );
              },
            )}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

function CheckinCard({ mode, sessions }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [pinInputState, setPinInputState] = useState(true);
  const userPinRef = useRef(null);

  const [isPending, startTransition] = useTransition();

  const { userType, groupType, userRoles, userStatus } =
    mode === 'member' ? memberContent : employeeContent;
  const userContent = { userType, groupType, userRoles, userStatus };

  const handleSelectSession = (selectedSession) => {
    // console.log('selecting session', selectedSession);
    setSelectedSession(selectedSession);
  };

  const handleSelectUser = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  const handleSubmit = (e) => {
    // console.log({
    //   session: selectedSession,
    //   user: selectedUser,
    //   pin: userPinRef && userPinRef.current.value,
    // });
    startTransition(() =>
      addMemberCheckin(selectedSession, selectedUser, userPinRef.current.value),
    );

    // CONTINUE HERE | MUST FORM STATES
    // current sessions should be passed to FrontDeskCheckin | state lifted up from FrontDeskSessions(Rename to SessionsCheckins) to parent comp (FrontDesk) then passed to child component MemberCheckin
    // FrontDesk => Clock, Checkin, Info/Sessions/Status

    // setSelectedSession(default) => default=currentSessions[0]

    // setInputValue('');
    // setQuery('');
    // setSearchResults(null);
    setSelectedUser(null);

    userPinRef.current.value = null;
  };

  return (
    <Card className="w-[400px] bg-zinc-900 text-zinc-50 ">
      <CardHeader>
        <CardTitle>{`${userType}`} Check-in</CardTitle>
        <CardDescription>Card description...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SelectSessions
          sessions={sessions}
          handleSelectSession={handleSelectSession}
        />
        <SearchSelectOneUserCommand
          userContent={userContent}
          handleSelectUser={handleSelectUser}
          selectedSession={selectedSession}
        />
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name" className="text-left">
            {`${userType} PIN`}
          </Label>
          <div className="flex flex-row bg-zinc-900 border border-zinc-200">
            {/* <div className="m-auto">
            <Icons.key className="" />
          </div> */}
            <Input
              ref={userPinRef}
              required
              name="pin"
              placeholder="Enter numerical code..."
              type="number"
              // type="string"
              className={cn(
                'max-w-sm bg-zinc-900 text-gray-50',
                'border-none',
                !pinInputState &&
                  'invalid:border-pink-700 invalid:text-pink-700 focus:invalid:border-pink-700 focus:invalid:ring-pink-700',
                // using arbitrary css properties for unavailable tailwind props
                // '[-moz-appearance:textfield]',
                // extending tailwind utils using tailwind plugins
                'appearance-textfield',
                // doesn't work in chrome | might just need to apply global styles
                // https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
                // 'after:appearance-textfield',
                // 'after:[-webkit-appearance:none]',
              )}
              onChange={(e) =>
                console.log('onChange', userPinRef.current.value)
              }
              // onChange={(e) => console.log('onChange', e.target)}
              // onInvalid={(e) => console.log('invalid event', e.target.value)}
              onInvalidCapture={(e) =>
                console.log('invalid capture event', e.target)
              }
              // these are not triggered in chrome | check again if same for edge and firefox
              onInputCapture={(e) => {
                // <input> element, validity attribute, obj keys
                const {
                  valueMissing, // empty input field
                  typeMismatch,
                  patternMismatch,
                  tooLong,
                  tooShort,
                  rangeUnderflow,
                  rangeOverflow,
                  stepMismatch,
                  badInput,
                } = e.target.validity;

                if (badInput) {
                  setPinInputState(false);
                } else {
                  setPinInputState(true);
                }
              }}
              onWheel={(e) => {
                userPinRef.current.blur();
              }}
              onKeyDown={(e) => {
                // e.code: will disregard case if alphabet key is pressed
                //e.key: value is different for upper and lower case alphabet chars
                const key = e.code;
                // Disable Up and Down Arrows on Keyboard
                if (key == 'ArrowDown' || key == 'ArrowUp') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            ></Input>
          </div>
        </div>

        {!pinInputState && (
          <p className="text-pink-700">Please enter a valid PIN.</p>
        )}
        <Button
          // onClick={(e) =>
          //   console.log({
          //     session: selectedSession,
          //     member: selectedUser,
          //     pin: userPinRef.current.value,
          //   })
          // }
          onClick={handleSubmit}
          size="lg"
          // disabled={!selectedSession || !selectedUser || !pinInputState}
          className={cn('border border-gray-700 hover:bg-gray-500', 'w-full')}
        >
          {!isPending ? (
            <Icons.clock className="h-4 w-4 mr-2" aria-hidden="true" />
          ) : (
            <Icons.loader className="mr-2 animate-spin-slow" />
          )}
          <span className="leading-none">CHECK IN</span>
        </Button>
      </CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
}

export default function FrontDeskCheckin({ sessions }) {
  return <CheckinCard mode="member" sessions={sessions} />;
}
