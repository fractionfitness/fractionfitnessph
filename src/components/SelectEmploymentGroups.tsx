'use client';

import { redirect } from 'next/navigation';

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
  return (
    <Select
      onValueChange={(e) => {
        console.log('<Select> event', e);
        const groupId = employmentGroups.filter((group) => group.name === e)[0]
          .id;
        console.log('groupId', groupId);
        if (groupId) {
          redirect(`/dashboard/group/${groupId}`);
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choose a group" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Groups</SelectLabel>
          {/* try using value={group.id} */}
          {employmentGroups.map((group) => (
            <SelectItem key={group.id} value={group.name}>
              {group.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
