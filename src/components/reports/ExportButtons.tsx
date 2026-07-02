'use client';

import { FileDown, FileSpreadsheet } from 'lucide-react';
import Button from '@/components/ui/Button';
import { exportReportToPDF } from '@/lib/exportPdf';
import { exportReportToExcel } from '@/lib/exportExcel';
import { ReportSummary } from '@/types';

export default function ExportButtons({ report }: { report: ReportSummary }) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => exportReportToPDF(report)}>
        <FileDown className="h-4 w-4" /> Export PDF
      </Button>
      <Button variant="outline" onClick={() => exportReportToExcel(report)}>
        <FileSpreadsheet className="h-4 w-4" /> Export Excel
      </Button>
    </div>
  );
}
