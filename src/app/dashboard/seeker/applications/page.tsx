'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Search,
} from 'lucide-react';

type Application = {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  applied: string;
  status: 'Applied' | 'Review' | 'Shortlisted' | 'Rejected' | 'Offered';
  archived?: boolean;
};

const statusStyle: Record<Application['status'], string> = {
  Applied: 'bg-zinc-700/40 text-zinc-300',
  Review: 'bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/30',
  Shortlisted: 'bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/30',
  Rejected: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/30',
  Offered: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30',
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'Active' | 'Archived'>('Active');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Application | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        const response = await fetch('/api/applications');
        const data = (await response.json()) as {
          applications?: Application[];
          error?: string;
        };

        if (!response.ok) throw new Error(data.error ?? 'Could not load applications.');
        if (!cancelled) setApplications(data.applications ?? []);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Could not load applications.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadApplications();
    return () => {
      cancelled = true;
    };
  }, []);
  const filtered = useMemo(
    () =>
      applications.filter(
        (app) =>
          `${app.title} ${app.company}`.toLowerCase().includes(query.toLowerCase()) &&
          (tab === 'Archived' ? app.archived : !app.archived),
      ),
    [applications, query, tab],
  );
  const visible = filtered.slice((page - 1) * 5, page * 5);
  const pageCount = Math.ceil(filtered.length / 5);
  const summary = [
    ['Total Applied', applications.length, 'text-zinc-100'],
    ['Shortlisted', applications.filter((app) => app.status === 'Shortlisted').length, 'text-zinc-100'],
    ['In Review', applications.filter((app) => app.status === 'Review').length, 'text-amber-400'],
    ['Offers', applications.filter((app) => app.status === 'Offered').length, 'text-emerald-400'],
  ] as const;

  return (
    <main className="min-h-[calc(100svh-3rem)] bg-[#0b0b0e] px-5 py-6 text-zinc-100 sm:px-7 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">My Applications</h1>
            <p className="mt-1 text-xs text-zinc-400">
              Track your job applications and interview progress in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <button
              aria-label="Notifications"
              className="rounded-md p-2 hover:bg-white/5 hover:text-white"
            >
              <Bell className="size-4" />
            </button>
            <button
              aria-label="Messages"
              className="rounded-md p-2 hover:bg-white/5 hover:text-white"
            >
              <Mail className="size-4" />
            </button>
            <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-700 to-orange-500 text-xs font-bold text-white">
              S
            </div>
          </div>
        </header>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <label className="flex h-9 w-full max-w-80 items-center gap-2 rounded-md border border-white/[0.09] bg-[#111114] px-3 text-zinc-500 focus-within:border-white/20">
            <Search className="size-4" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search applications..."
              className="w-full bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-500"
            />
          </label>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-white/[0.08] bg-[#151519] p-0.5">
              {(['Active', 'Archived'] as const).map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setTab(name);
                    setPage(1);
                  }}
                  className={`rounded-md px-3 py-1.5 text-[11px] ${tab === name ? 'bg-[#222226] text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                >
                  {name}
                </button>
              ))}
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-[11px] font-medium text-zinc-900 hover:bg-white"
            >
              <Download className="size-3.5" />
              Export PDF
            </button>
          </div>
        </div>
        <section
          aria-label="Application summary"
          className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {summary.map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-lg border border-white/[0.07] bg-[#141417] px-4 py-3"
            >
              <p className="text-[10px] text-zinc-500">{label}</p>
              <p className={`mt-1 text-xl font-semibold leading-none ${color}`}>{value}</p>
            </div>
          ))}
        </section>
        <section className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#141417]">
          <div className="grid grid-cols-[minmax(180px,1.6fr)_minmax(125px,1fr)_minmax(90px,.8fr)_minmax(100px,.8fr)_60px] gap-3 border-b border-white/[0.07] bg-[#19191d] px-4 py-2.5 text-[9px] font-medium text-zinc-500 max-sm:hidden">
            <span>Job Title</span>
            <span>Company</span>
            <span>Applied</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          {loading ? (
            <div className="px-4 py-12 text-center text-xs text-zinc-500">Loading your applications...</div>
          ) : loadError ? (
            <div role="alert" className="px-4 py-12 text-center text-xs text-red-400">{loadError}</div>
          ) : visible.length ? (
            visible.map((app) => {
              const Icon = BriefcaseBusiness;
              return (
                <div
                  key={app.id}
                  className="grid grid-cols-[minmax(180px,1.6fr)_minmax(125px,1fr)_minmax(90px,.8fr)_minmax(100px,.8fr)_60px] items-center gap-3 border-b border-white/[0.06] px-4 py-2.5 text-[10px] last:border-b-0 max-sm:grid-cols-2 max-sm:gap-y-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex size-[22px] shrink-0 items-center justify-center rounded bg-zinc-700/60 text-zinc-200">
                      <Icon className="size-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-zinc-200">{app.title}</p>
                      <p className="text-[9px] text-zinc-500">
                        {app.type} · {app.location}
                      </p>
                    </div>
                  </div>
                  <span className="truncate text-zinc-300 max-sm:hidden">{app.company}</span>
                  <span className="text-zinc-400 max-sm:hidden">{app.applied}</span>
                  <span className="max-sm:hidden">
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] ${statusStyle[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </span>
                  <button
                    onClick={() => setDetail(app)}
                    className="text-right text-zinc-300 hover:text-white"
                  >
                    Details
                  </button>
                  <div className="hidden text-[10px] text-zinc-500 max-sm:block">
                    {app.company} · {app.applied}{' '}
                    <span className={`ml-2 rounded-full px-2 py-1 ${statusStyle[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-12 text-center text-xs text-zinc-500">
              {tab === 'Archived'
                ? 'No archived applications yet.'
                : 'No applications match your search.'}
            </div>
          )}
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3 text-[10px] text-zinc-500">
            <span>
              Showing {filtered.length ? (page - 1) * 5 + 1 : 0}-
              {Math.min(page * 5, filtered.length)} of{' '}
              {filtered.length} applications
            </span>
            <nav className="flex items-center gap-1" aria-label="Pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-md border border-white/[0.07] p-1.5 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`size-6 rounded-md border text-[10px] ${page === num ? 'border-zinc-100 bg-zinc-100 font-semibold text-zinc-900' : 'border-white/[0.07] text-zinc-400 hover:bg-white/5'}`}
                >
                  {num}
                </button>
              ))}
              <button
                disabled={pageCount === 0 || page >= pageCount}
                onClick={() => setPage(page + 1)}
                className="rounded-md border border-white/[0.07] p-1.5 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </nav>
          </footer>
        </section>
      </div>
      {detail && (
        <div
          role="presentation"
          onClick={() => setDetail(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-detail-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#17171b] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-zinc-500">APPLICATION DETAILS</p>
                <h2 id="application-detail-title" className="mt-1 text-lg font-semibold">
                  {detail.title}
                </h2>
              </div>
              <button
                onClick={() => setDetail(null)}
                aria-label="Close details"
                className="text-zinc-500 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="mt-2 text-sm text-zinc-300">{detail.company}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-white/[0.04] p-3">
                <p className="text-zinc-500">Status</p>
                <p className="mt-1 text-zinc-200">{detail.status}</p>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-3">
                <p className="text-zinc-500">Applied</p>
                <p className="mt-1 text-zinc-200">{detail.applied}</p>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-3">
                <p className="text-zinc-500">Schedule</p>
                <p className="mt-1 text-zinc-200">{detail.type}</p>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-3">
                <p className="text-zinc-500">Workplace</p>
                <p className="mt-1 text-zinc-200">{detail.location}</p>
              </div>
            </div>
            <button
              onClick={() => setDetail(null)}
              className="mt-5 w-full rounded-md bg-white px-3 py-2 text-xs font-medium text-zinc-900"
            >
              Done
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
