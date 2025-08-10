// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Route Configuration
const PROTECTED_ROUTES = [
  '/cart',
  '/checkout',
  '/orders',
  '/order-confirmation', // Base path
  '/order-confirmation(.*)', //
  '/wishlist',
  '/profile',
  '/password',
  '/account',
];

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/products',
  '/products/(.*)', // Dynamic product details
  '/search',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 2. Public Route Check
  const isPublicRoute = PUBLIC_ROUTES.some(publicRoute => {
    const regexPattern = publicRoute
      .replace(/\//g, '\\/')
      .replace(/\(\.\*\)/g, '.*');
    return new RegExp(`^${regexPattern}$`).test(pathname);
  });

  // 3. Skip Middleware for Public Routes
  if (isPublicRoute || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/static') ||
      pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // 4. Authentication Check
  const hasToken = request.cookies.has('token');

  // 5. Handle Protected Routes
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!hasToken) {
      return createUnauthorizedResponse(request);
    }
  }

  return NextResponse.next();
}

// 6. Unauthorized Response Handler
function createUnauthorizedResponse(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  loginUrl.searchParams.set('error', 'unauthorized');
  
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('token');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};