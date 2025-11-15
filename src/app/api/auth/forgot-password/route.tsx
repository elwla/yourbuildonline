// app/api/auth/forgot-password/route.ts (actualizado)
import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/libs/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email es requerido' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    const successMessage = 'Si el email existe en nuestro sistema, recibirás un enlace de recuperación en unos minutos.';

    if (user === undefined) {
      return NextResponse.json(
        { message: successMessage },
        { status: 200 }
      );
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    await prisma.user.update({
        where: {
            id: user?.id
        },
        data: {
            resetToken: resetToken,
            resetTokenExpiry: resetTokenExpiry
        } as any
    });

    // Enviar email
    try {
      await sendPasswordResetEmail(user?.email || '', resetToken);
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
    }

    return NextResponse.json(
      { message: successMessage },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}