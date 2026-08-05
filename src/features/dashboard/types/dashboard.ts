export interface SalesTrendItem {
  date: string;
  salesAmount: number;
  transactionCount: number;
}

export interface PaymentMethodDistribution {
  method: string;
  amount: number;
  count: number;
}

export interface ChannelDistribution {
  channel: string;
  amount: number;
  count: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  sku: string;
  qtySold: number;
  totalRevenue: number;
}

export interface OutletSalesComparison {
  outletId: string;
  outletName: string;
  totalSales: number;
  totalTransactions: number;
}

export interface DashboardSummaryDto {
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  grossProfit: number;
  grossMargin: number;
  salesTrend: SalesTrendItem[];
  paymentMethods: PaymentMethodDistribution[];
  salesChannels: ChannelDistribution[];
  topProducts: TopProduct[];
  outletComparisons: OutletSalesComparison[];
}
