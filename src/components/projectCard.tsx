'use client';

import { JSX } from "react";
import Link from "next/link";

interface Project {
    id: number;
    name: string;
    description: string;
    image_url?: string;
}

interface ProjectCardProps {
    project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps): JSX.Element => {
    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden">
            <div className="relative h-56 bg-slate-100 overflow-hidden">
                {project.image_url ? (
                    <img 
                        src={project.image_url}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <div className="text-slate-500 text-center">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">Sin imagen</span>
                        </div>
                    </div>
                )}
                
                <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    Completado
                </div>
            </div>

            <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3">
                    {project.name}
                </h2>
                
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                    {project.description}
                </p>

                <Link 
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center w-full bg-slate-100 text-slate-700 hover:bg-emerald-500 hover:text-white font-semibold text-sm py-3 px-4 rounded-lg transition-all duration-200"
                >
                    Ver Proyecto
                </Link>
            </div>
        </div>
    );
};

export default ProjectCard;