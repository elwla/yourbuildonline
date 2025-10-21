// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
            gt: new Date()
            }
        }
    });

    if (user === undefined) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 400 }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en reset-password:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}