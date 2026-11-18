import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Search, Sparkles } from 'lucide-react';
import Getjobs from '@/lib/api/jobs';
import type { JobRecord } from '@/types/job';
import { BrowseJobList } from '@/components/browse-job-list';

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export default async function BrowseJobs({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const search = await searchParams;
  const query = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
    else if (value) query.set(key, value);
  });

  // Search locally so title, company, and skill text work even if the jobs API
  // does not implement the `q` query parameter.
  const searchText = typeof search.q === 'string' ? search.q.trim().toLowerCase() : '';
  const apiQuery = new URLSearchParams(query);
  apiQuery.delete('q');
  const data = await Getjobs(apiQuery.toString());
  const allJobs = (Array.isArray(data) ? data : (data?.jobs ?? [])) as JobRecord[];
  const jobs = searchText
    ? allJobs.filter((job) => {
        const searchableJob = job as JobRecord & {
          description?: string;
          skills?: string | string[];
          requirements?: string | string[];
          qualifications?: string | string[];
        };
        const searchableText = [
          searchableJob.title,
          searchableJob.companyName,
          searchableJob.company,
          searchableJob.description,
          searchableJob.skills,
          searchableJob.requirements,
          searchableJob.qualifications,
        ]
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .filter((value): value is string => typeof value === 'string')
          .join(' ')
          .toLowerCase();

        return searchableText.includes(searchText);
      })
    : allJobs;
  const selectedTypes = Array.isArray(search.type) ? search.type : search.type ? [search.type] : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            <Sparkles className="size-4" /> Find your next opportunity
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Make your next move.</h1>
          <p className="mt-2 text-sm text-zinc-400">Explore roles that fit your skills and ambitions.</p>
        </header>

        <form className="mb-7 flex gap-2 rounded-2xl border border-white/[0.08] bg-[#141416] p-2 shadow-xl shadow-black/20" action="/brows-jobs">
          <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <Search className="size-5 shrink-0 text-zinc-500" />
            <input
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500"
              type="search"
              name="q"
              defaultValue={typeof search.q === 'string' ? search.q : ''}
              placeholder="Job title, skill, or company"
            />
          </label>
          {selectedTypes.map((type) => <input key={type} type="hidden" name="type" value={type} />)}
          <button className="rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold transition hover:bg-violet-400">
            Search jobs
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/[0.07] bg-[#111113] p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold">Filters</h2>
              {selectedTypes.length > 0 && <Link href="/brows-jobs" className="text-xs text-violet-300 hover:text-violet-200">Clear</Link>}
            </div>
            <form action="/brows-jobs">
              {typeof search.q === 'string' && <input type="hidden" name="q" value={search.q} />}
              <fieldset>
                <legend className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Job type</legend>
                <div className="space-y-3">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-300">
                      <input className="size-4 accent-violet-500" type="checkbox" name="type" value={type} defaultChecked={selectedTypes.includes(type)} />
                      {type}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button className="mt-6 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-zinc-200 transition hover:border-violet-400/50 hover:bg-white/[0.03]">
                Apply filters
              </button>
            </form>
          </aside>

          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500">Your search results</p>
                <h2 className="mt-1 text-lg font-semibold">{jobs.length} professional {jobs.length === 1 ? 'job' : 'jobs'}</h2>
              </div>
              <form action="/brows-jobs" className="flex items-center gap-2 text-xs text-zinc-500">
                {typeof search.q === 'string' && <input type="hidden" name="q" value={search.q} />}
                {selectedTypes.map((type) => <input key={type} type="hidden" name="type" value={type} />)}
                <label htmlFor="sort">Sort</label>
                <select id="sort" name="sort" defaultValue={typeof search.sort === 'string' ? search.sort : 'recent'} className="rounded-lg border border-white/10 bg-[#141416] px-3 py-2 text-zinc-200 outline-none focus:border-violet-500">
                  <option value="recent">Most recent</option>
                  <option value="oldest">Oldest</option>
                </select>
                <button className="rounded-lg border border-white/10 px-3 py-2 text-zinc-300 hover:bg-white/5">Go</button>
              </form>
            </div>

            <BrowseJobList jobs={jobs} />
          </section>
        </div>
      </div>
    </main>
    </>
  );
}
