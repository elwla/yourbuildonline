// app/api/auth/login/route.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function POST(request: Request): Promise<NextResponse> {
  
  try {
    if (!prisma) {
      return NextResponse.json({ 
        message: 'Database configuration error' 
      }, { status: 500 });
    }

    if (!prisma.user || typeof prisma.user.findUnique !== 'function') {
      return NextResponse.json({ 
        message: 'Database configuration error' 
      }, { status: 500 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        message: 'Email and password are required' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      'your_secret_key', 
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({ 
      message: 'Login successful', 
      token 
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
    });

    return response;

  } catch (error: any) {
    return NextResponse.json({ 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}