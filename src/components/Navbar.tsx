"use client";
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

const NavBar = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status !== 'loading') {
            setIsLoading(false);
        }
    }, [status]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    if (isLoading) {
        return (
            <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50 transition-all duration-300">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-white text-lg font-bold">Tu Construcción Online</Link>
                    <div className="text-gray-300">Cargando...</div>
                </div>
            </nav>
        );
    }

    const isLoggedIn = !!session;

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50 transition-all duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-lg font-bold">Tu Construcción Online</Link>
                <div className="flex items-center space-x-4">
                    <Link href="/about" className="text-gray-300 hover:text-white transition duration-200">Acerca de nosotros</Link>
                    <Link href="/projects" className="text-gray-300 hover:text-white transition duration-200">Proyectos</Link>
                    
                    {(session?.user as {role?: string})?.role === 'admin' && (
                        <Link href="/new" className="text-gray-300 hover:text-white transition duration-200">Crear nuevo proyecto</Link>
                    )}
                    
                    {isLoggedIn && (
                        <Link href="/building" className="text-gray-300 hover:text-white transition duration-200">Revisa tu proyecto</Link>
                    )}
                    <Link href="/contact" className="text-gray-300 hover:text-white transition duration-200">Contactanos</Link>
                    {!isLoggedIn ? (
                        <>
                            <Link href="/login" className="text-gray-300 hover:text-white transition duration-200">Login</Link>
                            <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200">Regístrate</Link>
                        </>
                    ) : (
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;