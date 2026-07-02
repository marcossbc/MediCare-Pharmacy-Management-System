'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  AlertTriangle,
  DollarSign,
  CalendarDays,
  CalendarRange,
  TrendingUp,
  Clock,
} from 'lucide-react';
import StatCard from './StatCard';
import SalesChart from './SalesChart';
import CategoryChart from './CategoryChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DashboardStats } from '@/types';
import { formatCurrency, daysUntil, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardClient({ initialStats }: { initialStats: DashboardStats }) {
  const [stats, setStats] = useState<DashboardStats>(initialStats);

  // Real-time polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // silent fail — keep showing last known stats
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          trend={`${stats.totalStockUnits.toLocaleString()} units in stock`}
          trendUp
          tone="primary"
        />
        <StatCard
          label="Low Stock Alerts"
          value={stats.lowStockCount.toLocaleString()}
          icon={AlertTriangle}
          trend={stats.lowStockCount > 0 ? 'Needs attention' : 'All good'}
          trendUp={stats.lowStockCount === 0}
          tone="amber"
        />
        <StatCard
          label="Today's Sales"
          value={formatCurrency(stats.todaySales)}
          icon={DollarSign}
          trend={`${stats.todayInvoices} invoices today`}
          trendUp
          tone="blue"
        />
        <StatCard
          label="Near Expiry"
          value={stats.nearExpiryCount.toLocaleString()}
          icon={Clock}
          trend="Within 30 days"
          trendUp={stats.nearExpiryCount === 0}
          tone="red"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Monthly Sales"
          value={formatCurrency(stats.monthSales)}
          icon={CalendarDays}
          tone="primary"
        />
        <StatCard
          label="Yearly Sales"
          value={formatCurrency(stats.yearSales)}
          icon={CalendarRange}
          tone="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales &amp; Profit — Last 14 Days</CardTitle>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-gray-500">
                <span className="h-2 w-2 rounded-full bg-primary-500" /> Sales
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <span className="h-2 w-2 rounded-full bg-accent-500" /> Profit
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart data={stats.salesTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryChart data={stats.categoryBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock Products
            </CardTitle>
            <Link href="/inventory" className="text-xs font-medium text-primary-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats.lowStockProducts.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No low stock products right now.</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {stats.lowStockProducts.map((p) => (
                  <li key={p._id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category}</p>
                    </div>
                    <Badge variant={p.quantity === 0 ? 'danger' : 'warning'}>
                      {p.quantity} left
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" /> Near-Expiry Products
            </CardTitle>
            <Link href="/inventory" className="text-xs font-medium text-primary-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats.nearExpiryProducts.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">No products nearing expiry.</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {stats.nearExpiryProducts.map((p) => {
                  const days = daysUntil(p.expiryDate);
                  return (
                    <li key={p._id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{p.name}</p>
                        <p className="text-xs text-gray-400">Expires {formatDate(p.expiryDate)}</p>
                      </div>
                      <Badge variant={days <= 7 ? 'danger' : 'warning'}>{days}d left</Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
