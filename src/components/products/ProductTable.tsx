'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Pencil, Trash2, Download } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import ProductModal from './ProductModal';
import { ProductDTO } from '@/types';
import { formatCurrency, formatDate, daysUntil } from '@/lib/utils';
import { exportProductsToExcel } from '@/lib/exportExcel';
import toast from 'react-hot-toast';

export default function ProductTable({ products }: { products: ProductDTO[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q)
    );
  }, [products, search]);

  function openAdd() {
    setEditingProduct(undefined);
    setModalOpen(true);
  }

  function openEdit(product: ProductDTO) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete product');
      }
      toast.success('Product deleted');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 p-5">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products, category, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportProductsToExcel(filtered)}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Category</Th>
            <Th>Purchase Price</Th>
            <Th>Selling Price</Th>
            <Th>Stock</Th>
            <Th>Expiry</Th>
            <Th>Supplier</Th>
            <Th className="text-right">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.length === 0 ? (
            <Tr>
              <Td colSpan={8} className="py-10 text-center text-gray-400">
                No products found.
              </Td>
            </Tr>
          ) : (
            filtered.map((p) => {
              const isLow = p.quantity <= p.lowStockThreshold;
              const days = daysUntil(p.expiryDate);
              return (
                <Tr key={p._id}>
                  <Td className="font-medium text-gray-800 dark:text-gray-100">{p.name}</Td>
                  <Td>{p.category}</Td>
                  <Td>{formatCurrency(p.purchasePrice)}</Td>
                  <Td>{formatCurrency(p.sellingPrice)}</Td>
                  <Td>
                    <Badge variant={p.quantity === 0 ? 'danger' : isLow ? 'warning' : 'success'}>
                      {p.quantity} units
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span>{formatDate(p.expiryDate)}</span>
                      {days <= 30 && (
                        <Badge variant={days <= 7 ? 'danger' : 'warning'} className="mt-1 w-fit">
                          {days > 0 ? `${days}d left` : 'Expired'}
                        </Badge>
                      )}
                    </div>
                  </Td>
                  <Td>{p.supplierName}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>

      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} product={editingProduct} />
    </Card>
  );
}
