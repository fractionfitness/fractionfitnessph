import { NextResponse } from 'next/server';

import { getAuthSession } from '@/src/lib/auth';

export async function GET(request: Request) {
  const session = await getAuthSession();

  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}
