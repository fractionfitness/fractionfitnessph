'use client';

import { redirect, useParams, usePathname } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-shadcn/Select';

// using onValueChange prop in <Select> requires this to be a client component
export default function SelectEmploymentGroups({ employmentGroups }) {
  const params = useParams();
  const currentGroup = employmentGroups.filter(
    (group) => group.id === +params.groupId,
  )[0];
  const currentGroupName = currentGroup ? currentGroup.name : undefined;

  const pathname = usePathname();
  const pathArray = pathname.split('/');
  const endingPath = pathArray[pathArray.length - 1];

  // console.log('groupId for SelectEmploymentGroups client comp', params.groupId);
  return (
    <Select
      onValueChange={(e) => {
        // console.log('<Select> event', e);
        // groupId is not the same as params.groupId | since each SelectItem comps refers to the current user's employment groups (groupId) while params.groupId refers to the current group in the url params
        const groupId = employmentGroups.filter((group) => group.name === e)[0]
          .id;
        if (pathname.endsWith('/dashboard/group')) {
          redirect(`/dashboard/group/${groupId}`);
        } else if (pathname.endsWith(`/dashboard/group/${+params.groupId}`)) {
          redirect(`/dashboard/group/${groupId}`);
        } else {
          redirect(`/dashboard/group/${groupId}/${endingPath}`);
        }
      }}
      defaultValue={currentGroupName}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choose a group" />
      </SelectTrigger>
      <SelectContent className="bg-secondary">
        <SelectGroup>
          <SelectLabel>Your Groups</SelectLabel>
          {/* try using value={group.id} */}
          {employmentGroups.map((group) => (
            <SelectItem
              className="focus:bg-background cursor-pointer"
              key={group.id}
              value={group.name}
            >
              {group.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
