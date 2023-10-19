'use client';

import {
  useRef,
  useState,
  useTransition,
  // experimental_useOptimistic,
} from 'react';
// import { useParams } from 'next/navigation';

import { memberContent } from '@/config';
import { cn } from '@/lib/utils';
import { addMemberCheckin } from '@/actions/checkin';
import { searchMemberAction } from '@/actions/member';
import { Icons } from '@/components/Icons';
import SearchSelectUserCommand from './SearchSelectUserCommand';
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
import { Input } from '@/components/ui-shadcn/Input';
import { Label } from '@/components/ui-shadcn/Label';
import { Toggle } from '@/components/ui-shadcn/Toggle';

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
