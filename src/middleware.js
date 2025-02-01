import { NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function middleware(request) {
    const publicAdminPaths = ['/admin/login', '/admin/register'];
    const isPublicAdminPath = publicAdminPaths.includes(request.nextUrl.pathname);

    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.headers.get('adminToken')?.split(' ')[1];
        
        if (isPublicAdminPath && token) {
            try {
                const userId = await verifyAuthToken(token);
                if (userId) {
                    return NextResponse.redirect(new URL('/admin/applications', request.url));
                }
            } catch {
                // Invalid token, continue to login page
            }
        }

        // if (!isPublicAdminPath && !token) {
        //     return NextResponse.redirect(new URL('/admin/login', request.url));
        // }

        // if (!isPublicAdminPath) {
        //     try {
        //         const userId = await verifyAuthToken(token);
        //         if (!userId) {
        //             return NextResponse.redirect(new URL('/admin/login', request.url));
        //         }
        //     } catch {
        //         return NextResponse.redirect(new URL('/admin/login', request.url));
        //     }
        // }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*'
};
