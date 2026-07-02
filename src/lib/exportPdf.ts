import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { ReportSummary, SaleDTO } from '@/types';

export function exportReportToPDF(report: ReportSummary) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(19, 132, 91);
  doc.text('MediCare Pharmacy', 14, 18);

  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  const title = `${report.period.charAt(0).toUpperCase() + report.period.slice(1)} Sales Report`;
  doc.text(title, 14, 26);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Period: ${formatDate(report.startDate)} - ${formatDate(report.endDate)}`,
    14,
    32
  );

  autoTable(doc, {
    startY: 38,
    head: [['Metric', 'Value']],
    body: [
      ['Total Sales Amount', formatCurrency(report.totalSalesAmount)],
      ['Total Profit', formatCurrency(report.totalProfit)],
      ['Total Products Sold', String(report.totalProductsSold)],
      ['Total Invoices', String(report.totalInvoices)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [19, 132, 91] },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  autoTable(doc, {
    startY: finalY,
    head: [['Invoice #', 'Date', 'Customer', 'Items', 'Total', 'Profit']],
    body: report.sales.map((s) => [
      s.invoiceNumber,
      formatDate(s.createdAt),
      s.customerName || 'Walk-in',
      String(s.items.reduce((sum, i) => sum + i.quantity, 0)),
      formatCurrency(s.totalAmount),
      formatCurrency(s.totalProfit),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 8 },
  });

  doc.save(`sales-report-${report.period}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportInvoiceToPDF(sale: SaleDTO) {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(19, 132, 91);
  doc.text('MediCare Pharmacy', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('123 Wellness Ave, Health City', 14, 27);
  doc.text('Phone: (000) 123-4567', 14, 32);

  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text(`Invoice: ${sale.invoiceNumber}`, 140, 20);
  doc.setFontSize(10);
  doc.text(`Date: ${formatDateTime(sale.createdAt)}`, 140, 27);
  doc.text(`Customer: ${sale.customerName || 'Walk-in Customer'}`, 140, 32);
  doc.text(`Payment: ${sale.paymentMethod.toUpperCase()}`, 140, 37);

  autoTable(doc, {
    startY: 45,
    head: [['Product', 'Qty', 'Unit Price', 'Subtotal']],
    body: sale.items.map((i) => [
      i.name,
      String(i.quantity),
      formatCurrency(i.sellingPrice),
      formatCurrency(i.subtotal),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [19, 132, 91] },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(`Total: ${formatCurrency(sale.totalAmount)}`, 140, finalY);

  doc.setFontSize(9);
  doc.setTextColor(140, 140, 140);
  doc.text('Thank you for choosing MediCare Pharmacy.', 14, finalY + 15);

  doc.save(`invoice-${sale.invoiceNumber}.pdf`);
}
