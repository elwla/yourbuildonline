// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { JWT } from "next-auth/jwt"

interface NextRequestWithAuth extends NextRequest {
  nextauth: {
    token: JWT | null
  }
}

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    console.log('🔐 Middleware ejecutándose para:', request.nextUrl.pathname)
    
    const response = NextResponse.next()
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const protectedRoutes = ['/new', '/project', '/profile', '/building']
        const isProtected = protectedRoutes.some(route => 
          req.nextUrl.pathname.startsWith(route)
        )
        
        if (isProtected) {
          return !!token
        }
        
        return true
      },
    },
  }
)

declare module "next-auth" {
  interface NextAuthMiddlewareOptions {
    authorized?: (params: { token: JWT | null; req: NextRequest }) => boolean
  }
}

declare module "next" {
  interface NextRequestWithAuth extends NextRequest {
    nextauth: {
      token: JWT | null
    }
  }
}

export const config = {
  matcher: [
    '/new/:path*',
    '/project/:path*',
    '/profile/:path*',
    '/building/:path*'
  ]
}