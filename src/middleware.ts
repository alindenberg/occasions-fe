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
                console.log('Token expired');
                currentUser = true
            }

        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    console.log('currentUser', currentUser)
    console.log('request.nextUrl.pathname', request.nextUrl.pathname === '/profile')
    console.log('request.nextUrl.pathname in ["/profile"]', request.nextUrl.pathname in ['/profile'])
    if (!currentUser && ['/profile', '/occasions'].includes(request.nextUrl.pathname)) {
        console.log('Redirecting to login');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return Response.redirect(loginUrl.toString());
    }
}

export const config = {
    matcher: ['/profile', '/occasions'],
}