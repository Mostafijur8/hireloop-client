import 'server-only';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

/** Returns the current request's Better Auth session on the server. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Redirects users who do not have the requested role. */
export async function requireRole(role: string) {
  const session = await getSession();

  if (!session?.user || session.user.role !== role) {
    redirect('/unauthorize');
  }

  return session;
}
