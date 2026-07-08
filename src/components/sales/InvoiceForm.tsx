'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ProductSelector from './ProductSelector';
import { ProductDTO } from '@/types';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CartLine {
  product: ProductDTO;
  quantity: number;
}

export default function InvoiceForm({ products }: { products: ProductDTO[] }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MY CASH' | 'GolisCard' | 'EDAHABPlus' | 'other'>('MY CASH');
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.sellingPrice * line.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);

  function addToCart(product: ProductDTO) {
    setCart((prev) => {
      const existing = prev.find((l) => l.product._id === product._id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          toast.error('Cannot exceed available stock');
          return prev;
        }
        return prev.map((l) =>
          l.product._id === product._id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.product._id !== productId) return l;
          const newQty = l.quantity + delta;
          if (newQty > l.product.quantity) {
            toast.error('Cannot exceed available stock');
            return l;
          }
          return { ...l, quantity: newQty };
        })
        .filter((l) => l.quantity > 0)
    );
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((l) => l.product._id !== productId));
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      toast.error('Add at least one product to the cart');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((l) => ({ productId: l.product._id, quantity: l.quantity })),
          customerName,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create invoice');
      }

      toast.success(`Invoice ${data.invoiceNumber} created successfully`);
      setCart([]);
      setCustomerName('');
      router.push(`/sales`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Select Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductSelector products={products} onAdd={addToCart} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 h-fit lg:sticky lg:top-20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" /> Current Invoice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[280px] overflow-y-auto scrollbar-thin space-y-2">
            {cart.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">Cart is empty. Add products to begin.</p>
            ) : (
              cart.map((line) => (
                <div
                  key={line.product._id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(line.product.sellingPrice)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(line.product._id, -1)}
                      className="rounded-md border border-gray-200 dark:border-gray-700 p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{line.quantity}</span>
                    <button
                      onClick={() => updateQuantity(line.product._id, 1)}
                      className="rounded-md border border-gray-200 dark:border-gray-700 p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeLine(line.product._id)}
                      className="ml-1 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <Input
              label="Customer Name"
              placeholder="Walk-in Customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
            >
              <option value="MY CASH">MY CASH</option>
              <option value="GolisCard">GolisCard</option>
              <option value="EDAHABPlus">EDAHABPlus</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Button onClick={handleCheckout} loading={loading} className="w-full" size="lg">
            Complete Sale
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
