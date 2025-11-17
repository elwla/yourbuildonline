// app/building/page.tsx
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
import prisma from "@/libs/prisma";
import { redirect } from "next/navigation";

interface Project {
    id: number;
    name: string;
    description: string;
    status: string | null;
    encryptedUrl?: string | null;
    created_at: Date;
    assignedUserId?: string | null;
}

const BuildingPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    let projects: Project[] = [];
    
    try {
        const isAdmin = session.user.role === 'admin';

        if (isAdmin) {
            projects = await prisma.project.findMany({
                where: {
                    status: 'construyendo'
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    encryptedUrl: true,
                    created_at: true,
                    assignedUserId: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
        } else {
            projects = await prisma.project.findMany({
                where: {
                    status: 'construyendo',
                    assignedUserId: (session.user as {id?: string}).id
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    encryptedUrl: true,
                    created_at: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }

    const userProjects = projects.filter(p => p.status === 'construyendo');
    const isAdmin = session.user.role === 'admin';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isAdmin ? 'Todos los Proyectos en Construcción' : 'Mis Proyectos en Construcción'}
                    </h1>
                    <p className="text-gray-600">
                        {isAdmin 
                            ? 'Vista de administrador - Todos los proyectos en construcción'
                            : 'Proyectos que tienes asignados y están en construcción'
                        }
                    </p>
                </div>

                {userProjects.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            No hay proyectos en construcción
                        </h2>
                        <p className="text-gray-600">
                            {isAdmin 
                                ? 'No hay proyectos en construcción en este momento.'
                                : 'No tienes proyectos asignados en construcción.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userProjects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/building/${project.encryptedUrl}`}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {project.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {project.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                                            🛠️ En Construcción
                                        </span>
                                        <span className="text-blue-600 text-sm font-medium">
                                            Ver Progreso →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuildingPage;