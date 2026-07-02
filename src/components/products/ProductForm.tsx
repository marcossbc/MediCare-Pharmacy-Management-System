'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { ProductDTO } from '@/types';

interface ProductFormProps {
  product?: ProductDTO;
  onSuccess: () => void;
}

const CATEGORY_OPTIONS = [
  'Analgesics',
  'Antibiotics',
  'Antiseptics',
  'Vitamins & Supplements',
  'Cold & Flu',
  'Cardiovascular',
  'Diabetes Care',
  'Skin Care',
  'First Aid',
  'Other',
];

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: product?.name ?? '',
    category: product?.category ?? CATEGORY_OPTIONS[0],
    purchasePrice: product?.purchasePrice ?? 0,
    sellingPrice: product?.sellingPrice ?? 0,
    quantity: product?.quantity ?? 0,
    lowStockThreshold: product?.lowStockThreshold ?? 10,
    expiryDate: product?.expiryDate ? product.expiryDate.slice(0, 10) : '',
    supplierName: product?.supplierName ?? '',
    batchNumber: product?.batchNumber ?? '',
    description: product?.description ?? '',
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const url = product ? `/api/products/${product._id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }

      toast.success(product ? 'Product updated' : 'Product created');
      router.refresh();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Product Name"
        placeholder="e.g. Paracetamol 500mg"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Supplier Name"
          placeholder="e.g. HealthPlus Distributors"
          value={form.supplierName}
          onChange={(e) => update('supplierName', e.target.value)}
          error={errors.supplierName}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Purchase Price ($)"
          type="number"
          step="0.01"
          min={0}
          value={form.purchasePrice}
          onChange={(e) => update('purchasePrice', Number(e.target.value))}
          error={errors.purchasePrice}
          required
        />
        <Input
          label="Selling Price ($)"
          type="number"
          step="0.01"
          min={0}
          value={form.sellingPrice}
          onChange={(e) => update('sellingPrice', Number(e.target.value))}
          error={errors.sellingPrice}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity in Stock"
          type="number"
          min={0}
          value={form.quantity}
          onChange={(e) => update('quantity', Number(e.target.value))}
          error={errors.quantity}
          required
        />
        <Input
          label="Low Stock Threshold"
          type="number"
          min={0}
          value={form.lowStockThreshold}
          onChange={(e) => update('lowStockThreshold', Number(e.target.value))}
          hint="Alert triggers at or below this quantity"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Expiry Date"
          type="date"
          value={form.expiryDate}
          onChange={(e) => update('expiryDate', e.target.value)}
          error={errors.expiryDate}
          required
        />
        <Input
          label="Batch Number"
          placeholder="Optional"
          value={form.batchNumber}
          onChange={(e) => update('batchNumber', e.target.value)}
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Optional notes about this product"
        rows={3}
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {product ? 'Save Changes' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
