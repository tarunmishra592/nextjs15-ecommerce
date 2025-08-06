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

  // Handle protected paths
  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle auth paths when already logged in
  if (isAuthPath && token) {
    // const homeUrl = new URL('/', req.url);
    // You might want to redirect to the original intended page
    // if it was stored somewhere (like in a 'next' query param)
    const redirectTo = req.nextUrl.searchParams.get('next') || '/';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
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