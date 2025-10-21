// app/api/projects/route.ts
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import cloudinary from "@/libs/cloudinary";
import { generateEncryptedUrl } from '@/libs/encryption';

export async function GET() {
    try {        
        const projects = await prisma.project.findMany({
            where: {
                status: "completado"
            },
            include: {
                project_images: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        url: true,
                        order: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json(
            { 
                message: "Error fetching projects", 
                error: errorMessage 
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        
        const name = data.get('name') as string;
        const description = data.get('description') as string;
        const images = data.getAll('images') as File[];
        const assignedUserId = data.get('assignedUserId') as string || null
        const status = data.get('status') as string

        if (!name?.trim() || !description?.trim()) {
            return NextResponse.json(
                { message: "Nombre y descripción son requeridos" }, 
                { status: 400 }
            );
        }

        if (images.length === 0) {
            return NextResponse.json(
                { message: "Al menos una imagen es requerida" }, 
                { status: 400 }
            );
        }

        const uploadedImages: { url: string; order: number }[] = [];

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            console.log(`Processing image ${i + 1}:`, image.name, image.size, image.type);
            
            try {
                // Validaciones
                const MAX_SIZE = 10 * 1024 * 1024;
                if (image.size > MAX_SIZE) {
                    return NextResponse.json(
                        { message: `La imagen ${image.name} es demasiado grande. Máximo 10MB.` },
                        { status: 400 }
                    );
                }

                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(image.type)) {
                    return NextResponse.json(
                        { message: `El formato ${image.type} no está permitido. Use JPEG, PNG o WebP.` },
                        { status: 400 }
                    );
                }

                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

                const cloudinaryResult = await cloudinary.uploader.upload(base64Image, {
                    folder: 'projects',
                    resource_type: 'image',
                    quality: 'auto:good'
                });

                console.log('cloudinaryResult', cloudinaryResult)

                uploadedImages.push({
                    url: cloudinaryResult.secure_url,
                    order: i
                });                
            } catch (error) {
                console.error('Error subiendo imagen:', error);
                
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido al subir imagen';
                return NextResponse.json(
                    { message: `Error subiendo imagen ${image.name}: ${errorMessage}` },
                    { status: 500 }
                );
            }
        }

        const result = await prisma.$transaction(async (tx: any) => {
            const newProject = await tx.project.create({
                data: {
                    name: name.trim(),
                    description: description.trim(),
                    image_url: uploadedImages[0]?.url || null,
                    assignedUserId: assignedUserId,
                    status: status,
                }
            });

            const encryptedUrl = generateEncryptedUrl(newProject.id);

            await tx.project.update({
                where: { id: newProject.id },
                data: { encryptedUrl }
            });

            const projectImages = [];
            for (const img of uploadedImages) {
                const projectImage = await tx.projectImages.create({
                    data: {
                        url: img.url,
                        order: img.order,
                        project_id: newProject.id
                    }
                });
                projectImages.push(projectImage);
            }

            const projectWithImages = await tx.project.findUnique({
                where: { id: newProject.id },
                include: {
                    project_images: {
                        orderBy: { order: 'asc' }
                    }
                }
            });

            return projectWithImages;
        });

        return NextResponse.json({
            message: "Proyecto creado exitosamente",
            project: result
        }, { status: 201 });

    } catch (error) {
        let errorMessage = 'Unknown error';
        let errorStack: string | undefined;
        
        if (error instanceof Error) {
            errorMessage = error.message;
            errorStack = process.env.NODE_ENV === 'development' ? error.stack : undefined;
        }
        
        return NextResponse.json(
            { 
                message: "Error creando proyecto", 
                error: errorMessage,
                stack: errorStack
            },
            { status: 500 }
        );
    }
}