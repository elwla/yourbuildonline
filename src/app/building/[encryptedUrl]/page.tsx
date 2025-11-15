// app/building/[encryptedUrl]/page.tsx
import React from "react";
import { decryptUrl } from '@/libs/encryption';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";
import Buttons from "@/components/Buttons";
import TruncatedUrlWithCopy from '@/components/TruncatedUrlWithCopy';

interface Project {
    id: number;
    name: string;
    description: string;
    image_url?: string | null;
    status: string | null;
    assignedUserId?: string | null;
    assignedUser?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    project_images: any[];
}

interface BuildingPageProps {
    params: {
        encryptedUrl: string;
    };
}

const loadProject = async (encryptedUrl: string): Promise<Project | null> => {
    try {
        const projectId = decryptUrl(encryptedUrl);        
        if (!projectId) {
            return null;
        }

        const project = await prisma.project.findUnique({
            where: { 
                id: parseInt(projectId),
                encryptedUrl: encryptedUrl
            },
            include: {
                project_images: {
                    orderBy: { order: 'asc' }
                },
                assignedUser: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return project;
    } catch (error) {
        console.error('❌ Error loading project:', error);
        return null;
    }
}

const BuildingPage = async ({ params }: BuildingPageProps) => {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;
    
    if (!session) {
        redirect('/login');
    }

    const project = await loadProject(resolvedParams.encryptedUrl);

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Proyecto No Encontrado</h1>
                    <p className="text-gray-600">El proyecto que buscas no existe o no tienes acceso.</p>
                </div>
            </div>
        );
    }

    const isAdmin = (session.user as {role?: string})?.role === 'admin';
    const isAssignedUser = project.assignedUserId === (session.user as {id?: string})?.id;

    if (!isAdmin && !isAssignedUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso Denegado</h1>
                    <p className="text-gray-600">No tienes permisos para ver este proyecto.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    project.status === 'completado' 
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {project.status === 'completado' ? '✅ Completado' : '🛠️ En Construcción'}
                                </span>
                                {isAdmin && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                        👑 Vista de Administrador
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Progreso de Construcción</h2>
                        {project.project_images && project.project_images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {project.project_images.map((image, index) => (
                                    <img
                                        key={image.id}
                                        src={image.url}
                                        alt={`Progreso ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No hay imágenes de progreso disponibles</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Descripción del Proyecto
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{project.description}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información de Acceso
                            </h2>
                            <p className="text-gray-400 mb-4">Si lo desea puede copiar la url para acceder directamente a su proyecto cuando esté logueado</p>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">URL de Acceso:</span>
                                    <TruncatedUrlWithCopy 
                                        url={`/building/${resolvedParams.encryptedUrl}`}
                                        maxLength={35}
                                        className="justify-end"
                                    />

                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Estado:</span>
                                    <span className="font-semibold bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                                        {project.status === 'construyendo' ? 'En Construcción' : 'Completado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {(session.user as {role?: string})?.role === 'admin' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Acciones
                                </h3>
                                <Buttons projectId={project.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildingPage;