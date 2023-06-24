import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

// Get all Users
export async function GET(req: Request) {
  const users = await prisma.user.findMany();
  // return new Response(JSON.stringify({ data: users }));
  return NextResponse.json({ data: users });
}
