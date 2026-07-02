import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Admin-only sections
    const adminOnlyRoutes = ['/users'];
    if (adminOnlyRoutes.some((r) => pathname.startsWith(r)) && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/sales/:path*',
    '/reports/:path*',
    '/inventory/:path*',
    '/users/:path*',
  ],
};
