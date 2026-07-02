'use server';

import { connectDB } from '@/lib/mongodb';
import Sale from '@/models/Sale';
import { getDateRange } from '@/lib/utils';
import { ReportSummary } from '@/types';

export async function generateReport(
  period: 'day' | 'month' | 'year' | 'custom',
  customStart?: string,
  customEnd?: string
): Promise<ReportSummary> {
  await connectDB();

  let start: Date;
  let end: Date;

  if (period === 'custom' && customStart && customEnd) {
    start = new Date(customStart);
    start.setHours(0, 0, 0, 0);
    end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
  } else {
    const range = getDateRange(period === 'custom' ? 'day' : period);
    start = range.start;
    end = range.end;
  }

  const sales = await Sale.find({ createdAt: { $gte: start, $lte: end } })
    .populate('soldBy', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const totalSalesAmount = sales.reduce((sum, s: any) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s: any) => sum + s.totalProfit, 0);
  const totalProductsSold = sales.reduce(
    (sum, s: any) => sum + s.items.reduce((qs: number, i: any) => qs + i.quantity, 0),
    0
  );

  return {
    period,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    totalSalesAmount,
    totalProductsSold,
    totalProfit,
    totalInvoices: sales.length,
    sales: JSON.parse(JSON.stringify(sales)),
  };
}
