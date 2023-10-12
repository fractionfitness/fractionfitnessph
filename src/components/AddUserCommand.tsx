'use client';

import { useState, useEffect, useTransition } from 'react';
import { useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { searchUsersAction } from '@/actions/user';
import { addUsersToGroupMembershipAction } from '@/actions/member';
import { addUsersToGroupEmploymentAction } from '@/actions/employee';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui-shadcn/Command';
import { Skeleton } from './ui-shadcn/Skeleton';
import { Button } from './ui-shadcn/Button';
import { Icons } from './Icons';
import { memberContent, employeeContent } from '@/config';

export default function AddUserCommand({ mode }) {
  // const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // query state is to store inputValue.trim() and to store string value that is different from previous query (any char added or removed)
  // if changes in spacing, between names, changes, app will treat that as new string
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 500);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // need useTransition to implement loading spinner and disab Add Member Button
  // useEffect and state doesn't work because no way to trigger a reset (using useEffect) of the Add Member Button state when group member list changes or is updated
  // since AddUserCommand currently doesnt accept prop for Group Members List and no state to store current Group Members
  const [isPending, startTransition] = useTransition();

  const hasValidQuery = Boolean(debouncedQuery.length > 0);
  const hasSearchResults = Boolean(searchResults.length > 0);
  const hasSelectedUsers = Boolean(selectedUsers.length > 0);
  const { userType, groupType } =
    mode === 'member' ? memberContent : employeeContent;

  const params = useParams();

  useEffect(() => {
    let ignore = false;

    const handleFetchData = async () => {
      if (debouncedQuery.length === 0) return setSearchResults([]);

      // no need to check debouncedQuery.length since already checked above
      if (debouncedQuery && debouncedQuery.length > 0) {
        try {
          setLoading(true);
          setSearchResults([]);
          const results = await searchUsersAction(debouncedQuery);

          // ignore query result and do not setSearchResults, if cleanup function executed
          if (ignore === false && results) {
            setSearchResults(results);
          }
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
    };

    // startTransition(handleFetchData);
    handleFetchData();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  // reset query and inputValue to empty string when "Add Member Command Dialog" is closed
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setQuery('');
      setSearchResults([]);
      setSelectedUsers([]);
    }
  }, [isOpen]);

  console.count('comp render');

  const handleInputChange = (e) => {
    setInputValue(e);

    // trim spaces and make sure input change is different to previous query
    // disregard input if user just added spaces and no new chars
    if (e.trim() !== query) {
      setQuery(e.trim());
    }

    // clear results if empty search bar
    if (e.trim().length === 0) {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (selectedUser) => {
    // setIsOpen(false);
    setSelectedUsers((s) => {
      const match = s.filter((item) => item.id === selectedUser.id).length > 0;
      // user already selected
      if (!match) {
        return [...s, selectedUser];
      } else {
        return s;
      }
    });
  };

  const handleRemoveUser = (removedUser) => {
    setSelectedUsers((s) => {
      return s.filter((item) => item.id !== removedUser.id);
    });
  };

  const handleAddButtonClick = (selectedUsers, groupId) => {
    setIsOpen(false);
    if (mode === 'member') {
      startTransition(() =>
        addUsersToGroupMembershipAction(selectedUsers, groupId),
      );
      // to remove typescript error, ensure addUsersToGroupMembershipAction function doesn't return any value
    }
    if (mode === 'employee') {
      startTransition(() =>
        addUsersToGroupEmploymentAction(selectedUsers, groupId),
      );
    }
  };

  return (
    <>
      {/* <Button variant="default" onClick={() => setIsOpen(true)}>
        <Icons.plus className="h-4 w-4 mr-2" aria-hidden="true" />
        <span className="">Add {userType}</span>
      </Button> */}
      <Button
        // variant="secondary"
        variant="default"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
      >
        {!isPending ? (
          <Icons.plus className="h-4 w-4 mr-2" aria-hidden="true" />
        ) : (
          <Icons.loader className="mr-2 animate-spin-slow" />
        )}
        <span className="">Add {userType}</span>
      </Button>
      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search account names..."
          value={inputValue}
          onValueChange={handleInputChange}
        />
        <CommandList>
          {/* NOT USING TRANSITION */}
          {!hasSearchResults && hasValidQuery && (
            <CommandEmpty
              className={cn(loading ? 'hidden' : 'py-6 text-center text-sm')}
            >
              User not found.
            </CommandEmpty>
          )}
          {loading && (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-6 w-24 rounded" />
              <Skeleton className="h-10 rounded-sm" />
              <Skeleton className="h-10 rounded-sm" />
            </div>
          )}
          {hasSearchResults && (
            <CommandGroup className="capitalize" heading="Matching Users">
              {searchResults?.map(({ user_id, full_name, user: { email } }) => {
                return (
                  <CommandItem
                    key={user_id}
                    value={user_id}
                    className="cursor-pointer normal-case"
                    onSelect={(e) => {
                      handleSelectUser({
                        id: user_id,
                        full_name,
                        email,
                      });
                    }}
                  >
                    {`${full_name} | ${email}`}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
          {hasSelectedUsers && (
            <>
              <CommandSeparator alwaysRender={true} />
              <CommandGroup className="capitalize" heading="Selected Users">
                {hasSelectedUsers &&
                  selectedUsers.map((user) => (
                    <div key={user.email} className="flex">
                      <Button
                        variant="outline"
                        size="xs"
                        className="hover:bg-destructive hover:text-destructive-foreground my-auto"
                        onClick={() => {
                          handleRemoveUser(user);
                        }}
                      >
                        <Icons.close
                          aria-hidden="true"
                          // className="hover:bg-destructive hover:text-destructive-foreground"
                        />
                      </Button>
                      <CommandItem className="aria-selected:bg-background">
                        {user.full_name}
                      </CommandItem>
                    </div>
                  ))}
              </CommandGroup>
              <CommandSeparator alwaysRender={true} />
              <Button
                variant="default"
                onClick={() =>
                  handleAddButtonClick(selectedUsers, +params.groupId)
                }
                className="mx-auto block my-2"
              >
                Add to Group {groupType}
              </Button>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}