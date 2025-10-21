import { NextResponse } from 'next/server';
import { ContactFormEmail } from '@/libs/email';



export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email es requerido' },
        { status: 400 }
      );
    }

    const successMessage = 'Recibirás una copia de tu mensaje en tu bandeja de correos en unos minutos.';

    try {
      await ContactFormEmail(email, name, subject, message);
      console.log(`✅ Email del formulario de contacto enviado a: ${email}`);
    } catch (emailError) {
      console.error('❌ Error enviando email:', emailError);
      // No revertir la operación, pero loguear el error
    }

    return NextResponse.json(
      { message: successMessage },
      { status: 200 }
    );

  } catch (error) {
    console.error('💥 Error en forgot-password:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}