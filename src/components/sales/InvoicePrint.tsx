'use client';

import { Printer, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { exportInvoiceToPDF } from '@/lib/exportPdf';
import { SaleDTO } from '@/types';

export default function InvoicePrint({ sale }: { sale: SaleDTO }) {
  const soldByName = typeof sale.soldBy === 'string' ? sale.soldBy : sale.soldBy?.name;

  return (
    <div>
      <div className="no-print mb-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => exportInvoiceToPDF(sale)}>
          <Download className="h-4 w-4" /> Download PDF
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 print:border-none print:shadow-none">
        <div className="flex items-start justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
          <div>
            <h2 className="text-xl font-bold text-primary-700">ILEYSCARE Pharmacy</h2>
            <p className="mt-1 text-sm text-gray-500">123 Wellness Ave, Health City</p>
            <p className="text-sm text-gray-500">Phone :907564618</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Invoice #{sale.invoiceNumber}
            </p>
            <p className="mt-1 text-xs text-gray-500">{formatDateTime(sale.createdAt)}</p>
            <p className="text-xs text-gray-500 capitalize">{sale.paymentMethod} payment</p>
          </div>
        </div>

        <div className="mt-6 flex justify-between text-sm">
          <div>
            <p className="text-xs text-gray-400">Billed to</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {sale.customerName || 'Walk-in Customer'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Served by</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{soldByName || '—'}</p>
          </div>
        </div>

        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase text-gray-400">
              <th className="py-2">Product</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sale.items.map((item, i) => (
              <tr key={i}>
                <td className="py-2.5 text-gray-700 dark:text-gray-200">{item.name}</td>
                <td className="py-2.5 text-center text-gray-500">{item.quantity}</td>
                <td className="py-2.5 text-right text-gray-500">{formatCurrency(item.sellingPrice)}</td>
                <td className="py-2.5 text-right font-medium text-gray-800 dark:text-gray-100">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-56 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total Items</span>
              <span>{sale.items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2 text-lg font-bold text-gray-800 dark:text-gray-100">
              <span>Total</span>
              <span>{formatCurrency(sale.totalAmount)}</span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-gray-400">
          Thank you for choosing MediCare Pharmacy. Get well soon!
        </p>
      </div>
    </div>
  );
}



