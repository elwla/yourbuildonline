"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ForgotPasswordForm {
  email: string;
}


const forgotPasswordPage = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    

    const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setMessage(null);
    setError(null);

    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: data.email}),
        });

        const result = await response.json();

        if (response.ok) {
            setMessage('Se ha enviado un enlace de recuperación a tu email');
            router.push('reset-password');
        } else {
            setError(result.message || 'Error al enviar el email');
        }

    } catch (err) {
        setError('Error de conexión')
    }
  };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-center'>¿Olvidaste tu contraseña?</h2>

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

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            disabled={isSubmitting}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50'
                            placeholder="Ingresa tu email"
                            {...register("email", {
                                required: {
                                value: true,
                                message: "Email es requerido"
                                },
                                pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Email inválido"
                                }
                            })}
                        />

                        {errors.email && (
                            <p className='text-red-500 mt-1 text-xs'>{errors.email.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link href="/login" className="text-blue-500 hover:underline text-sm">
                        Volver al login
                    </Link>
                </div>
            </div>
        </div>

    )
};

export default forgotPasswordPage;