'use client';

import { useState, useEffect } from 'react';
import {
  // redirect,
  useParams,
  usePathname,
  useRouter,
} from 'next/navigation';

import SelectGroups from '@/components/SelectGroups';

// using onValueChange prop in <Select> requires this to be a client component
export default function DashboardSelectGroups({ groups }) {
  const router = useRouter();
  const params = useParams();
  const paramsGroupId = params.groupId ? +params.groupId : undefined;
  const currentGroup = groups.filter((group) => group.id === paramsGroupId)[0];

  const [selectedGroupId, setSelectedGroupId] = useState(paramsGroupId);

  const pathname = usePathname();
  const pathArray = pathname.split('/');
  const endingPath = pathArray[pathArray.length - 1];

  useEffect(() => {
    if (
      // checks if both url query param and selectedGroupId are undefined or are equal, then ends execution, otherwise redirect if a diff. group is selected
      (typeof paramsGroupId === 'undefined' &&
        typeof selectedGroupId === 'undefined') ||
      selectedGroupId === paramsGroupId
    ) {
      return;
    }
    if (pathname.endsWith('/dashboard/group')) {
      console.log('firing', console.log(selectedGroupId));
      // redirect(`/dashboard/group/${selectedGroupId}`);
      router.push(`/dashboard/group/${selectedGroupId}`);
    } else if (pathname.endsWith(`/dashboard/group/${paramsGroupId}`)) {
      console.log('firing', console.log(selectedGroupId));
      // redirect(`/dashboard/group/${selectedGroupId}`);
      router.push(`/dashboard/group/${selectedGroupId}`);
    } else {
      console.log('firing', console.log(selectedGroupId));
      // redirect(`/dashboard/group/${selectedGroupId}/${endingPath}`);
      router.push(`/dashboard/group/${selectedGroupId}/${endingPath}`);
    }

    // groups are the user's employment groups with selectedGroupId as the id, while params.groupId refers to the current group in the url params

    // both redirect or router.push() works
  }, [selectedGroupId, paramsGroupId, endingPath]);

  return (
    <div className="w-[250px]">
      <SelectGroups
        groups={groups}
        defaultValue={currentGroup?.name}
        selectedGroup={groups.filter((g) => g.id === selectedGroupId)}
        handleValueChange={(matchingGroup) =>
          setSelectedGroupId(matchingGroup.id)
        }
        selectItemsHeader={`Your Group Employers:`}
      />
    </div>
  );
}
