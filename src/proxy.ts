import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ACCESS_TOKEN_KEY = "emerald-logistics.access-token";

// Define paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/orders/create',
  '/checkout'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    const hasToken = request.cookies.has(ACCESS_TOKEN_KEY);
    
    // Redirect to login if user is not authenticated
    if (!hasToken) {
      const loginUrl = new URL('/auth/login', request.url);
      
      // Optional: Add redirect_to param to return user after login
      // loginUrl.searchParams.set('redirect_to', pathname);
      
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  // Apply proxy to specific routes, ignoring static files and API
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
