import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Todo: create session in cookies once logged in,
    // use that to check if user is logged in within here
    const authCookie = request.cookies.get('Authorization')
    let currentUser = false
    if (authCookie?.value) {
        const token = authCookie.value.replace('Bearer ', '');
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const { sub, exp } = JSON.parse(jsonPayload);
            if (exp > Date.now() / 1000) {
                // todo: fetch user data from the session
                currentUser = true
            }

        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    if (!currentUser && ['/profile', '/occasions', '/occasions/new', '/credits'].includes(request.nextUrl.pathname)) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl.toString());
    }
}

export const config = {
    matcher: ['/occasions/:path*', '/profile'],
}