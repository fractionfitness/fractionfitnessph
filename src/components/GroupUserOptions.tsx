'use client';

import { useEffect, useRef, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from './ui-shadcn/Popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-shadcn/Select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui-shadcn/AlertDialog';
import { Label } from './ui-shadcn/Label';
import { Button } from './ui-shadcn/Button';
import { Icons } from '@/components/Icons';
import { memberContent, employeeContent } from '@/config';

function SelectOptions({
  items,
  placeholder,
  defaultValue,
  handleSelectChange,
}) {
  // useRef doesnt work since no value in SelectContent
  // const selectRef = useRef(null);

  return (
    <Select onValueChange={handleSelectChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Your Groups</SelectLabel> */}
          {items.map((item) => {
            return (
              <SelectItem key={item} value={item} className="cursor-pointer">
                {/* need to manipulate string so that capitalization will be consistent with SelectItem value prop */}
                {item.charAt(0) + item.slice(1, item.length).toLowerCase()}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function RemoveAlertDialog({ handleRemoveUser }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-red-700 hover:text-gray-50 p-1 border-2 border-red-600 text-red-700"
        >
          REMOVE
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="default">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleRemoveUser}>
            REMOVE
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// make a button component that can be used in the client, so that it can be separated from GroupUserOptions and GroupUserOptions can just be a server component
// no need for a separate SelectOptions comp???

// groupUser can be a Member or Employee record and its User details
export default function GroupUserOptions({
  mode,
  groupUser,
  roles,
  statuses,
  editUser,
  removeUser,
}) {
  // remove const DEFAULT_USER_STATUS after adding status field to Employee/Member model
  const DEFAULT_USER_STATUS = statuses[0];

  // const [selectedRole, setSelectedRole] = useState('');
  // const [selectedStatus, setSelectedStatus] = useState('');
  // better to use useRef than useState
  const roleRef = useRef(null);
  const statusRef = useRef(null);
  const selectedRole = roleRef.current;
  const selectedStatus = statusRef.current;

  const popoverBtnRef = useRef(null);

  // need state for loading spinner of PopoverTrigger Icon and can also be used to disable
  const [popoverBtnStatus, setPopoverBtnStatus] = useState(true);

  const [editButtonStatus, setEditButtonStatus] = useState(false);

  const { userType, groupType } =
    mode === 'member' ? memberContent : employeeContent;

  // initialize PopoverTrigger to be active
  useEffect(() => {
    // popoverBtnRef.current.disabled = false;
    setPopoverBtnStatus(true);
    setEditButtonStatus(false);
  }, [groupUser]);

  const handleRoleChange = (e) => {
    // console.log('handleRoleChange', e);
    // setSelectedRole(e);
    roleRef.current = e;
    if (groupUser.role === e) {
      setEditButtonStatus(false);
    } else {
      setEditButtonStatus(true);
    }
  };
  const handleStatusChange = (e) => {
    // console.log('handleStatusChange', e);
    // setSelectedStatus(e);
    statusRef.current = e;
    // remove ?? DEFAULT_USER_STATUS after adding status field to Employee/Member model
    if (groupUser.status ?? DEFAULT_USER_STATUS === e) {
      setEditButtonStatus(false);
    } else {
      setEditButtonStatus(true);
    }
  };

  const handleEditUser = (e) => {
    // throw new Error('client-side error');
    editUser(groupUser, selectedRole, selectedStatus);
    setEditButtonStatus(false);

    // close popover
    popoverBtnRef.current.click();

    // disable PopoverTrigger until Group User List is refreshed
    // popoverBtnRef.current.disabled = true;
    setPopoverBtnStatus(false);
  };

  const handleRemoveUser = (e) => {
    removeUser(groupUser);
    popoverBtnRef.current.click();
    setPopoverBtnStatus(false);
  };

  return (
    <Popover
      onOpenChange={(e) => {
        // when popover is closed, reset edit button to disabled
        if (!e) {
          setEditButtonStatus(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          // variant="secondary"
          variant="ghost"
          // onClick={(e) => console.log('button clicked')}
          className="hover:bg-gray-700 hover:text-gray-50 p-1"
          ref={popoverBtnRef}
          disabled={!popoverBtnStatus}
        >
          {popoverBtnStatus ? (
            <Icons.optionsVertical />
          ) : (
            <Icons.loader className="animate-spin-slow" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none capitalize text-center">{`Group ${userType} Options`}</h4>
            <hr />
            <p className="text-sm text-muted-foreground text-center">
              {`Edit group ${userType.toLowerCase()} details`}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Edit Role</Label>
              <SelectOptions
                items={roles}
                placeholder={`${userType} Roles`}
                defaultValue={groupUser.role}
                handleSelectChange={handleRoleChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Edit Status</Label>
              <SelectOptions
                items={statuses}
                placeholder={`${userType} Status`}
                // remove ?? DEFAULT_USER_STATUS after adding status field to Employee/Member model
                defaultValue={groupUser.status ?? DEFAULT_USER_STATUS}
                handleSelectChange={handleStatusChange}
              />
            </div>
            <Button
              variant="default"
              disabled={!editButtonStatus}
              onClick={handleEditUser}
              // className="hover:bg-gray-700 hover:text-gray-50 p-1"
            >
              {/* {`Edit Group ${userType} Details`} */}
              EDIT
            </Button>
          </div>

          <hr />
          <p className="text-sm text-muted-foreground text-center">
            {`Remove group ${userType.toLowerCase()}`}
          </p>
          <RemoveAlertDialog handleRemoveUser={handleRemoveUser} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
