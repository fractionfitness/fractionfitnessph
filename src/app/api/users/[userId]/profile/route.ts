import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getAuthSession();
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      user_id: session?.user?.id,
    },
  });
  return NextResponse.json({ data: userProfile });
}

export async function PUT(req: NextRequest, { params }) {
  // user's id must always be taken from the current session/token
  // use either getToken or getServerSession
  // const token = await getToken({ req });
  const session = await getAuthSession();
  const user_id = session?.user?.id;

  // check if url param (userId) is the same as current session's user
  if (+params.userId !== user_id) {
    console.log('unauthorized');
    return NextResponse.json({ message: 'unauthorized' });
  }

  // console.log("req.body===>", await req.json())
  // can't use req.json() if already used prior | results in TypeError: Body is unusable
  const formData = await req.json();
  // always get the name fields in order to compute full_name since haven't figured out how to use computed fields/columns with prisma and mysql
  const { first_name, middle_name, last_name } = formData;

  // user_id and full_name will never be sent via formData/req body
  const userProfile = {
    user_id,
    full_name: `${first_name},${middle_name},${last_name}`,
    ...formData,
  };

  const upsertedUserProfile = await prisma.userProfile.upsert({
    where: {
      user_id,
    },
    update: userProfile,
    create: userProfile,
  });
  // console.log('user_id', user_id);
  // console.log('token', token);
  // console.log('userProfile', upsertedUserProfile);

  return NextResponse.json({
    message: 'successfully updated your profile',
    data: upsertedUserProfile,
  });
}
