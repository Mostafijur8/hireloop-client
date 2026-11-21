import { getSession } from '@/core/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { database } from '@/lib/mongodb';

type ApplicationDocument = {
  _id: ObjectId;
  seekerId?: string;
  userId?: string;
  title?: string;
  jobTitle?: string;
  company?: string;
  companyName?: string;
  type?: string;
  employmentType?: string;
  location?: string;
  workLocation?: string;
  applied?: string;
  appliedAt?: Date | string;
  createdAt?: Date | string;
  status?: string;
  archived?: boolean;
  jobId?: ObjectId | string;
};

const statuses = ['Applied', 'Review', 'Shortlisted', 'Rejected', 'Offered'] as const;

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Please sign in to view applications.' }, { status: 401 });
  }

  try {
    const applications = await database
      .collection<ApplicationDocument>('applications')
      .find({ $or: [{ seekerId: session.user.id }, { userId: session.user.id }] })
      .sort({ appliedAt: -1, createdAt: -1 })
      .toArray();

    const jobIds = applications.flatMap((application) => {
      const rawId = application.jobId;
      if (!rawId) return [];
      if (rawId instanceof ObjectId) return [rawId];
      return ObjectId.isValid(rawId) ? [new ObjectId(rawId)] : [];
    });
    const jobs = jobIds.length
      ? await database.collection('jobs').find({ _id: { $in: jobIds } }).toArray()
      : [];
    const jobsById = new Map(jobs.map((job) => [job._id.toString(), job]));

    return NextResponse.json({
      applications: applications.map((application) => {
        const rawJobId = application.jobId?.toString();
        const job = rawJobId ? jobsById.get(rawJobId) : undefined;
        const status = statuses.find((value) => value === application.status) ?? 'Applied';
        const appliedDate = application.appliedAt ?? application.createdAt;

        return {
          id: application._id.toString(),
          jobId: rawJobId,
          title: application.title ?? application.jobTitle ?? job?.title ?? 'Untitled role',
          company: application.company ?? application.companyName ?? job?.companyName ?? 'Company',
          type: application.type ?? application.employmentType ?? job?.type ?? 'Full-time',
          location: application.location ?? application.workLocation ?? job?.location ?? 'Not specified',
          applied: application.applied ?? (appliedDate ? new Date(appliedDate).toLocaleDateString() : 'Recently'),
          status,
          archived: application.archived ?? false,
        };
      }),
    });
  } catch (error) {
    console.error('Could not load applications:', error);
    return NextResponse.json({ error: 'Could not load applications.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Please sign in to apply.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { jobId?: unknown };
    if (typeof body.jobId !== 'string' || !ObjectId.isValid(body.jobId)) {
      return NextResponse.json({ error: 'Please provide a valid jobId.' }, { status: 400 });
    }

    const jobId = new ObjectId(body.jobId);
    const job = await database.collection('jobs').findOne({ _id: jobId });
    if (!job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    const collection = database.collection('applications');
    const existing = await collection.findOne({ seekerId: session.user.id, jobId });
    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this job.' }, { status: 409 });
    }

    const applicationCount = await collection.countDocuments({
      $or: [{ seekerId: session.user.id }, { userId: session.user.id }],
    });
    const hasPaidAccess = await database.collection('payments').findOne({ userId: session.user.id });
    if (applicationCount >= 2 && !hasPaidAccess) {
      return NextResponse.json(
        {
          error: 'You have used your 2 free applications.',
          paymentRequired: true,
          redirectTo: '/payment',
        },
        { status: 402 },
      );
    }

    const application = {
      seekerId: session.user.id,
      jobId,
      status: 'Applied',
      appliedAt: new Date(),
    };
    const result = await collection.insertOne(application);

    return NextResponse.json(
      { application: { id: result.insertedId.toString(), ...application } },
      { status: 201 },
    );
  } catch (error) {
    console.error('Could not submit application:', error);
    return NextResponse.json({ error: 'Could not submit application.' }, { status: 500 });
  }
}
