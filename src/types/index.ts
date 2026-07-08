export interface ProductDTO {
  _id: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  lowStockThreshold: number;
  expiryDate: string;
  supplierName: string;
  batchNumber?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItemDTO {
  product: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  subtotal: number;
}

export interface SaleDTO {
  _id: string;
  invoiceNumber: string;
  items: SaleItemDTO[];
  totalAmount: number;
  totalProfit: number;
  customerName?: string;
  paymentMethod: 'MY CASH' | 'GolisCard' | 'EDAHABPlus' | 'other';
  soldBy: { _id: string; name: string } | string;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalStockUnits: number;
  lowStockCount: number;
  nearExpiryCount: number;
  todaySales: number;
  todayInvoices: number;
  monthSales: number;
  yearSales: number;
  salesTrend: { label: string; sales: number; profit: number }[];
  categoryBreakdown: { category: string; value: number }[];
  lowStockProducts: ProductDTO[];
  nearExpiryProducts: ProductDTO[];
}

export interface ReportSummary {
  period: 'day' | 'month' | 'year' | 'custom';
  startDate: string;
  endDate: string;
  totalSalesAmount: number;
  totalProductsSold: number;
  totalProfit: number;
  totalInvoices: number;
  sales: SaleDTO[];
}
