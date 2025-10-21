import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import cloudinary from "@/libs/cloudinary";


export async function GET(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        const resolvedParams = await params;
        const projectId = parseInt(resolvedParams.projectId);
        
        if (isNaN(projectId)) {
            return NextResponse.json(
                { message: "ID de proyecto inválido" }, 
                { status: 400 }
            );
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                project_images: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        url: true,
                        order: true,
                        created_at: true
                    }
                }
            }
        });

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(project); 
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching project", error: error instanceof Error ? error.message : 'Unknown error' }, 
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
    try {
        const data = await request.formData();
        const name = data.get('name') as string;
        const description = data.get('description') as string;
        const image = data.get('image') as File;

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        if (!description) {
            return NextResponse.json({ message: "Description is required" }, { status: 400 });
        }

        if (!image) {
            return NextResponse.json({ message: "Image is required" }, { status: 400 });
        }

        const MAX_SIZE = 10 * 1024 * 1024;
        if (image.size > MAX_SIZE) {
            return NextResponse.json({ 
                message: `Image is too large. Maximum size is 10MB.` 
            }, { status: 400 });
        }

        let cloudinaryResult = null;

        try {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

            cloudinaryResult = await cloudinary.uploader.upload(base64Image, {
                folder: 'projects',
                resource_type: 'image',
                quality: 'auto:good'
            });

        } catch (cloudinaryError: any) {
            return NextResponse.json({ 
                message: "Error uploading image", 
                error: cloudinaryError.message 
            }, { status: 500 });
        }

        const resolvedParams = await params;
        const projectId = parseInt(resolvedParams.projectId);
        const updatedProject = await prisma.project.update({
            where: { id: projectId},
            data: {
                name,
                description,
                image_url: cloudinaryResult.secure_url
            }
        })

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating project", error }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ projectId: string }> }  ) {
    try {
        const resolvedParams = await params;
        const projectId = parseInt(resolvedParams.projectId);

        const existingProject = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!existingProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        await prisma.project.delete({
            where: { id: projectId }
        })
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting project", error }, { status: 500 });
    }
}