import { getProducts } from '@/actions/product.actions';
import ProductTable from '@/components/products/ProductTable';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your full product catalog — pricing, stock levels, and supplier info.
        </p>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
