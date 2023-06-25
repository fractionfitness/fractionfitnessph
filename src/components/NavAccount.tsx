'use client';

import { FC } from 'react';
// import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui-shadcn/DropdownMenu';
import LogoAvatar from '@/components/LogoAvatar';
import { Icons } from './Icons';

// interface NavAccountProps {
//   user: Pick<User, 'name' | 'image' | 'email'>;
// }

// const NavAccount: FC<NavAccountProps> = ({ user }) => {
const NavAccount: FC = ({ user }) => {
  // console.log('user====>', user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* <LogoAvatar
          className="h-8 w-8"
          user={{ name: user.name || null, image: user.image || null }}
        /> */}
        <LogoAvatar
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          className="h-10 w-10"
          fallbackIcon={<Icons.user className="h-10 w-10" />}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-stone-900 text-slate-300" align="end">
        <div className="flex items-center justify-start gap-2 p-2 ">
          <div className="flex flex-col space-y-1 leading-none">
            {user.profile?.first_name && (
              <p className="font-medium">{user.profile?.first_name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm">{user.email}</p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/r/create">Create community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/api/auth/signin`,
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavAccount;
