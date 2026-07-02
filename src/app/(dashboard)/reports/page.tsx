import { generateReport } from '@/actions/report.actions';
import ReportsClient from '@/components/reports/ReportsClient';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const report = await generateReport('day');
  return <ReportsClient initialReport={report} />;
}
