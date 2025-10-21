// libs/email-templates.ts
export const passwordResetTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: bold;
        }
        .content { 
            padding: 40px 30px; 
        }
        .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 25px 0; 
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        .button:hover {
            background: linear(135deg, #2563eb, #1e40af);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }
        .link-text {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #475569;
        }
        .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #92400e;
        }
        .footer { 
            text-align: center; 
            padding: 20px; 
            color: #6b7280; 
            font-size: 14px; 
            background: #f8fafc;
            border-top: 1px solid #e5e7eb;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Restablecer Contraseña</h1>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <div class="logo">Your App</div>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hola,</h2>
            
            <p style="margin-bottom: 20px; color: #4b5563;">
                Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para crear una nueva contraseña segura:
            </p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="button">🔄 Restablecer Contraseña</a>
            </div>
            
            <p style="margin: 25px 0 15px 0; color: #4b5563;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>
            
            <div class="link-text">
                ${resetLink}
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por razones de seguridad.
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
                Si no solicitaste este restablecimiento de contraseña, puedes ignorar este email de forma segura. 
                Tu cuenta permanecerá segura.
            </p>
        </div>
        <div class="footer">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your App. Todos los derechos reservados.</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">
                Este es un email automático, por favor no respondas a este mensaje.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const contactFormTemplate = (name: string, message: string) =>  `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: bold;
        }
        .content { 
            padding: 40px 30px; 
        }
        .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 25px 0; 
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
        }
        .button:hover {
            background: linear(135deg, #2563eb, #1e40af);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }
        .link-text {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #3b82f6;
            margin: 20px 0;
            word-break: break-all;
            font-size: 14px;
            color: #475569;
        }
        .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #92400e;
        }
        .footer { 
            text-align: center; 
            padding: 20px; 
            color: #6b7280; 
            font-size: 14px; 
            background: #f8fafc;
            border-top: 1px solid #e5e7eb;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Mensaje de Contacto</h1>
        </div>
        <div class="content">
            <div style="text-align: center; margin-bottom: 30px;">
                <div class="logo">Tu construcción Online</div>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hola,</h2>
            
            <p style="margin-bottom: 20px; color: #4b5563;">
                Se ha registrado un nuevo mensaje desde el formulario de contacto de ${name} con el siguiente mensaje:
            </p>
            
            <p style="margin: 25px 0 15px 0; color: #4b5563;">
                ${message}
            </p>
        </div>
        <div class="footer">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Your App. Todos los derechos reservados.</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #9ca3af;">
                Este es un email automático, por favor no respondas a este mensaje.
            </p>
        </div>
    </div>
</body>
</html>
`;


export const welcomeEmailTemplate = (userName: string) => `...`;