import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSaleById } from '@/actions/sale.actions';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const sale = await getSaleById(params.id);
  if (!sale) return NextResponse.json({ message: 'Sale not found' }, { status: 404 });
  return NextResponse.json(sale);
}
