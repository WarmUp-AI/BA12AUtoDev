import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/cars/:path((?!featured).*)', // Protect all /api/cars/* except /api/cars/featured
    '/api/upload/:path*',
    '/api/analytics/stats/:path*'
  ],
};
