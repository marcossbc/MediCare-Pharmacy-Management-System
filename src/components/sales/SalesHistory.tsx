'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { SaleDTO } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const paymentVariant: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  cash: 'success',
  card: 'info',
  insurance: 'warning',
  other: 'neutral',
};

export default function SalesHistory({ sales }: { sales: SaleDTO[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">{sales.length} recent invoices</p>
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
            <Th className="text-right">Action</Th>
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
                <Td className="font-medium text-gray-800 dark:text-gray-100">{s.invoiceNumber}</Td>
                <Td>{formatDateTime(s.createdAt)}</Td>
                <Td>{s.customerName || 'Walk-in'}</Td>
                <Td>{s.items.reduce((sum, i) => sum + i.quantity, 0)} items</Td>
                <Td>
                  <Badge variant={paymentVariant[s.paymentMethod]} className="capitalize">
                    {s.paymentMethod}
                  </Badge>
                </Td>
                <Td className="font-semibold">{formatCurrency(s.totalAmount)}</Td>
                <Td className="text-right">
                  <Link href={`/sales/${s._id}`} className="text-xs font-medium text-primary-600 hover:underline">
                    View Invoice
                  </Link>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Card>
  );
}
