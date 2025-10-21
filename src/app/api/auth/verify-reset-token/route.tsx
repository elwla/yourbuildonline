// app/api/auth/verify-reset-token/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
            gt: new Date()
            }
        }
    });

    if (user.length === undefined) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}