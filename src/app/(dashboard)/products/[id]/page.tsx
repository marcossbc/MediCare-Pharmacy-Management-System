import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '@/actions/product.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, daysUntil } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return notFound();

  const days = daysUntil(product.expiryDate);
  const isLow = product.quantity <= product.lowStockThreshold;
  const margin = product.sellingPrice - product.purchasePrice;
  const marginPct = product.purchasePrice > 0 ? (margin / product.purchasePrice) * 100 : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <div className="flex gap-2">
            <Badge variant={product.quantity === 0 ? 'danger' : isLow ? 'warning' : 'success'}>
              {product.quantity} in stock
            </Badge>
            {days <= 30 && (
              <Badge variant={days <= 7 ? 'danger' : 'warning'}>
                {days > 0 ? `Expires in ${days}d` : 'Expired'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-400">Category</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{product.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Supplier</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{product.supplierName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Purchase Price</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{formatCurrency(product.purchasePrice)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Selling Price</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{formatCurrency(product.sellingPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Profit Margin</p>
            <p className="text-sm font-medium text-primary-600">
              {formatCurrency(margin)} ({marginPct.toFixed(1)}%)
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Expiry Date</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{formatDate(product.expiryDate)}</p>
          </div>
          {product.batchNumber && (
            <div>
              <p className="text-xs text-gray-400">Batch Number</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{product.batchNumber}</p>
            </div>
          )}
          {product.description && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400">Description</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{product.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
