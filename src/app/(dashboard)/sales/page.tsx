import { getSales } from '@/actions/sale.actions';
import SalesHistory from '@/components/sales/SalesHistory';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const sales = await getSales(100);
  return <SalesHistory sales={sales} />;
}
