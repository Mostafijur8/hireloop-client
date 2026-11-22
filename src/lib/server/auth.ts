import 'server-only';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

/** Returns the current request's Better Auth session on the server. */
export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return session;

  // Older accounts may have the selected signup role even if their initial
  // user record kept Better Auth's default role.
  const role =
    session.user.role === 'admin' || session.user.role === 'recruiter'
      ? session.user.role
      : session.user.signupRole === 'recruiter'
        ? 'recruiter'
        : 'seeker';
  return { ...session, user: { ...session.user, role } };
}

/** Redirects users who do not have the requested role. */
export async function requireRole(role: string) {
  const session = await getSession();

  if (!session?.user || session.user.role !== role) {
    redirect('/unauthorize');
  }

  return session;
}

export const getToken = async () => {
  const session = await getSession();
  if (!session || !session.session?.token) {
    redirect('/unauthorize');
  }
  return session.session.token;
};

export const authFetch = async (api: string) => {
  const token = await getToken();
  const res = await fetch(api, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
