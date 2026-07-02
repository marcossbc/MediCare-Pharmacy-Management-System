import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateReport } from '@/actions/report.actions';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const period = (req.nextUrl.searchParams.get('period') || 'day') as
    | 'day'
    | 'month'
    | 'year'
    | 'custom';
  const start = req.nextUrl.searchParams.get('start') || undefined;
  const end = req.nextUrl.searchParams.get('end') || undefined;

  const report = await generateReport(period, start, end);
  return NextResponse.json(report);
}
