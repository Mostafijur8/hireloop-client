import Link from "next/link";

const fieldClassName =
  "mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/60";

export default function NewJobsPage() {
  return (
    <div className="min-h-[calc(100svh-3rem)] bg-[#050507] px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/recruiter/jobs"
          className="text-sm text-zinc-400 transition-colors hover:text-white"
        >
          ← Manage jobs
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-300">
            RECRUITER WORKSPACE
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add a job</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create a job posting to bring the right candidates to your team.
          </p>
        </header>

        <form className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <div>
            <label htmlFor="job-title" className="text-sm font-medium text-zinc-200">
              Job title
            </label>
            <input
              id="job-title"
              name="title"
              placeholder="e.g. Product Designer"
              className={fieldClassName}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="job-location" className="text-sm font-medium text-zinc-200">
                Location
              </label>
              <input
                id="job-location"
                name="location"
                placeholder="e.g. Dhaka or Remote"
                className={fieldClassName}
              />
            </div>
            <div>
              <label htmlFor="job-type" className="text-sm font-medium text-zinc-200">
                Employment type
              </label>
              <select id="job-type" name="type" defaultValue="" className={fieldClassName}>
                <option value="" disabled className="bg-[#111114]">
                  Select a type
                </option>
                <option className="bg-[#111114]">Full-time</option>
                <option className="bg-[#111114]">Part-time</option>
                <option className="bg-[#111114]">Contract</option>
                <option className="bg-[#111114]">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="job-description" className="text-sm font-medium text-zinc-200">
              Job description
            </label>
            <textarea
              id="job-description"
              name="description"
              rows={7}
              placeholder="Describe the role, responsibilities, and qualifications..."
              className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/60"
            />
          </div>

          <p className="text-xs text-zinc-500">
            Job posting and publishing are not connected yet.
          </p>
          <button
            type="button"
            disabled
            className="h-11 rounded-xl bg-violet-500 px-5 text-sm font-semibold text-white opacity-60"
          >
            Publish job (coming soon)
          </button>
        </form>
      </div>
    </div>
  );
}
