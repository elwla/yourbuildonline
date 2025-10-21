// app/reset-password/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>();

  const password = watch('password');

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setError('Token inválido o faltante');
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
      if (response.ok) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        setError('El enlace de recuperación ha expirado o es inválido');
      }
    } catch (err) {
      setTokenValid(false);
      setError('Error verificando el token');
    }
  };

  const onSubmit = async (data: ResetPasswordForm) => {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        setError(result.message || 'Error al actualizar la contraseña');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <p>Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Enlace Inválido</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="text-center">
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Nueva Contraseña</h2>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              {...register("password", {
                required: {
                  value: true,
                  message: "Contraseña es requerida"
                },
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres"
                }
              })}
            />
            {errors.password && (
              <p className='text-red-500 mt-1 text-xs'>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              disabled={isSubmitting}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Confirma tu contraseña"
                },
                validate: value =>
                  value === password || "Las contraseñas no coinciden"
              })}
            />
            {errors.confirmPassword && (
              <p className='text-red-500 mt-1 text-xs'>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-500 hover:underline text-sm">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;