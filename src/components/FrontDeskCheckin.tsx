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
import { cn, convertTwoDatesToTimeInterval } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { searchMemberAction } from '@/actions/member';
import { addMemberCheckin } from '@/actions/checkin';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui-shadcn/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui-shadcn/Card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui-shadcn/Command';
import { Input } from '@/components/ui-shadcn/Input';
import { Label } from '@/components/ui-shadcn/Label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-shadcn/Select';
import { Skeleton } from '@/components/ui-shadcn/Skeleton';

function SelectSessions({ sessions, handleSelectSession }) {
  return (
    <Select
      onValueChange={(e) => {
        // console.log('select', e);
        const selectedSession = sessions.filter((item) => item.name === e)[0];
        handleSelectSession(selectedSession);
      }}
    >
      <Label htmlFor="select-session">Check in for:</Label>
      <SelectTrigger className={cn('min-w-full h-14')} id="select-session">
        <SelectValue
          placeholder="Select a Session to Check-in"
          className="mt-0"
        />
      </SelectTrigger>
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

  const { userType } = userContent;

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
      } else {
        try {
          setLoading(true);
          setSearchResults([]);
          handleSelectUser(null);

          if (selectedSession) {
            const results = await searchMemberAction(
              debouncedQuery,
              selectedSession ? selectedSession.group_id : null,
            );

            // ignore query result and do not setSearchResults, if cleanup function executed
            if (ignore === false && results) {
              setSearchResults(results);
            }
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
  }, [debouncedQuery, selectedSession]);

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
    <Command shouldFilter={false} className="border">
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
            size="xs"
            onClick={(e) => {
              setCommandOpen((s) => !s);
            }}
            // disabled={!hasSearchResults}
            // the same as above
            // disabled={inputValue.trim().length === 0}
            disabled={!hasValidQuery}
            className={cn(
              'hover:bg-accent border disabled:bg-background disabled:border-background',
              'h-8 w-8 rounded-md px-2 py-1',
              'm-auto',
            )}
          >
            {hasValidQuery && <Icons.chevronDown color="white" />}
          </Button>
        </div>
      </div>
      <CommandList>
        {/* {!hasSearchResults && hasValidQuery && (
          <CommandEmpty
            className={cn(loading ? 'hidden' : 'py-6 text-center text-sm')}
          >
            {`Using Command Empty: ${userType} not found.`}
          </CommandEmpty>
        )} */}
        {/* alternative to CommandEmpty behavior | will disappear once button is clicked */}
        {!hasSearchResults && hasValidQuery && commandOpen && !loading && (
          <p className="py-6 text-center text-sm text-error">
            {!selectedSession
              ? `Please select a Session.`
              : `${userType} not found.`}
          </p>
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

export default function FrontDeskCheckin({ sessions }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [pinInputState, setPinInputState] = useState(null);
  const userPinRef = useRef(null);

  const [isPending, startTransition] = useTransition();

  const { userType, groupType, userRoles, userStatus } = memberContent;
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
    <Card className="w-[400px] bg-background text-foreground">
      <CardHeader>
        <CardTitle>{`${userType}`} Check In</CardTitle>
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
          <Label htmlFor="member-pin" className="text-left">
            {`${userType} PIN: `}
          </Label>

          <div className="flex flex-row bg-secondary">
            <Input
              ref={userPinRef}
              required
              id="member-pin"
              placeholder="Enter PIN..."
              type="number"
              className={cn(
                'max-w-sm ',
                !pinInputState &&
                  'invalid:border-error invalid:text-error focus:invalid:border-error focus:invalid:ring-error',
                // using arbitrary css properties for unavailable tailwind props
                // '[-moz-appearance:textfield]',
                // extending tailwind utils using tailwind plugins
                'appearance-textfield',
                // doesn't work in chrome | might just need to apply global styles
                // https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
                // 'after:appearance-textfield',
                // 'after:[-webkit-appearance:none]',
              )}
              // onChange={(e) => console.log('onChange', userPinRef.current.value)}
              // onChange={(e) => console.log('onChange', e.target.value)}s
              // onInvalid={(e) => console.log('invalid event', e.target.value)}
              // onInvalidCapture={(e) =>
              //   console.log('invalid capture event', e.target)
              // }
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
            />
          </div>
        </div>

        {!pinInputState && (
          <p className="text-error">
            Please enter a valid PIN. Only numbers are allowed.
          </p>
        )}
        <Button
          onClick={handleSubmit}
          size="lg"
          disabled={!selectedSession || !selectedUser || !pinInputState}
          className="w-full"
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
