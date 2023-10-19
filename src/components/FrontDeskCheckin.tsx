'use client';

import {
  useRef,
  useState,
  useTransition,
  // experimental_useOptimistic,
} from 'react';
import { useParams } from 'next/navigation';

import { memberContent, employeeContent, accountContent } from '@/config';
import { cn } from '@/lib/utils';
import { addMemberCheckin, addEmployeeCheckin } from '@/actions/checkin';
import { searchEmployeeAction } from '@/actions/employee';
import {
  searchMemberAction,
  addUserToGroupMembershipAction,
} from '@/actions/member';
import { searchUsersAction } from '@/actions/user';
import { Icons } from '@/components/Icons';
import NewAccountForm from '@/components/NewAccountForm';
import SearchSelectUserCommand from '@/components/SearchSelectUserCommand';
import SelectGroups from '@/components/SelectGroups';
import SelectSessions from '@/components/SelectSessions';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui-shadcn/Accordion';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui-shadcn/Tabs';
import { Toggle } from '@/components/ui-shadcn/Toggle';

function UserCheckinCard({
  mode,
  selectedSessionOrGroup,
  selectedUser,
  setSelectedUser,
  SelectSessionsOrGroups,
  selectLabel,
}) {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [pinInputState, setPinInputState] = useState(null);
  const [pinToggleShow, setPinToggleShow] = useState(false);
  const [isPending, startTransition] = useTransition();
  const userPinRef = useRef(null);

  const { userType, groupType, userRoles, userStatus } =
    mode === 'member' ? memberContent : employeeContent;
  const userContent = { userType, groupType, userRoles, userStatus };
  const searchAction =
    mode === 'member' ? searchMemberAction : searchEmployeeAction;

  const handleSubmit = (e) => {
    let pin = userPinRef?.current?.value;

    // convert entered pin from input field type=text (js string data type) into a js number data type
    if (typeof pin === 'string') {
      pin = Number(pin);
    }

    if (mode === 'member') {
      startTransition(() =>
        addMemberCheckin(selectedSessionOrGroup, selectedUser, pin),
      );
    } else if (mode === 'employee') {
      startTransition(() => addEmployeeCheckin(selectedUser, pin));
    }

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
    <Card className="bg-background text-foreground">
      <CardHeader>
        <CardTitle>{`${userType}`} Check In</CardTitle>
        <CardDescription>Card description...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="select-session" className="flex ml-1">
          {selectLabel}
        </Label>
        <SelectSessionsOrGroups />
        <SearchSelectUserCommand
          userContent={userContent}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedGroupId={
            mode === 'member'
              ? selectedSessionOrGroup?.group_id
              : selectedSessionOrGroup?.id
          }
          searchAction={searchAction}
          cmdInputValue={searchInputValue}
          setCmdInputValue={setSearchInputValue}
        />
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
          disabled={!selectedSessionOrGroup || !selectedUser || !pinInputState}
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

function NewAccountCard({
  sessions,
  selectedSession,
  selectedUser,
  setSelectedSession,
  setSelectedUser,
  employmentGroups,
}) {
  const params = useParams();
  const currentDashboardGroup = employmentGroups.filter(
    (group) => group.id === +params.groupId,
  )[0];
  // if no matching group, then set initial state to null
  const [selectedGroup, setSelectedGroup] = useState(
    currentDashboardGroup ? currentDashboardGroup : null,
  );
  const [searchInputValue, setSearchInputValue] = useState('');

  const [isPending, startTransition] = useTransition();

  const { userType, groupType, userRoles, userStatus } = accountContent;
  const userContent = { userType, groupType, userRoles, userStatus };

  return (
    <Card className="bg-background text-secondary-foreground">
      <CardHeader>
        <CardTitle>New Account</CardTitle>
        <CardDescription>Card Description...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Accordion type="single" collapsible className="w-full text-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Visitor has existing account & member check in.
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-1">
                {/* <SearchSelectOneUserCommand
                  userContent={userContent}
                  setSelectedUser={setSelectedUser}
                  selectedGroupId={selectedSession?.group_id}
                  searchAction={searchUsersAction}
                /> */}
                <SearchSelectUserCommand
                  userContent={userContent}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  selectedGroupId={selectedSession?.group_id}
                  searchAction={searchUsersAction}
                  cmdInputValue={searchInputValue}
                  setCmdInputValue={setSearchInputValue}
                />
                <SelectSessions
                  sessions={sessions}
                  setSelectedSession={setSelectedSession}
                  value={selectedSession?.name}
                />
                {/* ADD ACTION TO ADD VISITOR (HAS A USER ACCOUNT) TO GROUP MEMBERSHIP */}
                <Button
                  size="sm"
                  disabled={!selectedUser || !selectedSession}
                  // CHECK
                  onClick={() =>
                    startTransition(() =>
                      addUserToGroupMembershipAction(
                        selectedUser,
                        selectedGroup.id,
                        +params.groupId,
                      ),
                    )
                  }
                >
                  Add Member & Check In
                </Button>
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    setInputValue('');
                  }}
                  disabled={!hasValidQuery}
                >
                  Clear
                </Button> */}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Create new account & member check in.
            </AccordionTrigger>
            <AccordionContent>
              <NewAccountForm
                selectedSessionOrGroup={selectedSession}
                formSubmitBtnLabel={'Sign Up & Member Check In'}
                selectLabel={`Check in for:`}
                SelectSessionsOrGroups={() => (
                  <SelectSessions
                    sessions={sessions}
                    setSelectedSession={setSelectedSession}
                    value={selectedSession?.name}
                  />
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Create new account & add as member.
            </AccordionTrigger>
            <AccordionContent>
              <NewAccountForm
                selectedSessionOrGroup={selectedGroup}
                formSubmitBtnLabel={'Sign Up & Add Member w/o Check In'}
                selectLabel={`Add to Group:`}
                SelectSessionsOrGroups={() => (
                  <SelectGroups
                    groups={employmentGroups}
                    defaultValue={currentDashboardGroup?.name}
                    selectedGroup={selectedGroup}
                    handleValueChange={setSelectedGroup}
                    selectItemsHeader={`Your Group Employers:`}
                  />
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
}

export default function FrontDeskCheckin({ sessions, employmentGroups }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const params = useParams();
  const currentDashboardGroup = employmentGroups.filter(
    (group) => group.id === +params.groupId,
  )[0];
  // if no matching group, then set initial state to null
  const [selectedGroup, setSelectedGroup] = useState(
    currentDashboardGroup ? currentDashboardGroup : null,
  );

  return (
    <Tabs defaultValue="members" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3 bg-background text-foreground border">
        <TabsTrigger
          value="members"
          className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-sm"
        >
          Members
        </TabsTrigger>
        <TabsTrigger
          value="employees"
          className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-sm"
        >
          Employees
        </TabsTrigger>
        <TabsTrigger
          value="new-account"
          className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-sm"
        >
          New Account
        </TabsTrigger>
      </TabsList>
      <TabsContent value="members">
        <UserCheckinCard
          mode="member"
          // sessions={sessions}
          selectedSessionOrGroup={selectedSession}
          selectedUser={selectedUser}
          // setSelectedSessionOrGroup={setSelectedSession}
          setSelectedUser={setSelectedUser}
          // value={selectedSession?.name}
          // SelectSessionsOrGroups={SelectSessions}
          selectLabel={`Check in for:`}
          SelectSessionsOrGroups={() => (
            <SelectSessions
              sessions={sessions}
              setSelectedSession={setSelectedSession}
              value={selectedSession?.name}
            />
          )}
        />
      </TabsContent>
      <TabsContent value="employees">
        <UserCheckinCard
          mode="employee"
          // sessions={sessions}
          selectedSessionOrGroup={selectedGroup}
          selectedUser={selectedUser}
          // setSelectedSessionOrGroup={setSelectedGroup}
          setSelectedUser={setSelectedUser}
          selectLabel={`Add Account to Group:`}
          SelectSessionsOrGroups={() => (
            <SelectGroups
              groups={employmentGroups}
              defaultValue={currentDashboardGroup?.name}
              selectedGroup={selectedGroup}
              handleValueChange={setSelectedGroup}
              selectItemsHeader={`Your Group Employers:`}
            />
          )}
        />
      </TabsContent>
      <TabsContent value="new-account">
        {/* change member mode to guest??? */}
        <NewAccountCard
          sessions={sessions}
          selectedSession={selectedSession}
          selectedUser={selectedUser}
          setSelectedSession={setSelectedSession}
          setSelectedUser={setSelectedUser}
          employmentGroups={employmentGroups}
        />
      </TabsContent>
    </Tabs>
  );
}
