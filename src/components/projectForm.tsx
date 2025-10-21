"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

interface ProjectImage {
    id: number;
    url: string;
    order: number;
}

interface Project {
    name: string;
    description: string;
    images: File[];
    existingImages: ProjectImage[];
    assignedUserId?: string;
    status: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
}

const ProjectForm = () => {
    const [project, setProject] = useState<Project>({
        name: "",
        description: "",
        images: [],
        existingImages: [],
        assignedUserId: "",
        status: "construyendo"
    });

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);

    const form = React.useRef<HTMLFormElement>(null);
    const router = useRouter();
    const params = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const statusOptions = [
        { value: "construyendo", label: "🛠️ En Construcción" },
        { value: "completado", label: "✅ Completado" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        setProject({
            ...project,
            [target.name]: target.value
        });
    }

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setUsersLoading(true);
                const response = await axios.get('/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error loading users:', error);
            } finally {
                setUsersLoading(false);
            }
        };

        loadUsers();
    }, []);

    useEffect(() => {
        if (params && params.id) {
            axios.get(`/api/projects/${params.id}`)
            .then(res => {
                setProject({
                    name: res.data.name,
                    description: res.data.description,
                    // images: [...res.data.project_images],
                    images: [],
                    existingImages: res.data.project_images || [],
                    assignedUserId: res.data.assignedUserId || "",
                    status: res.data.status || "construyendo"
                });
            })
            .catch(error => {
                console.error('Error loading project:', error);
            });
        }
    }, [params]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setProject(prev => ({
                ...prev,
                images: [...prev.images, ...newFiles]
            }));
        }
    };

    const removeImage = (index: number) => {
        setProject(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const removeExistingImage = (index: number) => {
        setProject(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', project.name);
        formData.append('description', project.description);
        formData.append('status', project.status);

        project.existingImages.forEach((image, index) => {
            formData.append('existingImages', image.id.toString());
        });

        if (project.assignedUserId) {
            formData.append('assignedUserId', project.assignedUserId);
        }
        
        project.images.forEach((image, index) => {
            formData.append('images', image);
        });

        try {
            if (!params || !params.id) {
                await axios.post('/api/projects', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setProject({
                    name: "",
                    description: "",
                    images: [],
                    existingImages: [],
                    assignedUserId: "",
                    status: "construyendo" 
                });
                if (form.current) {
                    form.current.reset();
                }
            } else {
                await axios.put(`/api/projects/${params.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            router.refresh();
            router.push('/projects');
        } catch (error) {
            console.error('Error submitting project:', error);
            alert('Error al guardar el proyecto. Por favor, intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {params && params.id ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit} ref={form}>
                <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
                    <label className="block mb-3 text-lg font-semibold text-gray-800" htmlFor="name">
                        Nombre del Proyecto:
                    </label>
                    <input 
                        type="text"
                        id="name"
                        className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        name="name"
                        placeholder="Ingresa el nombre del proyecto"
                        value={project.name}
                        required
                        onChange={handleChange}
                    />
                </div>

                <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
                    <label className="block mb-3 text-lg font-semibold text-gray-800" htmlFor="description">
                        Descripción:
                    </label>
                    <textarea 
                        id="description"
                        rows={4}
                        className="w-full p-4 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                        name="description" 
                        placeholder="Describe tu proyecto..."
                        value={project.description}
                        required 
                        onChange={handleChange}
                    />
                </div>

                <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
                    <label className="block mb-3 text-lg font-semibold text-gray-800" htmlFor="status">
                        Estado del Proyecto:
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={project.status}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        Selecciona el estado actual del proyecto
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
                    <label className="block mb-3 text-lg font-semibold text-gray-800" htmlFor="assignedUserId">
                        Usuario Asignado:
                    </label>
                    {usersLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-gray-600">Cargando usuarios...</span>
                        </div>
                    ) : (
                        <select
                            id="assignedUserId"
                            name="assignedUserId"
                            value={project.assignedUserId || ""}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">Selecciona un usuario (opcional)</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName} - {user.userName}
                                </option>
                            ))}
                        </select>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                        Opcional: Asigna este proyecto a un usuario específico
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
                    <label className="block mb-3 text-lg font-semibold text-gray-800">
                        Imágenes del Proyecto:
                    </label>
                    
                    {params && params.id && project.existingImages.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">
                                Imágenes Existentes ({project.existingImages.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                {project.existingImages.map((image, index) => (
                                    <div key={image.id} className="relative group">
                                        <img 
                                            src={image.url}
                                            alt={`Imagen existente ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg shadow-sm group-hover:opacity-75 transition-opacity duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            ×
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            Existente
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Las imágenes eliminadas se quitarán del proyecto al guardar
                            </p>
                        </div>
                    )}

                    <div className="mb-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            {project.images.length} nueva(s) imagen(es) seleccionada(s)
                        </span>
                        {project.images.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setProject(prev => ({ ...prev, images: [] }))}
                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Limpiar nuevas imágenes
                            </button>
                        )}
                    </div>

                    <div className="relative w-full mb-4">
                        <input
                            type="file"
                            id="images"
                            ref={fileInputRef}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            name="images"
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                        />
                        <div className="flex items-center justify-between w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-400 transition-colors duration-200">
                            <div className="flex-1 min-w-0">
                                <span className="block text-gray-600 text-sm">
                                    {project.images.length === 0 
                                        ? 'Haz clic aquí o arrastra imágenes' 
                                        : `${project.images.length} archivo(s) seleccionado(s)`
                                    }
                                </span>
                                <span className="block text-xs text-gray-500 mt-1">
                                    PNG, JPG, JPEG hasta 10MB cada una
                                </span>
                            </div>
                            <button
                                type="button"
                                className="flex-shrink-0 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap font-medium transition-colors duration-200"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Seleccionar Imágenes
                            </button>
                        </div>
                    </div>

                    {project.images.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-md font-semibold text-gray-800 mb-3">Vista Previa:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {project.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img 
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg shadow-sm group-hover:opacity-75 transition-opacity duration-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            ×
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            {image.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center pt-4">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Guardando...' : (params && params.id ? 'Actualizar Proyecto' : 'Crear Proyecto')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;