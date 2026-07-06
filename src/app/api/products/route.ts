import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const search = req.nextUrl.searchParams.get('search') || '';

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { supplierName: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const products = await Product.find(query).sort({ createdAt: -1 }).lean();

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if ((session.user as any).role !== 'admin') {
    return NextResponse.json(
      { message: 'Only admins can add products' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    await connectDB();

    const product = await Product.create(body);

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}