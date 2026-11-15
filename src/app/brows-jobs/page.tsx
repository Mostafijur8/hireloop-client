import Getjobs from '@/lib/api/jobs';
import type { JobRecord } from '@/types/job';

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

  const data = await Getjobs(query.toString());
  const jobs = (Array.isArray(data) ? data : data?.jobs ?? []) as JobRecord[];
  const selectedTypes = Array.isArray(search.type)
    ? search.type
    : search.type
      ? [search.type]
      : [];

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <form className="mb-5 flex gap-3 rounded-xl border border-white/[0.06] bg-[#141416] p-3" action="/brows-jobs">
          <input
            className="min-w-0 flex-1 rounded-lg border border-white/[0.07] bg-[#19191c] px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-violet-500"
            type="search"
            name="q"
            defaultValue={typeof search.q === 'string' ? search.q : ''}
            placeholder="Search by job title, keywords..."
          />
          {selectedTypes.map((type) => (
            <input key={type} type="hidden" name="type" value={type} />
          ))}
          <button className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200">
            Search Jobs
          </button>
        </form>

        <div className="grid gap-5 md:grid-cols-[210px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl border border-white/[0.07] bg-[#141416] p-5">
            <h2 className="mb-5 text-base font-semibold">Filters</h2>
            <form action="/brows-jobs">
              {typeof search.q === 'string' && <input type="hidden" name="q" value={search.q} />}
              <fieldset>
                <legend className="mb-3 text-sm font-medium text-zinc-300">Job Type</legend>
                <div className="space-y-3">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                      <input
                        className="size-4 accent-violet-500"
                        type="checkbox"
                        name="type"
                        value={type}
                        defaultChecked={selectedTypes.includes(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button className="mt-5 rounded-md border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5">
                Apply Filters
              </button>
            </form>
          </aside>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-lg font-semibold">Found {jobs.length} Professional Jobs</h1>
              <form action="/brows-jobs" className="flex items-center gap-2 text-xs text-zinc-500">
                {typeof search.q === 'string' && <input type="hidden" name="q" value={search.q} />}
                {selectedTypes.map((type) => (
                  <input key={type} type="hidden" name="type" value={type} />
                ))}
                <label htmlFor="sort">Sort by:</label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={typeof search.sort === 'string' ? search.sort : 'recent'}
                  className="rounded-md border border-white/10 bg-[#141416] px-2 py-2 text-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest</option>
                </select>
                <button className="rounded-md border border-white/10 px-2 py-2 text-zinc-300">Go</button>
              </form>
            </div>

            <div className="space-y-2">
              {jobs.length ? jobs.map((job) => {
                const company = job.companyName || job.company;
                const salary = job.salary || (job.salaryRange
                  ? `${job.salaryRange.currency || 'BDT'} ${job.salaryRange.min || ''}${job.salaryRange.max ? ` - ${job.salaryRange.max}` : ''}`
                  : '');

                return (
                  <article key={job._id} className="flex min-h-28 items-start gap-4 rounded-xl border border-white/[0.07] bg-[#141416] p-4 sm:p-5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#242428] text-lg font-semibold text-violet-300">
                      {company?.charAt(0) || job.title.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-zinc-100">{job.title}</h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        {[company, job.location, job.remote ? 'Remote' : ''].filter(Boolean).join(' • ') || 'Company details coming soon'}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
                        {salary && <span className="rounded-md border border-white/[0.07] px-2 py-1">{salary}</span>}
                        {job.type && <span className="rounded-md border border-white/[0.07] px-2 py-1">{job.type}</span>}
                      </div>
                    </div>
                    <span aria-hidden="true" className="text-lg text-zinc-500">☆</span>
                  </article>
                );
              }) : (
                <p className="rounded-xl border border-white/[0.07] bg-[#141416] p-6 text-sm text-zinc-400">No jobs found.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
