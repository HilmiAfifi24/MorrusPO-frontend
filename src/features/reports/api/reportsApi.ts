import { apiClient } from "../../../api/client";
import type { ProfitLossReportDto } from "../types/reports";

export function getProfitLossReport(params: {
  outletId?: string;
  startDate: string;
  endDate: string;
}) {
  const query = new URLSearchParams();
  if (params.outletId) {
    query.append("outletId", params.outletId);
  }
  query.append("startDate", params.startDate);
  query.append("endDate", params.endDate);

  return apiClient.get<ProfitLossReportDto>(`/api/reports/profit-loss?${query.toString()}`);
}

export async function exportProfitLossExcel(params: {
  outletId?: string;
  startDate: string;
  endDate: string;
}) {
  const query = new URLSearchParams();
  if (params.outletId) {
    query.append("outletId", params.outletId);
  }
  query.append("startDate", params.startDate);
  query.append("endDate", params.endDate);

  // Since response content-type is text/csv, apiClient handles text and returns a string
  const csvText = await apiClient.get<string>(`/api/reports/profit-loss/export-excel?${query.toString()}`);
  
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  
  const formattedStart = params.startDate.replace(/-/g, "");
  const formattedEnd = params.endDate.replace(/-/g, "");
  link.setAttribute("download", `Laporan_Laba_Rugi_${formattedStart}_${formattedEnd}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
