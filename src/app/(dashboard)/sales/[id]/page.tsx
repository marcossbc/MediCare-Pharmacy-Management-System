import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSaleById } from '@/actions/sale.actions';
import InvoicePrint from '@/components/sales/InvoicePrint';

export const dynamic = 'force-dynamic';

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const sale = await getSaleById(params.id);
  if (!sale) return notFound();

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/sales" className="no-print inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to sales
      </Link>
      <InvoicePrint sale={sale} />
    </div>
  );
}
