import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request, res: NextResponse) {
  const { email, password } = await req.json();

  // user input validation
  if (
    !email ||
    !email.includes('@') ||
    !password
    // || password.trim().length < 5
  ) {
    return NextResponse.json({
      message: 'Invalid input: email or password',
      data: null,
    });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json({ message: 'User already exists!', data: null });
  }

  try {
    const newUser = await prisma.user.create({
      data: { email, password: await hashPassword(password) },
    });
    const { password: pword, ...newUserExcludePword } = newUser;
    return NextResponse.json({
      message: 'Created user!',
      data: newUserExcludePword,
    });
  } catch (e) {
    console.error(e);
  }
}
