import { getLowStockProducts, getNearExpiryProducts } from '@/actions/product.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Clock } from 'lucide-react';
import { formatDate, daysUntil } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const [lowStock, nearExpiry] = await Promise.all([
    getLowStockProducts(),
    getNearExpiryProducts(30),
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock Alerts
          </CardTitle>
          <span className="text-xs text-gray-400">{lowStock.length} products</span>
        </CardHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Current Stock</Th>
              <Th>Threshold</Th>
              <Th>Supplier</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lowStock.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="py-10 text-center text-gray-400">
                  All products are sufficiently stocked.
                </Td>
              </Tr>
            ) : (
              lowStock.map((p: any) => (
                <Tr key={p._id}>
                  <Td className="font-medium text-gray-800 dark:text-gray-100">{p.name}</Td>
                  <Td>{p.category}</Td>
                  <Td>
                    <Badge variant={p.quantity === 0 ? 'danger' : 'warning'}>{p.quantity} units</Badge>
                  </Td>
                  <Td>{p.lowStockThreshold}</Td>
                  <Td>{p.supplierName}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-500" /> Near-Expiry Products
          </CardTitle>
          <span className="text-xs text-gray-400">Next 30 days · {nearExpiry.length} products</span>
        </CardHeader>
        <Table>
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Stock</Th>
              <Th>Expiry Date</Th>
              <Th>Days Left</Th>
            </Tr>
          </Thead>
          <Tbody>
            {nearExpiry.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="py-10 text-center text-gray-400">
                  No products nearing expiry.
                </Td>
              </Tr>
            ) : (
              nearExpiry.map((p: any) => {
                const days = daysUntil(p.expiryDate);
                return (
                  <Tr key={p._id}>
                    <Td className="font-medium text-gray-800 dark:text-gray-100">{p.name}</Td>
                    <Td>{p.category}</Td>
                    <Td>{p.quantity} units</Td>
                    <Td>{formatDate(p.expiryDate)}</Td>
                    <Td>
                      <Badge variant={days <= 7 ? 'danger' : 'warning'}>{days} days</Badge>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
