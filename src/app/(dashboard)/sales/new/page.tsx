import { getProducts } from '@/actions/product.actions';
import InvoiceForm from '@/components/sales/InvoiceForm';

export const dynamic = 'force-dynamic';

export default async function NewSalePage() {
  const products = await getProducts();
  const inStock = products.filter((p: any) => p.quantity > 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Build an invoice by adding products below. Stock updates automatically once the sale is completed.
      </p>
      <InvoiceForm products={inStock} />
    </div>
  );
}
