'use server';

import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Sale from '@/models/Sale';
import { getDateRange } from '@/lib/utils';
import { DashboardStats } from '@/types';

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectDB();

  const { start: todayStart, end: todayEnd } = getDateRange('day');
  const { start: monthStart, end: monthEnd } = getDateRange('month');
  const { start: yearStart, end: yearEnd } = getDateRange('year');

  const nearExpiryThreshold = new Date();
  nearExpiryThreshold.setDate(nearExpiryThreshold.getDate() + 30);

  const [
    totalProducts,
    stockAgg,
    lowStockProducts,
    nearExpiryProducts,
    todayAgg,
    monthAgg,
    yearAgg,
    categoryAgg,
    trendAgg,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
    Product.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] } })
      .sort({ quantity: 1 })
      .limit(10)
      .lean(),
    Product.find({ expiryDate: { $gte: new Date(), $lte: nearExpiryThreshold } })
      .sort({ expiryDate: 1 })
      .limit(10)
      .lean(),
    Sale.aggregate([
      { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),
    Sale.aggregate([
      { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Sale.aggregate([
      { $match: { createdAt: { $gte: yearStart, $lte: yearEnd } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Product.aggregate([
      { $group: { _id: '$category', value: { $sum: '$quantity' } } },
      { $sort: { value: -1 } },
      { $limit: 6 },
    ]),
    Sale.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 13)) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          profit: { $sum: '$totalProfit' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  // Fill in the last 14 days so the chart has no gaps
  const trendMap = new Map(trendAgg.map((t: any) => [t._id, t]));
  const salesTrend = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry: any = trendMap.get(key);
    salesTrend.push({
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: entry?.sales ?? 0,
      profit: entry?.profit ?? 0,
    });
  }

  return {
    totalProducts,
    totalStockUnits: stockAgg[0]?.total ?? 0,
    lowStockCount: lowStockProducts.length,
    nearExpiryCount: nearExpiryProducts.length,
    todaySales: todayAgg[0]?.total ?? 0,
    todayInvoices: todayAgg[0]?.count ?? 0,
    monthSales: monthAgg[0]?.total ?? 0,
    yearSales: yearAgg[0]?.total ?? 0,
    salesTrend,
    categoryBreakdown: categoryAgg.map((c: any) => ({ category: c._id, value: c.value })),
    lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts)),
    nearExpiryProducts: JSON.parse(JSON.stringify(nearExpiryProducts)),
  };
}
