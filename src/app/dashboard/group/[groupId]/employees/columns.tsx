'use client';

import { ColumnDef } from '@tanstack/react-table';

import { EmployeeRole, EmployeeStatus } from '@prisma/client';
import { employeeContent } from '@/config';
import { editEmployeeAction, removeEmployeeAction } from '@/actions/employee';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui-shadcn/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui-shadcn/DropdownMenu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui-shadcn/Tooltip';
import GroupUserOptions from '@/components/GroupUserOptions';

export type Employee = {
  name: string;
  group: string;
  email: string;
  role: EmployeeRole;
  user_id: number;
  group_id: number;
  // status: EmployeeStatus
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    // header: () => <div className="text-center">Name</div>,
    header: ({ table, header, column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc');
            }}
          >
            Name
            <Icons.arrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue('name')}</div>;
    },
  },
  {
    accessorKey: 'group',
    // header: () => <div className="text-center">Group</div>,
    header: ({ table, header, column, groups }) => {
      return (
        <div className="text-center">
          {/* if dropdown can select multiple groups at a time */}
          <GroupColumnFilterMultiple column={column} groups={groups} />

          {/* if dropdown can only select one group at a time */}
          {/* <GroupColumnFilterOne column={column} groups={groups} /> */}
        </div>
      );
    },
    filterFn: (row, columnId, value) => {
      //  this should always be the first conditional
      if (value.length === 0) return false;

      // value (search word array) is either an empty array or has element/s | value is not undefined
      const isMatch =
        value.filter((item) => item === row.getValue(columnId)).length > 0;
      return isMatch;

      // on initial render, filter value (search word array) will be undefined since no way to initialize with a starting value
      // no need to include since filter fn won't be executed on initial render
      // assume all groups are already selected since DropdownMenu initializes with checked={true} DropdownMenuCheckboxItem
      // note that undefined is diff. from empty array
      // if (value === undefined) return true;
    },
  },
  {
    accessorKey: 'role',
    header: () => <div className="text-center">Role</div>,
    // cell: ({ row }) => {
    //   const role: Employee['role'] = row.getValue('role');
    //   return role.charAt(0);
    // },
    cell: ({ row }) => {
      const role: Employee['role'] = row.getValue('role');
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">{role.charAt(0)}</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{role.charAt(0) + role.slice(1, role.length).toLowerCase()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'email',
    header: () => <div className="text-center">Email</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      // console.log('row.original ===>', row.original.name);

      return (
        <GroupUserOptions
          mode="employee"
          groupUser={row.original}
          roles={Object.keys(EmployeeRole)}
          statuses={
            EmployeeStatus
              ? Object.keys(EmployeeStatus)
              : employeeContent.userStatus
          }
          editUser={editEmployeeAction}
          removeUser={removeEmployeeAction}
        />
      );
    },
  },
];

function GroupColumnFilterMultiple({ column, groups }) {
  const queriedGroupsArrForDropdown = groups;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-auto">
          Group
          <Icons.chevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-secondary">
        {queriedGroupsArrForDropdown.map((item, index) => {
          return (
            <DropdownMenuCheckboxItem
              key={index}
              className="capitalize"
              checked={
                column.getFilterValue() === undefined
                  ? true
                  : column
                      .getFilterValue()
                      .filter((keyword) => keyword === item).length > 0
              }
              // checked={column.getFilterValue() === item}
              // checked={true}
              onCheckedChange={(value) => {
                // if checkbox item is checked
                if (value) {
                  column.setFilterValue((searchWordArr) => {
                    // previous filterValue (search word array) is either empty or has elements
                    if (searchWordArr) {
                      return [...searchWordArr, item];
                    }

                    // undefined previous filterValue
                    // note that undefined is diff. from empty array
                    // this won't ever execute since checkbox item is initialized to be checked and by the time all checkbox items have been unchecked, searchWordArr will be empty but not undefined
                    // if (searchWordArr === undefined) {
                    //   return [item];
                    // }
                  });
                } else {
                  // if checkbox item is unchecked
                  column.setFilterValue((searchWordArr) => {
                    // undefined previous filterValue so use initial groups that assumes all are selected
                    if (searchWordArr === undefined) {
                      return queriedGroupsArrForDropdown.filter(
                        (i) => i !== item,
                      );
                    } else {
                      return searchWordArr.filter((i) => i !== item);
                    }
                  });
                }
              }}
            >
              {item}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GroupColumnFilterOne({ column, groups }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Group
          <Icons.chevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-secondary">
        {groups.map((item, index) => {
          return (
            <DropdownMenuCheckboxItem
              key={index}
              className="capitalize"
              checked={column.getFilterValue() === item}
              onCheckedChange={(value) => {
                // column.toggleVisibility(!!value)
                if (value) {
                  column.setFilterValue(item);
                } else {
                  column.setFilterValue('');
                }
              }}
            >
              {item}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
