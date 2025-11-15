import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ message: "No autorizado" }, { status: 401 });
        }

        const isAdmin = (session.user as { role?: string })?.role === 'admin';

        let projects;
        
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
                    assignedUserId: (session.user as {id?: string})?.id
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

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching building projects:', error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}