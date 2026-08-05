import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../auth/hooks/useAuth";

import { useOutlet } from "../../outlets/hooks/useOutlet";
import { getOutlets } from "../../outlets/api/outletsApi";
import type { OutletDto } from "../../outlets/types/outlet";
import { getDashboardSummary } from "../api/dashboardApi";
import type { DashboardSummaryDto } from "../types/dashboard";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import { AppLoader, InlineAlert } from "../../../components/ui";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const { session } = useAuth();
  const { selectedOutletId, setSelectedOutletId } = useOutlet();
  
  const userRole = session?.role;
  const isPrivileged = userRole === "Owner" || userRole === "Admin" || userRole === "Keuangan";
  const effectiveOutletId = isPrivileged ? selectedOutletId : session?.outletId ?? null;

  const [outlets, setOutlets] = useState<OutletDto[]>([]);
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date Range State
  const [rangeType, setRangeType] = useState<"today" | "7days" | "30days" | "month" | "custom">("30days");
  
  const defaultDates = useMemo(() => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 30);
    return {
      start: start.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    };
  }, []);

  const [customDates, setCustomDates] = useState(defaultDates);

  const activeDates = useMemo(() => {
    const today = new Date();
    let start = new Date();
    switch (rangeType) {
      case "today":
        start = today;
        break;
      case "7days":
        start.setDate(today.getDate() - 7);
        break;
      case "30days":
        start.setDate(today.getDate() - 30);
        break;
      case "month":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "custom":
        return customDates;
    }
    return {
      start: start.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    };
  }, [rangeType, customDates, defaultDates]);

  useEffect(() => {
    if (isPrivileged) {
      getOutlets()
        .then((res) => setOutlets(res))
        .catch(() => {});
    }
  }, [isPrivileged]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDashboardSummary({
        outletId: effectiveOutletId || undefined,
        startDate: activeDates.start,
        endDate: activeDates.end,
      });
      setSummary(result);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Gagal memuat ringkasan dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [effectiveOutletId, activeDates]);

  // Chart 1: Sales Trend Options
  const trendOptions: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["#3C50E0"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: summary?.salesTrend.map((t) => new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })) ?? [],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => formatCurrency(val),
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      x: { format: "dd MMM yyyy" },
      y: { formatter: (val) => formatCurrency(val) },
    },
  };

  const trendSeries = [
    {
      name: "Penjualan",
      data: summary?.salesTrend.map((t) => t.salesAmount) ?? [],
    },
  ];

  // Chart 2: Payment Methods Options
  const paymentOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
    labels: summary?.paymentMethods.map((p) => p.method.toUpperCase()) ?? [],
    legend: {
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Sales",
              formatter: () => formatCurrency(summary?.totalSales ?? 0),
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val) => formatCurrency(val) },
    },
  };

  const paymentSeries = summary?.paymentMethods.map((p) => Number(p.amount)) ?? [];

  // Chart 3: Sales Channels Options
  const channelOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#3C50E0", "#10B981", "#F59E0B", "#EF4444"],
    labels: summary?.salesChannels.map((c) => c.channel.toUpperCase()) ?? [],
    legend: {
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Sales Count",
              formatter: () => summary?.totalTransactions.toString() ?? "0",
            },
          },
        },
      },
    },
  };

  const channelSeries = summary?.salesChannels.map((c) => Number(c.amount)) ?? [];

  return (
    <ProtectedPageShell
      title="Dashboard Bisnis"
      description="Pemantauan kinerja penjualan, laba kotor, metode pembayaran, saluran penjualan, dan produk terlaris secara real-time."
    >
      <InlineAlert tone="error" message={error} />

      {/* FILTER PANEL */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-3">
          {/* Outlet Selector for Privileged Users */}
          {isPrivileged && (
            <div className="min-w-[200px]">
              <select
                value={selectedOutletId ?? ""}
                onChange={(e) => setSelectedOutletId(e.target.value || null)}
                className="h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              >
                <option value="">Semua Outlet</option>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preset Date Range Buttons */}
          <div className="inline-flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-950">
            {(["today", "7days", "30days", "month", "custom"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setRangeType(type)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  rangeType === type
                    ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {type === "today" && "Hari Ini"}
                {type === "7days" && "7 Hari"}
                {type === "30days" && "30 Hari"}
                {type === "month" && "Bulan Ini"}
                {type === "custom" && "Kustom"}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Pickers */}
        {rangeType === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customDates.start}
              onChange={(e) =>
                setCustomDates((c) => ({ ...c, start: e.target.value }))
              }
              className="h-11 rounded-2xl border border-gray-200 px-3 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            />
            <span className="text-gray-400">s/d</span>
            <input
              type="date"
              value={customDates.end}
              onChange={(e) =>
                setCustomDates((c) => ({ ...c, end: e.target.value }))
              }
              className="h-11 rounded-2xl border border-gray-200 px-3 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <AppLoader label="Memuat ringkasan dashboard..." />
      ) : (
        summary && (
          <div className="space-y-6">
            {/* WIDGET CARDS / KPIS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {/* Card 1: Omzet */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Total Omzet
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summary.totalSales)}
                </h3>
              </div>

              {/* Card 2: Jumlah Transaksi */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Total Transaksi
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.totalTransactions.toLocaleString("id-ID")}
                </h3>
              </div>

              {/* Card 3: Rata-rata Belanja */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Average Order Value
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summary.averageOrderValue)}
                </h3>
              </div>

              {/* Card 4: Laba Kotor */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Laba Kotor
                </p>
                <h3 className="mt-2 text-2xl font-bold text-success-700 dark:text-success-300">
                  {formatCurrency(summary.grossProfit)}
                </h3>
              </div>

              {/* Card 5: Margin Laba Kotor */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Margin Laba
                </p>
                <h3 className="mt-2 text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {summary.grossMargin.toFixed(1)}%
                </h3>
              </div>
            </div>

            {/* CHARTS GRID */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Sales Trend Chart */}
              <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Tren Grafik Penjualan
                </h3>
                <Chart options={trendOptions} series={trendSeries} type="area" height={320} />
              </div>

              {/* Payment Method Distribution */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Metode Pembayaran
                </h3>
                {summary.paymentMethods.length === 0 ? (
                  <p className="py-20 text-center text-sm text-gray-500">Tidak ada data transaksi.</p>
                ) : (
                  <Chart options={paymentOptions} series={paymentSeries} type="donut" height={320} />
                )}
              </div>
            </div>

            {/* LOWER GRID: TOP PRODUCTS & OUTLET COMPARISONS / CHANNELS */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Top Products Table */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Produk Terlaris (Top 5)
                </h3>
                {summary.topProducts.length === 0 ? (
                  <p className="py-20 text-center text-sm text-gray-500">Tidak ada produk terlaris.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                      <thead>
                        <tr>
                          {["Produk", "SKU", "Qty Terjual", "Omzet"].map((c) => (
                            <th
                              key={c}
                              className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                            >
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                        {summary.topProducts.map((p) => (
                          <tr key={p.productId}>
                            <td className="py-3.5 text-sm font-medium text-gray-900 dark:text-white">{p.productName}</td>
                            <td className="py-3.5 text-sm text-gray-500">{p.sku}</td>
                            <td className="py-3.5 text-sm font-semibold text-gray-900 dark:text-white">{p.qtySold.toLocaleString("id-ID")}</td>
                            <td className="py-3.5 text-sm font-semibold text-brand-600">{formatCurrency(p.totalRevenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Outlet Comparison (if Privileged & Multi-Outlet mode) or Sales Channels Distribution */}
              {isPrivileged && !effectiveOutletId ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                    Perbandingan Performa Outlet
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                      <thead>
                        <tr>
                          {["Outlet", "Total Penjualan", "Total Transaksi"].map((c) => (
                            <th
                              key={c}
                              className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                            >
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                        {summary.outletComparisons.map((o) => (
                          <tr key={o.outletId}>
                            <td className="py-3.5 text-sm font-medium text-gray-900 dark:text-white">{o.outletName}</td>
                            <td className="py-3.5 text-sm font-semibold text-success-700">{formatCurrency(o.totalSales)}</td>
                            <td className="py-3.5 text-sm text-gray-900 dark:text-white">{o.totalTransactions.toLocaleString("id-ID")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                    Saluran Penjualan (POS vs Online)
                  </h3>
                  {summary.salesChannels.length === 0 ? (
                    <p className="py-20 text-center text-sm text-gray-500">Tidak ada data saluran penjualan.</p>
                  ) : (
                    <Chart options={channelOptions} series={channelSeries} type="donut" height={320} />
                  )}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </ProtectedPageShell>
  );
}
