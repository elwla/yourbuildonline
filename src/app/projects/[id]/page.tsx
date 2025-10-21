import React from "react";
import axios from "axios";
import Buttons from "../../../components/Buttons";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { getServerSession } from "next-auth/next"

interface ProjectImage {
  id: number;
  url: string;
  order: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  project_images?: ProjectImage[];
  created_at?: string;
}

const loadProjects = async (projectId: string): Promise<Project> => {
    const { data } = await axios.get(`http://localhost:3000/api/projects/${projectId}`);
    return data;
}

type ProjectElementProps = {
    params: {
        id: string;
    };
};

const ProjectElement = async ({ params }: ProjectElementProps) => {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;
    const project = await loadProjects(resolvedParams.id);

    const projectImages = project.project_images || [];
    const sortedImages = projectImages.sort((a, b) => a.order - b.order);
    
    const mainImage = project.image_url || 
                     (sortedImages.length > 0 ? sortedImages[0].url : null);

    const totalImages = sortedImages.length;

    const thumbnailImages = sortedImages.filter((image, index) => {
        if (index === 0 && mainImage === image.url) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {project.name}
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        {mainImage ? (
                            <div className="relative group">
                                <img 
                                    src={mainImage}
                                    alt={project.name}
                                    className="w-full h-auto max-h-96 object-contain rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 bg-white"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                        Imagen Principal
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-80 bg-slate-200 rounded-2xl flex items-center justify-center">
                                <div className="text-center text-slate-500">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">No hay imagen disponible</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Descripción del Proyecto
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {project.description}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Información del Proyecto
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-slate-600 font-medium">Estado:</span>
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        Completado
                                    </span>
                                </div>
                                {project.created_at && (
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-600 font-medium">Creado:</span>
                                        <span className="text-slate-500 text-sm">
                                            {new Date(project.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {sortedImages.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center gap-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Galería Completa ({totalImages} imágenes)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedImages.map((image, index) => (
                                <div 
                                    key={image.id}
                                    className="group relative bg-slate-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                                >
                                    <img 
                                        src={image.url}
                                        alt={`${project.name} - Imagen ${index + 1}`}
                                        className="w-full h-64 object-contain bg-white group-hover:scale-105 transition-transform duration-500 p-2"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-sm font-medium">Imagen {index + 1}</p>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                                        #{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {session?.user.role === 'admin' && (
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
    );
};

export default ProjectElement;