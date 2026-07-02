import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

interface Params {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  const user = await User.findByIdAndUpdate(
    params.id,
    { role: body.role, active: body.active },
    { new: true }
  ).select('-password');

  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id === params.id) {
    return NextResponse.json({ message: 'You cannot delete your own account' }, { status: 400 });
  }

  await connectDB();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'User deleted' });
}
