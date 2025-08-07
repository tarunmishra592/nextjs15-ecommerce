import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Protected paths that require authentication
  const protectedPaths = [
    '/cart',
    '/wishlist',
    '/checkout',
    '/orders',
    '/profile',
    '/order-confirmation',
  ];

  // Auth pages that should be inaccessible when logged in
  const authPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  const token = req.cookies.get('token')?.value;

  console.log('All cookies:', req.cookies.getAll());
  console.log('Cookie header:', req.headers.get('authorization'));

  console.log('token', token)

  // Handle protected paths

  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  // Handle auth paths when already logged in
  if (isAuthPath && token) {
    const redirectTo = req.nextUrl.searchParams.get('next') || '/';
    const response = NextResponse.redirect(new URL(redirectTo, req.url));
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

export const config = {
  matcher: [
    // Protected paths
    '/cart/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/order-confirmation/:path*',
    
    // Auth paths
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password'
  ],
};