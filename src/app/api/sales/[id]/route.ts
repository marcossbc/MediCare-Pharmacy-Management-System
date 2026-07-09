import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Sale from '@/models/Sale';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const sale = await Sale.findById(params.id).populate('soldBy', 'name');

  if (!sale) {
    return NextResponse.json({ message: 'Sale not found' }, { status: 404 });
  }

  return NextResponse.json(sale);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if ((session.user as any).role !== 'admin') {
    return NextResponse.json(
      { message: 'Only admins can update sales' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    await connectDB();

    const sale = await Sale.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!sale) {
      return NextResponse.json(
        { message: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sale);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if ((session.user as any).role !== 'admin') {
    return NextResponse.json(
      { message: 'Only admins can delete sales' },
      { status: 403 }
    );
  }

  await connectDB();

  const sale = await Sale.findByIdAndDelete(params.id);

  if (!sale) {
    return NextResponse.json(
      { message: 'Sale not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'Sale deleted successfully',
  });
}