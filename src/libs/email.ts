// libs/email.ts
import { Resend } from 'resend';
import { passwordResetTemplate, contactFormTemplate } from './email-template';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    
    const { data, error } = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>', // Cambia esto por tu dominio verificado
      to: email,
      subject: '🔐 Restablecer tu contraseña - Your App',
      html: passwordResetTemplate(resetLink),
      text: `Para restablecer tu contraseña, visita: ${resetLink}\n\nEste enlace expirará en 1 hora.\n\nSi no solicitaste este restablecimiento, ignora este email.`
    });

    if (error) {
      console.error('Error enviando email de recuperación:', error);
      throw error;
    }

    console.log('✅ Email de recuperación enviado a:', email);
    return data;

  } catch (error) {
    console.error('❌ Error en sendPasswordResetEmail:', error);
    throw error;
  }
}

export async function ContactFormEmail(email: string, name: string, subject: string, message: string) {
  try {
      const contactEmail = 'wladimir.msb@gmail.com';
      const { data, error } = await resend.emails.send({
      from: 'Tu construcción Online <onboarding@resend.dev>',
      to: [email, contactEmail],
      subject: subject,
      html: contactFormTemplate(name, message),
      text: message
    });

    if (error) {
      console.error('Error enviando email de recuperación:', error);
      throw error;
    }

    console.log('✅ Email de recuperación enviado a:', email);
    return data;

  } catch (error) {
    console.error('❌ Error en sendPasswordResetEmail:', error);
    throw error;
  }
}

// // email de bienvenida
// export async function sendWelcomeEmail(email: string, userName: string) {
// }