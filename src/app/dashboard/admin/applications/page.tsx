'use client';

import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, Clock3, FileText, Search } from 'lucide-react';

type ApplicationStatus = 'Applied' | 'Review' | 'Shortlisted' | 'Rejected' | 'Offered';
type Application = {
  id: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedAt: string | null;
};

const statuses: ApplicationStatus[] = ['Applied', 'Review', 'Shortlisted', 'Rejected', 'Offered'];
const statusStyle: Record<ApplicationStatus, string> = {
  Applied: 'bg-zinc-500/10 text-zinc-300 ring-zinc-400/20',
  Review: 'bg-amber-500/10 text-amber-300 ring-amber-400/20',
  Shortlisted: 'bg-sky-500/10 text-sky-300 ring-sky-400/20',
  Rejected: 'bg-rose-500/10 text-rose-300 ring-rose-400/20',
  Offered: 'bg-emerald-500/10 text-emerald-300 ring-emerald-400/20',
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

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/applications')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Could not load applications.');
        if (active) setApplications(data.applications ?? []);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(reason instanceof Error ? reason.message : 'Could not load applications.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      applications.filter((application) => {
        const text =
          `${application.applicantName} ${application.applicantEmail} ${application.jobTitle} ${application.company}`.toLowerCase();
        return (
          text.includes(query.trim().toLowerCase()) &&
          (statusFilter === 'all' || application.status === statusFilter)
        );
      }),
    [applications, query, statusFilter],
  );

  async function updateStatus(application: Application, status: ApplicationStatus) {
    setActionError('');
    setSavingId(application.id);
    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: application.id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not update application status.');
      setApplications((current) =>
        current.map((item) => (item.id === application.id ? { ...item, status } : item)),
      );
    } catch (reason) {
      setActionError(
        reason instanceof Error ? reason.message : 'Could not update application status.',
      );
    } finally {
      setSavingId('');
    }
  }

  const metrics = [
    {
      label: 'All applications',
      value: applications.length,
      Icon: FileText,
      color: 'text-sky-400',
    },
    {
      label: 'In review',
      value: applications.filter((app) => app.status === 'Review').length,
      Icon: Clock3,
      color: 'text-amber-400',
    },
    {
      label: 'Shortlisted',
      value: applications.filter((app) => app.status === 'Shortlisted').length,
      Icon: CheckCircle2,
      color: 'text-violet-400',
    },
    {
      label: 'Offers',
      value: applications.filter((app) => app.status === 'Offered').length,
      Icon: BriefcaseBusiness,
      color: 'text-emerald-400',
    },
  ];

  return (
    <main className="min-h-[calc(100svh-3rem)] bg-[#0d0d0f] px-5 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
          <span>Admin</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">Applications</span>
        </div>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Application Management
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Review applications and update candidate progress.
          </p>
        </header>

        <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {metrics.map(({ label, value, Icon, color }) => (
            <article
              key={label}
              className="min-h-[105px] rounded-lg border border-white/[0.07] bg-[#141416] px-4 py-4 sm:px-5"
            >
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{label}</span>
                <Icon className={`size-4 ${color}`} />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
                {loading ? '—' : value.toLocaleString()}
              </p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#111113]">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-sm font-medium text-zinc-200">All applications</h2>
              <p className="mt-0.5 text-[11px] text-zinc-600">
                {loading ? 'Loading applications…' : `${filtered.length} applications`}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input
                  aria-label="Search applications"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search name, email or job"
                  className="h-9 w-full rounded-md border border-white/[0.09] bg-[#171719] pl-9 pr-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-violet-400/50"
                />
              </label>
              <select
                aria-label="Filter applications by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-9 rounded-md border border-white/[0.09] bg-[#171719] px-3 text-xs text-zinc-300 outline-none focus:border-violet-400/50"
              >
                <option value="all">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
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
            <div className="px-5 py-14 text-center text-sm text-zinc-500">
              Loading applications…
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-14 text-center text-sm text-zinc-500">
              No applications match these filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-white/[0.025] text-[10px] uppercase tracking-[0.08em] text-zinc-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Applicant</th>
                    <th className="px-5 py-3 font-medium">Job</th>
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="px-5 py-3 font-medium">Applied</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Update status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.055]">
                  {filtered.map((application) => (
                    <tr key={application.id} className="transition hover:bg-white/[0.025]">
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-medium text-zinc-200">
                          {application.applicantName}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-600">
                          {application.applicantEmail}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-300">{application.jobTitle}</td>
                      <td className="px-5 py-3.5 text-xs text-zinc-500">{application.company}</td>
                      <td className="px-5 py-3.5 text-xs text-zinc-500">
                        {formatDate(application.appliedAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-[10px] ring-1 ring-inset ${statusStyle[application.status]}`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <label>
                          <span className="sr-only">
                            Update status for {application.applicantName}
                          </span>
                          <select
                            value={application.status}
                            disabled={savingId === application.id}
                            onChange={(event) =>
                              updateStatus(application, event.target.value as ApplicationStatus)
                            }
                            className="rounded-md border border-white/[0.09] bg-[#171719] px-2.5 py-2 text-[11px] text-zinc-300 outline-none focus:border-violet-400/50 disabled:opacity-50"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
