import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { passwordResetTemplate, contactFormTemplate } from '@/libs/email-template';

const mockEmailsSend = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: mockEmailsSend
      };
      constructor(apiKey: string) {}
    }
  };
});

vi.mock('@/libs/email-template', () => ({
  passwordResetTemplate: vi.fn(() => '<html>Password Reset Template</html>'),
  contactFormTemplate: vi.fn(() => '<html>Contact Form Template</html>')
}));

vi.stubGlobal('process', {
  env: {
    RESEND_API_KEY: 'test-api-key',
    NEXTAUTH_URL: 'https://test-app.com'
  }
});

const mockedPasswordResetTemplate = vi.mocked(passwordResetTemplate);
const mockedContactFormTemplate = vi.mocked(contactFormTemplate);

mockedPasswordResetTemplate.mockReturnValue('<html>Password Reset Template</html>');
mockedContactFormTemplate.mockReturnValue('<html>Contact Form Template</html>');

describe('Email Library', () => {
  let sendPasswordResetEmail: any;
  let ContactFormEmail: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockEmailsSend.mockClear();
    
    const emailModule = await import('@/libs/email');
    sendPasswordResetEmail = emailModule.sendPasswordResetEmail;
    ContactFormEmail = emailModule.ContactFormEmail;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('sendPasswordResetEmail', () => {
    it('debe enviar email de recuperación de contraseña exitosamente', async () => {
      const email = 'test@example.com';
      const token = 'test-token-123';
      const mockResponse = { id: 'email-123' };
      
      mockEmailsSend.mockResolvedValueOnce({ 
        data: mockResponse, 
        error: null 
      });

      const result = await sendPasswordResetEmail(email, token);

      expect(mockEmailsSend).toHaveBeenCalledWith({
        from: 'Your App <onboarding@resend.dev>',
        to: email,
        subject: '🔐 Restablecer tu contraseña - Your App',
        html: '<html>Password Reset Template</html>',
        text: `Para restablecer tu contraseña, visita: https://test-app.com/reset-password?token=test-token-123\n\nEste enlace expirará en 1 hora.\n\nSi no solicitaste este restablecimiento, ignora este email.`
      });

      expect(result).toEqual(mockResponse);
    });

    it('Debe lanzar error cuando Resend retorna error', async () => {
      const email = 'test@example.com';
      const token = 'test-token-123';
      const mockError = new Error('Error de Resend');

      mockEmailsSend.mockResolvedValueOnce({
        data: null,
        error: mockError
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(sendPasswordResetEmail(email, token)).rejects.toThrow('Error de Resend');

      expect(consoleSpy).toHaveBeenCalledWith('Error enviando email de recuperación:', mockError);

      consoleSpy.mockRestore();
    });

    it('Debe lanzar error cuando hay excepción en el envío', async () => {
      const email = 'test@example.com';
      const token = 'test-token-123';
      const mockError = new Error('Network error');

      mockEmailsSend.mockRejectedValueOnce(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(sendPasswordResetEmail(email, token)).rejects.toThrow('Network error');

      expect(consoleSpy).toHaveBeenCalledWith('❌ Error en sendPasswordResetEmail:', mockError);

      consoleSpy.mockRestore();
    });

    it('Debe construir el enlace de reset correctamente', async () => {
        const email = 'test@example.com';
        const token = 'test-token-456';

        mockEmailsSend.mockResolvedValueOnce({
            data: { id: 'email-456' },
            error: null
        });

        await sendPasswordResetEmail(email, token);

        expect(mockedPasswordResetTemplate).toHaveBeenLastCalledWith(
            'https://test-app.com/reset-password?token=test-token-456'
        )
    })
  });

  describe('ContactFormEmail', () => { 
    it('Debe enviar el email de contacto exitosamente', async () => {
      const email = 'user@example.com';
      const name = 'Juan Pérez';
      const subject = 'Consulta sobre servicios';
      const message = 'Me interesa conocer más sobre sus servicios.';

      const mockResponse = { id: 'contact-email-123' };
      mockEmailsSend.mockResolvedValueOnce({
        data: mockResponse,
        error: null
      });

      const result = await ContactFormEmail(email, name, subject, message);

      expect(mockEmailsSend).toHaveBeenCalledWith({
        from: 'Tu construcción Online <onboarding@resend.dev>',
        to: [email, 'wladimir.msb@gmail.com'],
        subject: subject,
        html: '<html>Contact Form Template</html>',
        text: message
      });

      expect(mockedContactFormTemplate).toHaveBeenCalledWith(name, message);

      expect(result).toEqual(mockResponse);
    })

    it('debe lanzar error cuando Resend retorna error en contacto', async () => {
      const email = 'user@example.com';
      const name = 'Juan Pérez';
      const subject = 'Consulta';
      const message = 'Mensaje de prueba';
      
      const mockError = new Error('Error de envío');
      mockEmailsSend.mockResolvedValueOnce({ 
        data: null, 
        error: mockError 
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(ContactFormEmail(email, name, subject, message))
        .rejects.toThrow('Error de envío');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error enviando email de recuperación:',
        mockError
      );

      consoleSpy.mockRestore();
    });

    it('debe lanzar error cuando hay excepción en el envío de contacto', async () => {
      const email = 'user@example.com';
      const name = 'Juan Pérez';
      const subject = 'Consulta';
      const message = 'Mensaje de prueba';
      
      const mockError = new Error('Network error');
      mockEmailsSend.mockRejectedValueOnce(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(ContactFormEmail(email, name, subject, message))
        .rejects.toThrow('Network error');

      expect(consoleSpy).toHaveBeenCalledWith(
        '❌ Error en sendPasswordResetEmail:',
        mockError
      );

      consoleSpy.mockRestore();
    });

    it('debe enviar el email tanto al usuario como al email de contacto', async () => {
      const email = 'user@example.com';
      const name = 'María García';
      const subject = 'Test';
      const message = 'Test message';
      
      mockEmailsSend.mockResolvedValueOnce({ 
        data: { id: 'test-email' }, 
        error: null 
      });

      await ContactFormEmail(email, name, subject, message);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [email, 'wladimir.msb@gmail.com']
        })
      );
    });
   });

   describe('Logs', () => {
    it('debe loggear éxito en envío de password reset', async () => {
      const email = 'test@example.com';
      const token = 'test-token';
      
      mockEmailsSend.mockResolvedValueOnce({ 
        data: { id: 'email-123' }, 
        error: null 
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await sendPasswordResetEmail(email, token);

      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Email de recuperación enviado a:',
        email
      );

      consoleSpy.mockRestore();
    });

    it('debe loggear éxito en envío de contacto', async () => {
      const email = 'user@example.com';
      const name = 'Test User';
      const subject = 'Test';
      const message = 'Test message';
      
      mockEmailsSend.mockResolvedValueOnce({ 
        data: { id: 'contact-123' }, 
        error: null 
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await ContactFormEmail(email, name, subject, message);

      expect(consoleSpy).toHaveBeenCalledWith(
        '✅ Email de recuperación enviado a:',
        email
      );

      consoleSpy.mockRestore();
    });
  });
});