import { type NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Fetch the cookies from the request containing our JWT.
  const authCookie = request.cookies.get('token')?.value;

  // If the cookie is not present, redirect to '/auth/login'.
  if (!authCookie || authCookie.length === 0) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If I have a cookie, but I navigate to /auth (after login from /app). Redirect back to /app. [Other case]
  // There might be a better solution to do this with matcher. However, It works. : )
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  // --todo- Validate the JWT token. If it is not valid, redirect to '/auth/login'.

  // Yay! Cookie Present. We can proceed to /app route and extract the token to fetch information.
  return NextResponse.next();
}

// This will make sure our middleware only runs on /app/* route. (everything under /app including /app)
export const config = {
  matcher: ['/app/:path*', '/auth'],
};
