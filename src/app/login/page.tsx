"use client";
import React, { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface LoginForm {
  email: string;
  password: string;
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 255);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8 && password.length <= 128;
};

const createRateLimiter = () => {
  let attempts = 0;
  let lastAttemptTime = 0;
  
  return {
    canAttempt: () => {
      const now = Date.now();
      if (now - lastAttemptTime > 30000) { // Reset después de 30 segundos
        attempts = 0;
      }
      lastAttemptTime = now;
      attempts++;
      return attempts <= 5; // Máximo 5 intentos
    },
    getRemainingTime: () => {
      const now = Date.now();
      return Math.max(0, 30000 - (now - lastAttemptTime));
    }
  };
};

const rateLimiter = createRateLimiter();

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  const redirectTo = searchParams.get('from') || '/';

      const {
          register,
          handleSubmit,
          formState: { errors, isSubmitting },
      } = useForm<LoginForm>({
        mode: "onChange",
        reValidateMode: "onChange",
      });

  useEffect(() => {
    getSession().then(session => {
      if (session) {
        router.push(redirectTo);
      }
    });
  }, [router, redirectTo]);

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        const remaining = rateLimiter.getRemainingTime();
        if (remaining <= 0) {
          setIsLocked(false);
          clearInterval(timer);
        } else {
          setLockTime(Math.ceil(remaining / 1000));
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked]);

  const onSubmit = handleSubmit ( async (data: LoginForm) => {
    setError(null);

    if (!rateLimiter.canAttempt()) {
      setIsLocked(true);
      setError('Demasiados intentos. Por favor espera 30 segundos.');
      return;
    }

    try {
      const sanitizedData = {
        email: sanitizeInput(data.email),
        password: sanitizeInput(data.password)
      };

      if (!isValidEmail(sanitizedData.email)) {
        setError('Por favor ingresa un email válido');
        return;
      }

      if (!isValidPassword(sanitizedData.password)) {
        setError('La contraseña debe tener entre 8 y 128 caracteres');
        return;
      }

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales invalidas');
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    }
  });

  const handleSocialLogin = async (provider: string) => {
    setError(null);

    try {
      await signIn(provider, { 
        callbackUrl: redirectTo,
        redirect: true 
      });
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setError(`Error with ${provider} login`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className={`px-4 py-3 rounded mb-4 ${
            error.includes('Demasiados intentos') 
              ? 'bg-orange-100 border border-orange-400 text-orange-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {error}
            {isLocked && (
              <div className="text-sm mt-1">
                Tiempo restante: {lockTime} segundos
              </div>
            )}
            </div>
        )}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin('facebook')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>

          <button
            onClick={() => handleSocialLogin('apple')}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-black text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              disabled={isSubmitting || isLocked}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email es requerido"
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email inválido"
                },
                maxLength: {
                  value: 254,
                  message: "El email no puede tener más de 254 caracteres"
                },
                validate: {
                  noHtml: (value) => 
                    !/[<>]/.test(value) || "Caracteres no permitidos",
                }
              })}
            />
            { errors.email && <p className='text-red-500 mb-4 text-xs'>{errors.email.message as string}</p> }
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password es requerido"
                },
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres"
                },
                maxLength: {
                  value: 128,
                  message: "La contraseña no puede tener más de 128 caracteres"
                },
                validate: {
                  noHtml: (value) => 
                    !/[<>]/.test(value) || "Caracteres no permitidos",
                }
              })}
            />
            { errors.password && <p className='text-red-500 mb-4 text-xs'>{errors.password.message as string}</p> }
          </div>
          <button
            type="submit"
            disabled={isSubmitting || isLocked}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : isLocked ? `Espera ${lockTime}s` : 'Sign in with Email'}
          </button>
        </form>

        <div className='mt-6 flex justify-between'>
          <Link href="/register" className="text-blue-500 hover:underline text-xs">
            No tienes cuenta? Regístrate
          </Link>
          <Link href="/forgot-password" className="text-blue-500 hover:underline text-xs">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-gray-500 hover:underline text-xs">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;