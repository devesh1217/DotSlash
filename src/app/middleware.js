import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't need authentication
  const isPublicPath = path === '/login' || path === '/register' || path === '/'

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || ''

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on public path but has token, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicPath && !token) {
    // If user is on protected path without token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configure which routes should be handled by middleware
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/profile/:path*',
  ]
}
