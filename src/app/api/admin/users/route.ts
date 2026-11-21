import { getSession } from '@/core/server';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { database } from '@/lib/mongodb';

type UserDocument = {
  _id: ObjectId | string;
  name?: string;
  email?: string;
  role?: string;
  image?: string | null;
  createdAt?: Date | string;
  emailVerified?: boolean;
  banned?: boolean | null;
};

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Please sign in to view users.' }, { status: 401 });
  }

  if ((session.user as typeof session.user & { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
  }

  try {
    const users = await database
      .collection<UserDocument>('user')
      .find({}, { projection: { name: 1, email: 1, role: 1, image: 1, createdAt: 1, emailVerified: 1, banned: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name ?? 'Unnamed user',
        email: user.email ?? '',
        role: user.role ?? 'seeker',
        image: user.image ?? null,
        createdAt: user.createdAt ?? null,
        emailVerified: Boolean(user.emailVerified),
        banned: Boolean(user.banned),
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Could not load users.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Please sign in to manage users.' }, { status: 401 });
  }
  if ((session.user as typeof session.user & { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
  }

  try {
    const body = await request.json() as { userId?: string; action?: string };
    const userId = body.userId?.trim();
    if (!userId || !['make-admin', 'make-recruiter', 'make-seeker', 'suspend', 'activate'].includes(body.action ?? '')) {
      return NextResponse.json({ error: 'Invalid user action.' }, { status: 400 });
    }

    const databaseIds: Array<ObjectId | string> = ObjectId.isValid(userId)
      ? [new ObjectId(userId), userId]
      : [userId];
    const target = await database.collection<UserDocument>('user').findOne(
      { _id: { $in: databaseIds } },
      { projection: { role: 1 } },
    );
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    if (body.action === 'make-admin' || body.action === 'make-recruiter' || body.action === 'make-seeker') {
      if (userId === session.user.id) return NextResponse.json({ error: 'You cannot change your own role.' }, { status: 400 });
      const nextRole = body.action === 'make-admin' ? 'admin' : body.action === 'make-recruiter' ? 'recruiter' : 'seeker';
      if (target.role === 'admin' && nextRole !== 'admin') {
        const adminCount = await database.collection<UserDocument>('user').countDocuments({ role: 'admin' });
        if (adminCount <= 1) return NextResponse.json({ error: 'The last administrator cannot be demoted.' }, { status: 400 });
      }
      const update = await database.collection<UserDocument>('user').updateOne(
        { _id: target._id },
        { $set: { role: nextRole, updatedAt: new Date() } },
      );
      if (!update.matchedCount) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      return NextResponse.json({ userId, role: nextRole });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot suspend your own account.' }, { status: 400 });
    }
    if (target.role === 'admin') {
      return NextResponse.json({ error: 'Admin accounts cannot be suspended here.' }, { status: 400 });
    }

    if (body.action === 'suspend') {
      await database.collection<UserDocument>('user').updateOne(
        { _id: target._id },
        { $set: { banned: true, banReason: 'Suspended by an administrator', banExpires: null, updatedAt: new Date() } },
      );
      await database.collection('session').deleteMany({ userId: { $in: databaseIds } });
      return NextResponse.json({ userId, banned: true });
    }

    await database.collection<UserDocument>('user').updateOne(
      { _id: target._id },
      { $set: { banned: false, banReason: null, banExpires: null, updatedAt: new Date() } },
    );
    return NextResponse.json({ userId, banned: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update this user.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Please sign in to manage users.' }, { status: 401 });
  }
  if ((session.user as typeof session.user & { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
  }

  try {
    const body = await request.json() as { userId?: string };
    const userId = body.userId?.trim();
    if (!userId) return NextResponse.json({ error: 'Please provide a user to remove.' }, { status: 400 });
    if (userId === session.user.id) return NextResponse.json({ error: 'You cannot remove your own account.' }, { status: 400 });

    const ids: Array<ObjectId | string> = ObjectId.isValid(userId)
      ? [new ObjectId(userId), userId]
      : [userId];
    const users = database.collection<UserDocument>('user');
    const target = await users.findOne({ _id: { $in: ids } });
    if (!target) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    if (target.role === 'admin') {
      return NextResponse.json({ error: 'Demote this admin before removing the account.' }, { status: 400 });
    }

    await Promise.all([
      database.collection('session').deleteMany({ userId: { $in: ids } }),
      database.collection('account').deleteMany({ userId: { $in: ids } }),
    ]);
    const result = await users.deleteOne({ _id: target._id });
    if (!result.deletedCount) return NextResponse.json({ error: 'User could not be removed.' }, { status: 500 });
    return NextResponse.json({ success: true, userId });
  } catch {
    return NextResponse.json({ error: 'Could not remove this user.' }, { status: 500 });
  }
}
