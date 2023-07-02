import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request, context) {
  const session = await getAuthSession();
  const urlParamUserId = +context.params.userId;
  const sessionUserId = session?.user?.id;

  if (!session) {
    return new Response(
      'Unauthenticated: You must be logged in to view this resource.',
      { status: 401 },
    );
  }

  // console.log('sessionUserId', sessionUserId);
  // console.log('urlParamUserId', urlParamUserId);
  // console.log('check', sessionUserId !== urlParamUserId);

  //  check if current logged-in user is authorized to access a specific user's resource
  if (sessionUserId !== urlParamUserId) {
    return new Response(
      'Forbidden/Unauthorized: You are not allowed to access this resource.',
      { status: 403 },
    );
  }

  // eventually, requestor and owner of resource will not necessarily be the same and will be based on different rules (e.g. group employees can access group members' resources)

  const userGroups = await prisma.user.findFirst({
    where: {
      id: sessionUserId,
    },
    include: {
      groups: true,
    },
  });

  return NextResponse.json({ data: userGroups });
}
