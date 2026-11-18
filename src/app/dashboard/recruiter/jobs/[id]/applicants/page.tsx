'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';

type Applicant = {
  _id: string;
  status?: string;
  appliedAt?: string;
  seeker?: { id?: string; name?: string; email?: string; image?: string };
};

type JobApplicants = {
  _id: string;
  title: string;
  companyName?: string;
  applicantCount: number;
  applicants: Applicant[];
};

const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected'];

export default function ApplicantsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const [job, setJob] = useState<JobApplicants | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
    fetch(`${apiUrl}/recruiter/jobs/applications`, { credentials: 'include' })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error ?? 'Could not load candidates.');
        const selectedJob = (Array.isArray(data) ? data : []).find((item) => item._id === jobId);
        if (!selectedJob) throw new Error('Job not found or you do not have access to it.');
        setJob(selectedJob);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Could not load candidates.'))
      .finally(() => setLoading(false));
  }, [jobId]);

  async function updateStatus(applicationId: string, status: string) {
    setSavingId(applicationId);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/recruiter/applications/${applicationId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? 'Could not update candidate status.');
      setJob((current) => current ? {
        ...current,
        applicants: current.applicants.map((applicant) => applicant._id === applicationId ? { ...applicant, status } : applicant),
      } : current);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Could not update candidate status.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-[calc(100svh-3rem)] flex-1 bg-[#121212] px-4 pb-10 pt-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard/recruiter/jobs" className="inline-flex items-center gap-2 text-xs text-[#aaaab2] transition hover:text-white">
          <ArrowLeft className="size-4" /> Back to jobs
        </Link>
        <header className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[#2b2b30] bg-gradient-to-br from-[#1d1b29] via-[#17171b] to-[#151517] p-5 sm:p-7">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[.16em] text-[#a99fff]">Candidate review</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{job?.title ?? (loading ? 'Loading candidates…' : 'Applicants')}</h1>
            {job?.companyName && <p className="mt-1 text-sm text-[#a5a5ae]">{job.companyName}</p>}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.04] px-4 py-3">
            <Users className="size-4 text-[#aaa0ff]" /><span className="text-sm font-semibold">{job?.applicantCount ?? 0}</span><span className="text-xs text-[#a5a5ae]">applicants</span>
          </div>
        </header>
        {error && <div role="alert" className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#29292f] bg-[#171719] shadow-[0_14px_40px_rgba(0,0,0,.18)]">
          <div className="flex items-center justify-between border-b border-[#29292f] px-4 py-4 sm:px-5">
            <div><h2 className="text-sm font-semibold">Applicants</h2><p className="mt-1 text-xs text-[#85858e]">Review each application and update its status.</p></div>
          </div>
          {loading ? <div className="px-5 py-12 text-center text-sm text-[#85858e]">Loading applicants…</div> : job && job.applicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-[#1c1c20] text-[10px] uppercase tracking-wide text-[#85858e]"><tr><th className="px-5 py-3 font-medium">Candidate</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Applied</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Update status</th></tr></thead>
                <tbody className="divide-y divide-[#29292f]">
                  {job.applicants.map((applicant) => (
                    <tr key={applicant._id} className="transition hover:bg-white/[.025]">
                      <td className="px-5 py-3.5"><div className="flex items-center gap-3">{applicant.seeker?.image ? <img src={applicant.seeker.image} alt="" className="size-9 rounded-full border border-white/10 object-cover" /> : <div className="flex size-9 items-center justify-center rounded-full bg-[#302b52] text-xs font-semibold text-[#c9c1ff]">{(applicant.seeker?.name ?? '?').slice(0, 1).toUpperCase()}</div>}<span className="text-sm font-medium text-white">{applicant.seeker?.name ?? 'Name unavailable'}</span></div></td>
                      <td className="px-5 py-3.5 text-xs text-[#aaaab2]">{applicant.seeker?.email ?? 'Email unavailable'}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-[#aaaab2]">{formatAppliedTime(applicant.appliedAt)}</td>
                      <td className="px-5 py-3.5"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyle(applicant.status)}`}>{applicant.status ?? 'Applied'}</span></td>
                      <td className="px-5 py-3.5 text-right"><label><span className="sr-only">Update status for {applicant.seeker?.name ?? 'candidate'}</span><select value={applicant.status ?? 'Applied'} disabled={savingId === applicant._id} onChange={(event) => updateStatus(applicant._id, event.target.value)} className="rounded-lg border border-[#37373e] bg-[#202024] px-3 py-2 text-xs text-white outline-none transition focus:border-[#8174ff] disabled:opacity-50">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : !error && <div className="px-5 py-14 text-center"><Users className="mx-auto size-8 text-[#55555e]" /><p className="mt-3 text-sm font-medium text-white">No applicants yet</p><p className="mt-1 text-xs text-[#85858e]">New applications for this job will appear here.</p></div>}
        </section>
      </div>
    </main>
  );
}

function statusStyle(status?: string) {
  switch (status) {
    case 'Under Review': return 'border-sky-400/20 bg-sky-400/10 text-sky-300';
    case 'Shortlisted': return 'border-violet-400/20 bg-violet-400/10 text-violet-300';
    case 'Interview': return 'border-amber-400/20 bg-amber-400/10 text-amber-300';
    case 'Rejected': return 'border-rose-400/20 bg-rose-400/10 text-rose-300';
    default: return 'border-[#aaa]/15 bg-white/[.05] text-[#d0d0d6]';
  }
}

function formatAppliedTime(value?: string) {
  if (!value) return 'time unavailable';
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'time unavailable';
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
