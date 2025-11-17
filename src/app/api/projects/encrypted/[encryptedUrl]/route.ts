import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { decryptUrl } from '@/libs/encryption';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ encryptedUrl: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const resolvedParams = await params;
        const encryptedUrl = resolvedParams.encryptedUrl;

        const projectId = decryptUrl(encryptedUrl);
        
        if (!projectId) {
            return NextResponse.json({ message: "URL inválida" }, { status: 404 });
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

        if (!project) {
            return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
        }

        const isAdmin = session.user?.role === 'admin';
        const isAssignedUser = project.assignedUserId === (session.user as {id?: string}).id;

        if (!isAdmin && !isAssignedUser) {
            return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error fetching encrypted project:', error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}