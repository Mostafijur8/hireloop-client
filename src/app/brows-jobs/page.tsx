import Getjobs from '@/lib/api/jobs';
import type { JobRecord } from '@/types/job';

const BrowseJobs = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const search = await searchParams;
  const url = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.append(key, item));
    } else if (value) {
      url.set(key, value);
    }
  });

  const data = await Getjobs(url.toString());
  const jobs = (Array.isArray(data) ? data : data?.jobs ?? []) as JobRecord[];

  return (
    <main>
      <h1>Browse Jobs</h1>
      {jobs.length > 0 ? (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              {job.title}
              {job.companyName || job.company ? ` — ${job.companyName || job.company}` : ''}
              {job.location ? ` — ${job.location}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs found.</p>
      )}
    </main>
  );
};

export default BrowseJobs;
