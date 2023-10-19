'use client';

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  // experimental_useOptimistic,
} from 'react';
// import { useParams } from 'next/navigation';

import { memberContent } from '@/config';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { addMemberCheckin } from '@/actions/checkin';
import { searchMemberAction } from '@/actions/member';
import { Icons } from '@/components/Icons';
import SelectSessions from '@/components/SelectSessions';

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
import { Skeleton } from '@/components/ui-shadcn/Skeleton';
import { Toggle } from '@/components/ui-shadcn/Toggle';

function SearchSelectUserCommand({
  userContent,
  selectedUser,
  selectedGroupId,
  setSelectedUser,
  searchAction,
  cmdInputValue,
  setCmdInputValue,
}) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [commandOpen, setCommandOpen] = useState(false);

  const hasValidQuery = Boolean(debouncedQuery.length > 0);
  const hasSearchResults = Boolean(searchResults.length > 0);

  const { userType } = userContent;

  // reset query and cmdInputValue to empty string when page reloads
  useEffect(() => {
    setCmdInputValue('');
    setQuery('');
    setSearchResults([]);
    setSelectedUser(null);
  }, []);

  useEffect(() => {
    let ignore = false;

    const handleFetchData = async () => {
      if (debouncedQuery.length === 0) {
        setSearchResults([]);
        setSelectedUser(null);
      } else {
        try {
          setLoading(true);
          setSearchResults([]);
          setSelectedUser(null);

          if (selectedGroupId) {
            const results = await searchAction(
              debouncedQuery,
              selectedGroupId ? selectedGroupId : null,
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
  }, [debouncedQuery, selectedGroupId]);

  const handleInputChange = (e) => {
    setCmdInputValue(e);

    // trim spaces and make sure input change is different to previous query
    // disregard input if user just added spaces and no new chars
    if (e.trim() !== query) {
      setQuery(e.trim());
      setSelectedUser(null);
    }

    // clear results if empty search bar
    if (e.trim().length === 0) {
      setSearchResults([]);
      setSelectedUser(null);
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
    setSelectedUser({
      id,
      user_id,
      group_id,
      role,
      full_name,
      email,
    });
    setCmdInputValue(full_name);
    setCommandOpen(false);
  };

  return (
    <>
      <Label className="flex ml-1">{`${userType} Name:`}</Label>
      <Command shouldFilter={false} className="border">
        <div className={cn('grid grid-cols-8')}>
          <div className={cn('col-span-7')}>
            <CommandInput
              required
              placeholder={`Search ${userType.toLowerCase()} names...`}
              value={cmdInputValue}
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
              // disabled={cmdInputValue.trim().length === 0}
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
              {!selectedGroupId
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
                      // Employee table uses composite PK: user_id & group_id
                      key={
                        userType === 'Member' ? id : `${user_id}_${group_id}`
                      }
                      value={full_name}
                      className={cn('cursor-pointer normal-case')}
                      onSelect={(e) => {
                        handleSelectSearchResults({
                          id,
                          user_id,
                          group_id,
                          role,
                          full_name,
                          email,
                        });
                      }}
                    >
                      {/* <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Icons.check className={cn('h-4 w-4')} />
                      </span> */}
                      {selectedUser?.full_name === full_name ? (
                        <Icons.check className={cn('h-4 w-4')} />
                      ) : (
                        <span className={cn('h-4 w-4')}></span>
                      )}
                      {`${full_name} | ${email}`}
                    </CommandItem>
                  );
                },
              )}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </>
  );
}

export default function FrontDeskCheckin({ sessions, employmentGroups }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [pinInputState, setPinInputState] = useState(null);
  const [pinToggleShow, setPinToggleShow] = useState(false);
  const [isPending, startTransition] = useTransition();
  const userPinRef = useRef(null);

  const { userType, groupType, userRoles, userStatus } = memberContent;
  const userContent = { userType, groupType, userRoles, userStatus };

  const handleSubmit = (e) => {
    let pin = userPinRef?.current?.value;

    // convert entered pin from input field type=text (js string data type) into a js number data type
    if (typeof pin === 'string') {
      pin = Number(pin);
    }

    startTransition(() => addMemberCheckin(selectedSession, selectedUser, pin));

    setSelectedUser(null);
    setSearchInputValue('');

    // these will be cleared when searchInputValue is cleared
    // setQuery('');
    // setSearchResults(null);

    // Reset/Clear PIN
    setPinToggleShow(false);
    userPinRef.current.value = null;
    setPinInputState(null);
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
          setSelectedSession={setSelectedSession}
          value={selectedSession?.name}
        />
        <SearchSelectUserCommand
          userContent={userContent}
          selectedUser={selectedUser}
          selectedGroupId={selectedSession?.group_id}
          setSelectedUser={setSelectedUser}
          searchAction={searchMemberAction}
          cmdInputValue={searchInputValue}
          setCmdInputValue={setSearchInputValue}
        />
        {/* <div className="flex flex-col space-y-1.5">
          <Label htmlFor="user-pin" className="flex ml-1">
            {`${userType} PIN:`}
          </Label> */}

        <Label htmlFor="user-pin" className="flex ml-1">
          {`${userType} PIN:`}
        </Label>

        <div className="flex space-x-2">
          <Input
            ref={userPinRef}
            required
            id="user-pin"
            placeholder="Enter PIN..."
            type={pinToggleShow ? 'text' : 'password'}
            pattern="[0-9]*"
            maxLength={4}
            className={cn(
              'max-w-sm ',
              pinInputState === false &&
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

              // console.log('patternMismatch', patternMismatch);

              if (badInput || patternMismatch) {
                setPinInputState(false);
              } else if (valueMissing) {
                setPinToggleShow(false);
                setPinInputState(null);
              } else {
                setPinInputState(true);
              }
            }}
            // onWheel={(e) => {
            //   userPinRef.current.blur();
            // }}
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
          <Toggle
            size="sm"
            disabled={userPinRef?.current?.value?.length > 0 ? false : true}
            onPressedChange={(e) => {
              // console.log('pinToggle before setState', pinToggleShow);
              setPinToggleShow((s) => !s);
            }}
            pressed={pinToggleShow} // what's this for?
          >
            {pinToggleShow ? (
              <Icons.eye className="h-5 w-5" />
            ) : (
              <Icons.eyeOff className="h-5 w-5" />
            )}
          </Toggle>
        </div>
        {/* </div> */}

        {pinInputState === false && (
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
