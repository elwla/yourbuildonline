"use client";
import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

import { useRouter, useSearchParams } from 'next/navigation';

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const searchParams = useSearchParams();
    const router = useRouter();
    const redirectTo = searchParams.get('from') || '/';


      useEffect(() => {
        getSession().then(session => {
          if (session) {
            router.push(redirectTo);
          }
        });
      }, [router, redirectTo]);
    
    
    const onSubmit = handleSubmit((data) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { message: "El formato del email no es válido" },
                { status: 400 }
            );
        } else if (data.password.length < 8) {
            return NextResponse.json(
                { message: "La contraseña debe tener al menos 8 caracteres" },
                { status: 400 }
            );
        } else {
            fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                router.push('login');
                router.refresh();
            } else {
                console.error('Registration failed');
            }
        }).catch((error) => {
            console.error('An error occurred:', error);
        });
        }
    });

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
            <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
            <form>
                <input
                className='w-full p-2 mb-1 border border-gray-300 rounded'
                type="text"
                placeholder="Nombre de usuario"
                {...register('userName', { required: { value: true, message: "El nombre de usuario es obligatorio" } })}
            />
            { errors.userName && <p className='text-red-500 mb-4 text-xs'>{errors.userName.message as string}</p> }
            <input
                className='w-full p-2 mb-1 border border-gray-300 rounded'
                type="text"
                placeholder="Nombre"
                {...register('firstName', { required: { value: true, message: "El nombre es obligatorio" } })}
            />
            { errors.firstName && <p className='text-red-500 mb-4 text-xs'>{errors.firstName.message as string}</p> }
            <input
                className='w-full p-2 mb-1 border border-gray-300 rounded'
                type="text"
                placeholder="Apellido"
                {...register('lastName', { required: { value: true, message: "El apellido es obligatorio" } })}
            />
            { errors.lastName && <p className='text-red-500 mb-4 text-xs'>{errors.lastName.message as string}</p> }
            <input
                className='w-full p-2 mb-1 border border-gray-300 rounded'
                type="email"
                placeholder="Email"
                {...register('email', { required: { value: true, message: "El email es obligatorio" } })}
            />
            { errors.email && <p className='text-red-500 mb-4 text-xs'>{errors.email.message as string}</p> }
            <input
                className='w-full p-2 mb-1 border border-gray-300 rounded'
                type="password"
                placeholder="Password"
                {...register('password', { required: { value: true, message: "La contraseña es obligatoria" } })}
            />
            { errors.password && <p className='text-red-500 mb-4 text-xs'>{errors.password.message as string}</p> }
            <input
                className='w-full p-2 mb-1 border border-gray-300 rounded'
                type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword', { required: { value: true, message: "Confirmar la contraseña es obligatorio" } })}
            />
            { errors.confirmPassword && <p className='text-red-500 mb-4 text-xs'>{errors.confirmPassword.message as string}</p> }
            <button
                type="submit"
                className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors'
                onClick={onSubmit}
            >
                Register
            </button>
        </form>
            </div>
        </div>
    );
};

export default RegisterPage;