'use client';

import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Download, Search, ShieldCheck, UserRound, Users } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useToast } from '@/components/toast-provider';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: string | null;
  emailVerified: boolean;
  banned: boolean;
};

const roleStyles: Record<string, string> = {
  admin: 'bg-violet-500/10 text-violet-300 ring-violet-400/20',
  recruiter: 'bg-indigo-500/10 text-indigo-300 ring-indigo-400/20',
  seeker: 'bg-white/[0.06] text-zinc-300 ring-white/10',
};

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(
        date,
      );
}

function escapeCsv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [workingUser, setWorkingUser] = useState('');
  const [pendingRemoval, setPendingRemoval] = useState<User | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/users')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Could not load users.');
        if (active) {
          setUsers(data.users ?? []);
          setNow(Date.now());
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          const message = reason instanceof Error ? reason.message : 'Could not load users.';
          setError(message);
          toast(message, 'error');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [toast]);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesRole = role === 'all' || user.role === role;
        const matchesQuery = user.email.toLowerCase().includes(query.trim().toLowerCase());
        return matchesRole && matchesQuery;
      }),
    [users, query, role],
  );

  const metrics = useMemo(() => {
    const sinceYesterday = now - 24 * 60 * 60 * 1000;
    return [
      {
        label: 'Total users',
        value: users.length,
        detail: 'Registered accounts',
        Icon: Users,
        color: 'text-sky-400',
      },
      {
        label: 'Recruiters',
        value: users.filter((user) => user.role === 'recruiter').length,
        detail: 'Recruiter accounts',
        Icon: BriefcaseBusiness,
        color: 'text-violet-400',
      },
      {
        label: 'Suspended accounts',
        value: users.filter((user) => user.banned).length,
        detail: 'Access restricted',
        Icon: ShieldCheck,
        color: 'text-rose-400',
      },
      {
        label: 'New signups (24h)',
        value: users.filter(
          (user) => user.createdAt && new Date(user.createdAt).getTime() >= sinceYesterday,
        ).length,
        detail: 'In the last 24 hours',
        Icon: UserRound,
        color: 'text-amber-400',
      },
    ];
  }, [users, now]);

  function exportUsers() {
    const rows = [
      ['Name', 'Email', 'Role', 'Email status', 'Join date'],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role,
        user.emailVerified ? 'Verified' : 'Unverified',
        formatDate(user.createdAt),
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hireloop-users.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${filteredUsers.length} users.`, 'success');
  }

  async function runAction(
    user: User,
    action: 'make-admin' | 'make-recruiter' | 'make-seeker' | 'suspend' | 'activate' | 'remove',
  ) {
    setActionError('');
    setWorkingUser(user.id);
    try {
      const removing = action === 'remove';
      const response = await fetch('/api/admin/users', {
        method: removing ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(removing ? { userId: user.id } : { userId: user.id, action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not update this user.');
      if (removing) {
        setUsers((current) => current.filter((item) => item.id !== user.id));
        setPendingRemoval(null);
        toast(`${user.name} was removed.`, 'success');
      } else {
        setUsers((current) =>
          current.map((item) => item.id !== user.id ? item : {
            ...item,
            role: result.role ?? item.role,
            banned: typeof result.banned === 'boolean' ? result.banned : item.banned,
          }),
        );
        const successMessage = action === 'make-admin'
          ? `${user.name} is now an admin.`
          : action === 'make-recruiter'
            ? `${user.name} is now a recruiter.`
            : action === 'make-seeker'
              ? `${user.name} is now a seeker.`
              : action === 'suspend'
                ? `${user.name} was suspended.`
                : `${user.name} was activated.`;
        toast(successMessage, 'success');
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Could not update this user.';
      setActionError(message);
      toast(message, 'error');
    } finally {
      setWorkingUser('');
    }
  }

  return (
    <main className="min-h-[calc(100svh-3rem)] bg-[#0d0d0f] px-5 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span>Admin</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">Manage Users</span>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">User Management</h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Review and filter platform accounts across HireLoop.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative min-w-0 flex-1 sm:w-56 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input
                aria-label="Search by email"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by email…"
                className="h-10 w-full rounded-md border border-white/[0.09] bg-[#111113] pl-9 pr-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-violet-400/50"
              />
            </label>
            <button
              onClick={exportUsers}
              disabled={loading || filteredUsers.length === 0}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-zinc-100 px-3 text-xs font-medium text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="size-3.5" />{' '}
              <span className="hidden sm:inline">Export list</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {metrics.map(({ label, value, detail, Icon, color }) => (
            <article
              key={label}
              className="min-h-[112px] rounded-lg border border-white/[0.07] bg-[#141416] px-4 py-4 sm:px-5"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                <span>{label}</span>
                <Icon className={`size-4 ${color}`} />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
                {loading ? '—' : value.toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] text-zinc-600">{detail}</p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#111113]">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-sm font-medium text-zinc-200">All users</h2>
              <p className="mt-0.5 text-[11px] text-zinc-600">
                {loading ? 'Loading accounts…' : `${filteredUsers.length} accounts`}
              </p>
            </div>
            <select
              aria-label="Filter by role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-9 min-w-32 rounded-md border border-white/[0.09] bg-[#171719] px-3 text-xs text-zinc-300 outline-none focus:border-violet-400/50"
            >
              <option value="all">All roles</option>
              <option value="seeker">Seekers</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {actionError && (
            <p
              role="alert"
              className="border-b border-rose-500/20 bg-rose-500/[0.06] px-5 py-2.5 text-xs text-rose-300"
            >
              {actionError}
            </p>
          )}

          {error ? (
            <div className="px-5 py-14 text-center text-sm text-rose-300">{error}</div>
          ) : loading ? (
            <div className="px-5 py-14 text-center text-sm text-zinc-500">Loading users…</div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-5 py-14 text-center text-sm text-zinc-500">
              {users.length === 0 ? 'No users found.' : 'No users match these filters.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-white/[0.025] text-[10px] uppercase tracking-[0.08em] text-zinc-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">User name</th>
                    <th className="px-5 py-3 font-medium">Email address</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Join date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.055]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-white/[0.025]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.image}
                              alt=""
                              className="size-8 rounded-full bg-white/5 object-cover"
                            />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-violet-500/30 text-[11px] font-medium text-zinc-200">
                              {user.name.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <span className="max-w-40 truncate text-xs font-medium text-zinc-200">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-500">{user.email || '—'}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] capitalize ring-1 ring-inset ${roleStyles[user.role] ?? roleStyles.seeker}`}
                        >
                          {user.role === 'recruiter' ? (
                            <BriefcaseBusiness className="size-3" />
                          ) : user.role === 'admin' ? (
                            <ShieldCheck className="size-3" />
                          ) : (
                            <UserRound className="size-3" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] ring-1 ring-inset ${user.banned ? 'bg-rose-500/10 text-rose-300 ring-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20'}`}
                        >
                          <span
                            className={`size-1 rounded-full ${user.banned ? 'bg-rose-400' : 'bg-emerald-400'}`}
                          />
                          {user.banned ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3 whitespace-nowrap text-[10px]">
                          {user.id !== session?.user?.id && user.role !== 'admin' && (
                            <button
                              onClick={() =>
                                runAction(
                                  user,
                                  user.role === 'recruiter' ? 'make-seeker' : 'make-recruiter',
                                )
                              }
                              disabled={workingUser === user.id}
                              className="text-zinc-400 transition hover:text-white disabled:opacity-50"
                            >
                              {user.role === 'recruiter' ? 'Make seeker' : 'Make recruiter'}
                            </button>
                          )}
                          {user.id !== session?.user?.id && (
                            <button
                              onClick={() =>
                                runAction(
                                  user,
                                  user.role === 'admin' ? 'make-seeker' : 'make-admin',
                                )
                              }
                              disabled={workingUser === user.id}
                              className="text-violet-300 transition hover:text-violet-200 disabled:opacity-50"
                            >
                              {user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                            </button>
                          )}
                          {user.role !== 'admin' && user.id !== session?.user?.id && (
                            <button
                              onClick={() => runAction(user, user.banned ? 'activate' : 'suspend')}
                              disabled={workingUser === user.id}
                              className={`transition disabled:opacity-50 ${user.banned ? 'text-emerald-400 hover:text-emerald-300' : 'text-rose-400 hover:text-rose-300'}`}
                            >
                              {workingUser === user.id
                                ? 'Saving…'
                                : user.banned
                                  ? 'Activate'
                                  : 'Suspend'}
                            </button>
                          )}
                          {user.role !== 'admin' && user.id !== session?.user?.id && (
                            <button
                              onClick={() => {
                                setActionError('');
                                setPendingRemoval(user);
                              }}
                              disabled={workingUser === user.id}
                              className="text-rose-400 transition hover:text-rose-300 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      {pendingRemoval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-user-title"
            aria-describedby="remove-user-description"
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#171719] p-5 shadow-2xl"
          >
            <h2 id="remove-user-title" className="text-base font-semibold text-white">Remove user?</h2>
            <p id="remove-user-description" className="mt-2 text-sm leading-6 text-zinc-400">
              This permanently removes <span className="font-medium text-zinc-200">{pendingRemoval.name}</span> and their sign-in accounts. Their application history will remain.
            </p>
            {actionError && <p role="alert" className="mt-3 text-xs text-rose-300">{actionError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setPendingRemoval(null)}
                disabled={workingUser === pendingRemoval.id}
                className="rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => runAction(pendingRemoval, 'remove')}
                disabled={workingUser === pendingRemoval.id}
                className="rounded-md bg-rose-500 px-3 py-2 text-xs font-medium text-white hover:bg-rose-400 disabled:opacity-50"
              >
                {workingUser === pendingRemoval.id ? 'Removing…' : 'Remove user'}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
