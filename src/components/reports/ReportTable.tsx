import Link from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { SaleDTO } from '@/types';

export default function ReportTable({ sales }: { sales: SaleDTO[] }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Invoice #</Th>
          <Th>Date</Th>
          <Th>Customer</Th>
          <Th>Items Sold</Th>
          <Th>Total</Th>
          <Th>Profit</Th>
          <Th className="text-right">Details</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sales.length === 0 ? (
          <Tr>
            <Td colSpan={7} className="py-10 text-center text-gray-400">
              No sales in this period.
            </Td>
          </Tr>
        ) : (
          sales.map((s) => (
            <Tr key={s._id}>
              <Td className="font-medium text-gray-800 dark:text-gray-100">{s.invoiceNumber}</Td>
              <Td>{formatDateTime(s.createdAt)}</Td>
              <Td>{s.customerName || 'Walk-in'}</Td>
              <Td>{s.items.reduce((sum, i) => sum + i.quantity, 0)}</Td>
              <Td className="font-semibold">{formatCurrency(s.totalAmount)}</Td>
              <Td className="text-primary-600">{formatCurrency(s.totalProfit)}</Td>
              <Td className="text-right">
                <Link href={`/sales/${s._id}`} className="text-xs font-medium text-primary-600 hover:underline">
                  View
                </Link>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  );
}
