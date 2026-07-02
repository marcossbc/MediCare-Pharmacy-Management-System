'use client';

import { useMemo, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProductDTO } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductSelectorProps {
  products: ProductDTO[];
  onAdd: (product: ProductDTO) => void;
}

export default function ProductSelector({ products, onAdd }: ProductSelectorProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return products.slice(0, 30);
    const q = search.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 30);
  }, [products, search]);

  return (
    <div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products to add..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="max-h-[420px] overflow-y-auto scrollbar-thin space-y-1.5 pr-1">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">No products found.</p>
        )}
        {filtered.map((p) => {
          const outOfStock = p.quantity === 0;
          return (
            <button
              key={p._id}
              type="button"
              disabled={outOfStock}
              onClick={() => onAdd(p)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 px-3 py-2.5 text-left transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-950/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{p.name}</p>
                <p className="text-xs text-gray-400">
                  {p.category} · {formatCurrency(p.sellingPrice)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={outOfStock ? 'danger' : 'neutral'}>
                  {outOfStock ? 'Out of stock' : `${p.quantity} left`}
                </Badge>
                <Plus className="h-4 w-4 text-primary-600" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
