export interface ProfitLossCategorySummary {
  categoryId: string;
  categoryName: string;
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
}

export interface ProfitLossReportDto {
  startDate: string;
  endDate: string;
  outletId: string | null;
  outletName: string;
  grossRevenue: number;
  totalDiscount: number;
  totalTax: number;
  netRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  categoryBreakdown: ProfitLossCategorySummary[];
}
