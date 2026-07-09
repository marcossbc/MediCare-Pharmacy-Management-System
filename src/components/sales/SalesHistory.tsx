'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { SaleDTO } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

const paymentVariant: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  cash: 'success',
  card: 'info',
  insurance: 'warning',
  other: 'neutral',
};

export default function SalesHistory({ sales }: { sales: SaleDTO[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this sale?')) return;

    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete sale');
      }

      toast.success('Sale deleted successfully');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {sales.length} recent invoices
        </p>

        <Link href="/sales/new">
          <Button>
            <Plus className="h-4 w-4" /> New Sale
          </Button>
        </Link>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Invoice #</Th>
            <Th>Date</Th>
            <Th>Customer</Th>
            <Th>Items</Th>
            <Th>Payment</Th>
            <Th>Total</Th>
            <Th className="text-right">Actions</Th>
          </Tr>
        </Thead>

        <Tbody>
          {sales.length === 0 ? (
            <Tr>
              <Td colSpan={7} className="py-10 text-center text-gray-400">
                No sales recorded yet.
              </Td>
            </Tr>
          ) : (
            sales.map((s) => (
              <Tr key={s._id}>
                <Td className="font-medium text-gray-800 dark:text-gray-100">
                  {s.invoiceNumber}
                </Td>

                <Td>{formatDateTime(s.createdAt)}</Td>

                <Td>{s.customerName || 'Walk-in'}</Td>

                <Td>
                  {s.items.reduce((sum, i) => sum + i.quantity, 0)} items
                </Td>

                <Td>
                  <Badge
                    variant={paymentVariant[s.paymentMethod]}
                    className="capitalize"
                  >
                    {s.paymentMethod}
                  </Badge>
                </Td>

                <Td className="font-semibold">
                  {formatCurrency(s.totalAmount)}
                </Td>

                <Td className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Link
                      href={`/sales/${s._id}`}
                      className="text-xs font-medium text-primary-600 hover:underline"
                    >
                      View Invoice
                    </Link>

                    <button
                      onClick={() => handleDelete(s._id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Card>
  );
}