import { getSession } from '@/lib/server/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { database } from '@/lib/mongodb';

type ApplicationDocument = {
  _id: ObjectId;
  seekerId?: string;
  userId?: string;
  jobId?: ObjectId | string;
  title?: string;
  jobTitle?: string;
  company?: string;
  companyName?: string;
  status?: string;
  appliedAt?: Date | string;
  createdAt?: Date | string;
};

const statuses = ['Applied', 'Review', 'Shortlisted', 'Rejected', 'Offered'] as const;

function idCandidates(values: string[]) {
  return [...new Set(values)].flatMap((value) => ObjectId.isValid(value) ? [value, new ObjectId(value)] : [value]);
}

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) return { error: NextResponse.json({ error: 'Please sign in to manage applications.' }, { status: 401 }) };
  if ((session.user as typeof session.user & { role?: string }).role !== 'admin') {
    return { error: NextResponse.json({ error: 'Admin access is required.' }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const authResult = await requireAdmin();
  if ('error' in authResult) return authResult.error;

  try {
    const applications = await database.collection<ApplicationDocument>('applications')
      .find({}).sort({ appliedAt: -1, createdAt: -1 }).toArray();
    const userIds = applications.map((app) => app.seekerId ?? app.userId).filter((id): id is string => Boolean(id));
    const jobIds = applications.map((app) => app.jobId?.toString()).filter((id): id is string => Boolean(id));
    const [users, jobs] = await Promise.all([
      userIds.length ? database.collection('user').find({ _id: { $in: idCandidates(userIds) } }, { projection: { name: 1, email: 1 } }).toArray() : [],
      jobIds.length ? database.collection('jobs').find({ _id: { $in: idCandidates(jobIds) } }).toArray() : [],
    ]);
    const usersById = new Map(users.map((user) => [user._id.toString(), user]));
    const jobsById = new Map(jobs.map((job) => [job._id.toString(), job]));

    return NextResponse.json({ applications: applications.map((app) => {
      const applicantId = app.seekerId ?? app.userId ?? '';
      const jobId = app.jobId?.toString() ?? '';
      const user = usersById.get(applicantId);
      const job = jobsById.get(jobId);
      const rawStatus = statuses.find((status) => status === app.status) ?? 'Applied';
      const appliedAt = app.appliedAt ?? app.createdAt ?? null;
      return {
        id: app._id.toString(),
        applicantName: user?.name ?? 'Unknown applicant',
        applicantEmail: user?.email ?? '',
        jobTitle: app.title ?? app.jobTitle ?? job?.title ?? 'Untitled role',
        company: app.company ?? app.companyName ?? job?.companyName ?? 'Company',
        status: rawStatus,
        appliedAt,
      };
    }) });
  } catch {
    return NextResponse.json({ error: 'Could not load applications.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const authResult = await requireAdmin();
  if ('error' in authResult) return authResult.error;

  try {
    const body = await request.json() as { applicationId?: string; status?: string };
    if (!body.applicationId || !ObjectId.isValid(body.applicationId)) {
      return NextResponse.json({ error: 'Please provide a valid application.' }, { status: 400 });
    }
    if (!statuses.some((status) => status === body.status)) {
      return NextResponse.json({ error: 'Please select a valid application status.' }, { status: 400 });
    }
    const result = await database.collection<ApplicationDocument>('applications').updateOne(
      { _id: new ObjectId(body.applicationId) },
      { $set: { status: body.status, updatedAt: new Date() } },
    );
    if (!result.matchedCount) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    return NextResponse.json({ applicationId: body.applicationId, status: body.status });
  } catch {
    return NextResponse.json({ error: 'Could not update application status.' }, { status: 500 });
  }
}
