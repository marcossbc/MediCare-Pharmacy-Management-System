'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ReportTable from './ReportTable';
import ExportButtons from './ExportButtons';
import { ReportSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, TrendingUp, Package, Receipt } from 'lucide-react';

const PERIODS: { key: 'day' | 'month' | 'year' | 'custom'; label: string }[] = [
  { key: 'day', label: 'Today' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'custom', label: 'Custom Range' },
];

export default function ReportsClient({ initialReport }: { initialReport: ReportSummary }) {
  const [period, setPeriod] = useState<'day' | 'month' | 'year' | 'custom'>('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState<ReportSummary>(initialReport);
  const [isPending, startTransition] = useTransition();

  async function fetchReport(p: typeof period, start?: string, end?: string) {
    const params = new URLSearchParams({ period: p });
    if (p === 'custom' && start && end) {
      params.set('start', start);
      params.set('end', end);
    }
    const res = await fetch(`/api/reports?${params.toString()}`);
    const data = await res.json();
    setReport(data);
  }

  function handlePeriodChange(p: typeof period) {
    setPeriod(p);
    if (p !== 'custom') {
      startTransition(() => fetchReport(p));
    }
  }

  function handleCustomFilter() {
    if (!startDate || !endDate) return;
    startTransition(() => fetchReport('custom', startDate, endDate));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => handlePeriodChange(p.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <ExportButtons report={report} />
      </div>

      {period === 'custom' && (
        <Card>
          <CardContent className="flex flex-wrap items-end gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={handleCustomFilter} loading={isPending}>
              Apply Filter
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Sales</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(report.totalSalesAmount)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Profit</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(report.totalProfit)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Products Sold</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {report.totalProductsSold}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Invoices</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {report.totalInvoices}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <ReportTable sales={report.sales} />
      </Card>
    </div>
  );
}
