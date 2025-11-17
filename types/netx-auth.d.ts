// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extiende el tipo User por defecto
   */
  interface User {
    id: string;
    role: string;
  }

  /**
   * Extiende el tipo Session
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende el tipo JWT
   */
  interface JWT {
    id: string;
    role: string;
  }
}