// app/api/auth/[...nextauth]/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: process.env.APPLE_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const email = credentials.email.trim().toLowerCase().substring(0, 254);
                    const password = credentials.password.substring(0, 128);

                    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                        return null;
                    }

                    if (password.length < 8 || password.length > 128) {
                        return null;
                    }

                    const startTime = Date.now();

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });

                    const minProcessingTime = 500;
                    const elapsed = Date.now() - startTime;
                    if (elapsed < minProcessingTime) {
                        await new Promise(resolve => 
                            setTimeout(resolve, minProcessingTime - elapsed)
                        );
                    }


                    if (!user) {
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user.id.toString(),
                        name: `${user.firstName} ${user.lastName}`.trim(),
                        email: user.email,
                        role: user.role
                    };

                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || '';
            }

            if (account && account.provider !== 'credentials') {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: token.email! }
                    });
                    
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.role = dbUser.role;
                    }
                } catch (error) {
                    console.error('Error handling OAuth user:', error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
};