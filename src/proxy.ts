import { auth } from '@/lib/auth';
import { NextResponse, type NextRequest } from 'next/server';

/** Protect dashboard navigation with the active Better Auth session. */
export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set(
      'callbackUrl',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
