import { NextRequest, NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    // Fetch the cookies from the request containing our JWT.
    const authCookie = request.cookies.get('token');

    // If the cookie is not present, redirect to '/auth/login'.
    if (!authCookie || authCookie.value.length === 0) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Yay! Cookie Present. We can proceed to /app route and extract the token to fetch information.
    return NextResponse.next();

}

// This will make sure our middleware only runs on /app/* route. (everything under /app including /app)
export const config = {
    matcher: '/app/:path*',
}
