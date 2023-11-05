'use client';

import { useTransition } from 'react';

import { MemberStatus } from '@prisma/client';
import { Button } from './ui-shadcn/Button';
import { addUserToGroupMembershipAction } from '@/actions/member';

export default function UserJoinMembershipButton({ user, groupId }) {
  const [isPending, startTransition] = useTransition();

  const handleButtonClick = () => {
    startTransition(() =>
      addUserToGroupMembershipAction(
        user,
        groupId,
        '/groups',
        MemberStatus.PENDING_GROUP_APPROVAL, // passing 'PENDING_GROUP_APPROVAL' as arg also works
      ),
    );
  };
  return (
    <Button variant="outline" onClick={handleButtonClick}>
      Join
    </Button>
  );
}
