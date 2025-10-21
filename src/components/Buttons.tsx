"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ButtonsProps {
    projectId: string | number;
}

const Buttons = ({projectId}: ButtonsProps) => {

    const router = useRouter();

    const handleDelete = async () => {
        if(confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
            const res = await axios.delete(`/api/projects/${projectId}`);
            alert('Proyecto eliminado exitosamente.');
            if (res.status === 204) {
                router.push('/projects');
            }
        }
    }

    const handleEdit = () => {
        router.push(`/projects/edit/${projectId}`);
    }

    return (
        <div>
            <button 
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEdit}>
                Editar
            </button>
            <button 
                className="mt-4 ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleDelete}>
                Eliminar
            </button>
        </div>
    );
};

export default Buttons;