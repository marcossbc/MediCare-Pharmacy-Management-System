import * as XLSX from 'xlsx';
import { formatDate } from '@/lib/utils';
import { ReportSummary } from '@/types';

export function exportReportToExcel(report: ReportSummary) {
  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: 'Period', Value: report.period },
    { Metric: 'Start Date', Value: formatDate(report.startDate) },
    { Metric: 'End Date', Value: formatDate(report.endDate) },
    { Metric: 'Total Sales Amount', Value: report.totalSalesAmount },
    { Metric: 'Total Profit', Value: report.totalProfit },
    { Metric: 'Total Products Sold', Value: report.totalProductsSold },
    { Metric: 'Total Invoices', Value: report.totalInvoices },
  ]);

  const salesRows = report.sales.map((s) => ({
    'Invoice #': s.invoiceNumber,
    Date: formatDate(s.createdAt),
    Customer: s.customerName || 'Walk-in Customer',
    'Payment Method': s.paymentMethod,
    'Items Sold': s.items.reduce((sum, i) => sum + i.quantity, 0),
    'Total Amount': s.totalAmount,
    Profit: s.totalProfit,
  }));
  const salesSheet = XLSX.utils.json_to_sheet(salesRows);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  XLSX.utils.book_append_sheet(workbook, salesSheet, 'Sales');

  XLSX.writeFile(
    workbook,
    `sales-report-${report.period}-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

export function exportProductsToExcel(products: any[]) {
  const rows = products.map((p) => ({
    Name: p.name,
    Category: p.category,
    'Purchase Price': p.purchasePrice,
    'Selling Price': p.sellingPrice,
    Quantity: p.quantity,
    'Low Stock Threshold': p.lowStockThreshold,
    'Expiry Date': formatDate(p.expiryDate),
    Supplier: p.supplierName,
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Products');
  XLSX.writeFile(workbook, `products-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
