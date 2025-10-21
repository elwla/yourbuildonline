import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                userName: true,
                created_at: true
            },
            orderBy: {
                firstName: 'asc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        return NextResponse.json(
            { 
                message: "Error fetching users", 
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}