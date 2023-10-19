import { useState, useEffect } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';

import { Button } from '@/components/ui-shadcn/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui-shadcn/Command';
import { Label } from '@/components/ui-shadcn/Label';
import { Skeleton } from '@/components/ui-shadcn/Skeleton';

export default function SearchSelectUserCommand({
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
