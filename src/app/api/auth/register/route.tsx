import { NextResponse } from 'next/server';
import prisma from "@/libs/prisma";
import bcrypt from 'bcryptjs';

interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    userName: string;
}

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName, userName }: RegisterRequest = await request.json();

        if (!email || !password || !firstName || !lastName || !userName) {
            return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 });
        }

        const emailFound = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase().trim() },
                    { userName: userName.trim() }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase().trim()) {
                return NextResponse.json(
                    { message: "El email ya está registrado" },
                    { status: 400 }
                );
            }
            if (existingUser.userName === userName.trim()) {
                return NextResponse.json(
                    { message: "El nombre de usuario ya existe" },
                    { status: 400 }
                );
            }
        }


        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    userName
                },
                select: {
                    id: true
                }
            });

            return NextResponse.json({
                message: "User registered successfully!", 
                userId: result,
            }, { status: 201 });

        } catch (dbError: any) {
            console.error('Error en base de datos:', dbError);
            return NextResponse.json({ 
                message: "Error saving to database", 
                error: dbError.message 
            }, { status: 500 });
        }
    } catch (error: any) {        
        console.error('Error general:', error);
        return NextResponse.json({ 
            message: "Error registering user", 
            error: error.message 
        }, { status: 500 });
    }
}