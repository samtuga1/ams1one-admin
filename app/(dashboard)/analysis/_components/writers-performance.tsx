"use client";

import { Avatar, Button, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Axios from "@/api";
import FinancialsService from "@/api/financials";
import WritersService from "@/api/writers";
import { usePageAccess } from "@/hooks/use-page-access";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AiOutlineExport } from "react-icons/ai";
import {
  LuWallet,
  LuTrophy,
  LuTrendingUp,
  LuTrendingDown,
  LuPercent,
  LuMedal,
} from "react-icons/lu";
import type { ElementType } from "react";

function WritersPerformace() {
  const { hasPage } = usePageAccess();
  const canSeeChart = hasPage("analysis.active_writer_daily");
  const canSeeExport = hasPage("analysis.active_writer_daily_download");
  const canSeeTopWriters = hasPage("analysis.top_writers");
  const canSeeTopUpStats = hasPage("analysis.topup_stats");
  const canSeeWinStats = hasPage("analysis.winning_stats");
  const canSeeBestWorst = hasPage("analysis.best_worst");
  const canSeeRetentionRate = hasPage("analysis.retention_rate");

  const [rangeDays, setRangeDays] = useState<30 | 365>(30);

  const { data: topUpStats } = useQuery({
    queryKey: ["financials", "topup-statistics"],
    queryFn: FinancialsService.fetchTopUpStatistics,
  });

  const { data: winStats } = useQuery({
    queryKey: ["financials", "winning-statistics"],
    queryFn: FinancialsService.fetchWinningStatistics,
  });

  const { data: bestWorst } = useQuery({
    queryKey: ["financials", "best-worst-performance"],
    queryFn: FinancialsService.fetchBestWorstPerformance,
  });

  const { data: retention } = useQuery({
    queryKey: ["financials", "retention-rate"],
    queryFn: FinancialsService.fetchRetentionRate,
  });

  const { data: top10 = [] } = useQuery({
    queryKey: ["writers", "top-10"],
    queryFn: () => WritersService.fetchTop10Writers(),
  });

  const { data: activeWriterDaily30 } = useQuery({
    queryKey: ["writers", "active-writer-daily-stats", 30],
    queryFn: () => WritersService.fetchActiveWriterDailyStats(30),
  });

  const { data: activeWriterDaily365 } = useQuery({
    queryKey: ["writers", "active-writer-daily-stats", 365],
    queryFn: () => WritersService.fetchActiveWriterDailyStats(365),
  });

  const activeWriterDaily =
    rangeDays === 30 ? activeWriterDaily30 : activeWriterDaily365;
  const rawChartDays = activeWriterDaily?.days ?? [];
  const downloadUrl = activeWriterDaily?.download_url;

  // For long ranges (1 year) downsample to keep chart readable.
  const chartDays = (() => {
    const maxBars = 60;
    if (rawChartDays.length <= maxBars) return rawChartDays;

    const step = Math.ceil(rawChartDays.length / maxBars);
    const sampled = rawChartDays.filter((_, i) => i % step === 0);
    const last = rawChartDays[rawChartDays.length - 1];
    return last ? [...sampled, last] : sampled;
  })();

  return (
    <div className="flex flex-col space-y-5">
      {(canSeeChart || canSeeTopUpStats || canSeeWinStats || canSeeBestWorst) && (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 gap-4 h-auto">
          {canSeeChart && (
            <div className="col-span-3 border rounded-lg px-5 py-4 flex flex-col md:min-h-[400px]">
              <div className="flex flex-col h-full">
                <div className="md:flex md:justify-between space-y-5 md:space-y-0">
                  <div className="flex-col space-y-2">
                    <div className="text-sm font-gotham-bold">
                      Total Writers vs Active Writers
                    </div>
                    <div className="space-x-4 flex">
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full w-3.5 h-3.5 bg-[#2ECC71]"></div>
                        <span className="text-xs">Deployed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full w-3.5 h-3.5 bg-[#18A2B8]"></div>
                        <span className="text-xs">Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tabs
                      className="min-w-48 flex-wrap"
                      selectedKey={String(rangeDays)}
                      onSelectionChange={(key) => {
                        const next = String(key) === "30" ? 30 : 365;
                        setRangeDays(next);
                      }}
                    >
                      <Tabs.ListContainer>
                        <Tabs.List aria-label="Options" className="rounded-lg">
                          <Tabs.Tab
                            className="px-4 py-1 text-xs font-gotham-bold"
                            id="30"
                          >
                            {"30 days"}
                            <Tabs.Indicator className="rounded-lg" />
                          </Tabs.Tab>
                          <Tabs.Tab
                            className="px-4 py-1 text-xs font-gotham-bold"
                            id="365"
                          >
                            {"1 year"}
                            <Tabs.Indicator className="rounded-lg" />
                          </Tabs.Tab>
                        </Tabs.List>
                      </Tabs.ListContainer>
                    </Tabs>
                    {canSeeExport && (
                      <Button
                        className="rounded-lg bg-primary text-xs font-gotham-bold"
                        size="md"
                        isDisabled={!downloadUrl}
                        onClick={async () => {
                          if (!downloadUrl) return;
                          const response = await Axios({
                            url: downloadUrl,
                            method: "GET",
                            responseType: "blob",
                          });
                          const blob = new Blob([response.data as BlobPart]);
                          const href = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = href;
                          a.download = `writer-activity-${rangeDays}d.csv`;
                          a.click();
                          URL.revokeObjectURL(href);
                        }}
                      >
                        <AiOutlineExport className="w-3.5 h-3.5" />
                        <span className="text-xs font-gotham-bold">Export Data</span>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="w-full mt-5 h-[220px] md:h-auto md:flex-1 md:min-h-0">
                  <ActiveWritersStackedBarChart days={chartDays} />
                </div>
              </div>
            </div>
          )}

          <div className={`${canSeeChart ? "col-span-1" : "col-span-4"} flex flex-col gap-4`}>
            {canSeeTopUpStats && (
              <InfoCard
                variant="primary"
                title="YTD Top-Ups"
                icon={LuWallet}
                totalAmount={topUpStats?.ytd.total ?? "—"}
                lastWeekAmount={topUpStats?.last_week.total ?? "—"}
                lastMonthAmount={topUpStats?.last_month.total ?? "—"}
                last3MonthsAmount={topUpStats?.last_3_months.total ?? "—"}
              />
            )}
            {canSeeWinStats && (
              <InfoCard
                variant="orange"
                title="YTD Winnings"
                icon={LuTrophy}
                totalAmount={winStats?.ytd.total ?? "—"}
                lastWeekAmount={winStats?.last_week.total ?? "—"}
                lastMonthAmount={winStats?.last_month.total ?? "—"}
                last3MonthsAmount={winStats?.last_3_months.total ?? "—"}
              />
            )}
            {canSeeBestWorst && (
              <div className="border rounded-lg overflow-hidden flex-none">
                <div className="px-4 py-3 bg-gray-50 border-b flex items-center gap-2">
                  <LuMedal className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-gotham-black text-xs text-gray-500 uppercase tracking-wide">
                    Best &amp; Worst Performance
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 bg-green-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <LuTrendingUp className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[0.6rem] text-green-600 font-gotham-black uppercase tracking-wide">
                          Best Month
                        </span>
                        <span className="text-xs font-gotham-regular text-gray-600">
                          {bestWorst?.best_month?.month ?? "—"}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-jura-bold text-green-600">
                      {bestWorst?.best_month?.performance ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-red-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <LuTrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[0.6rem] text-red-500 font-gotham-black uppercase tracking-wide">
                          Worst Month
                        </span>
                        <span className="text-xs font-gotham-regular text-gray-600">
                          {bestWorst?.worst_month?.month ?? "—"}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-jura-bold text-red-500">
                      {bestWorst?.worst_month?.performance ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(canSeeTopWriters || canSeeRetentionRate) && (
        <div className="grid md:grid-cols-4 gap-4">
          {canSeeTopWriters && (
            <div className="flex flex-col md:col-span-3 space-y-3">
              <span className="font-gotham-black text-sm text-gray-500 uppercase tracking-wide">
                Top 10 Retailers — Year to Date
              </span>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
                {top10.map((w, index) => {
                  const medalColor =
                    index === 0
                      ? "text-yellow-400"
                      : index === 1
                        ? "text-gray-400"
                        : index === 2
                          ? "text-amber-600"
                          : null;
                  return (
                    <div
                      className="border rounded-lg flex items-center gap-3 px-4 py-3"
                      key={w.writer_id}
                    >
                      {medalColor ? (
                        <LuMedal className={`w-4 h-4 shrink-0 ${medalColor}`} />
                      ) : (
                        <span className="text-xs font-jura-bold text-gray-300 shrink-0 w-4 text-center">
                          {index + 1}
                        </span>
                      )}
                      <Avatar size="lg" className="w-8 h-8 shrink-0">
                        <Avatar.Image alt="" src={w.photo_url ?? ""} />
                        <Avatar.Fallback className="bg-primary text-white text-xs font-gotham-bold">
                          {w.writer_name.charAt(0).toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-jura-bold text-sm truncate text-primary">
                          {w.net_profit.formatted}
                        </span>
                        <span className="font-gotham-black text-[0.6rem] uppercase truncate text-gray-500">
                          {w.writer_name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {canSeeRetentionRate && (
            <div className={`${canSeeTopWriters ? "md:col-span-1" : "md:col-span-4"} border rounded-lg overflow-hidden`}>
              <div className="bg-linear-to-br from-primary to-[#5b4abf] px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6rem] font-gotham-black text-white/70 uppercase tracking-wide">
                    YTD Retention Rate
                  </span>
                  <div className="bg-white/20 rounded-lg p-1.5">
                    <LuPercent className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <p className="text-[0.6rem] text-white/60 mt-0.5">
                  % of net earnings retained after payout
                </p>
              </div>
              <div className="flex items-center justify-center py-8">
                <span className="font-jura-bold text-5xl text-primary">
                  {retention?.retention_rate ?? "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type InfoCardProps = {
  title: string;
  totalAmount: string;
  lastWeekAmount: string;
  lastMonthAmount: string;
  last3MonthsAmount: string;
  variant?: "primary" | "orange";
  icon: ElementType;
};

const InfoCard = ({
  title,
  totalAmount,
  lastWeekAmount,
  lastMonthAmount,
  last3MonthsAmount,
  variant = "primary",
  icon: Icon,
}: InfoCardProps) => {
  const headerBg =
    variant === "orange"
      ? "bg-linear-to-br from-[#E17100] to-[#f09a20]"
      : "bg-linear-to-br from-primary to-[#5b4abf]";

  const rows = [
    { label: "Last Week", value: lastWeekAmount },
    { label: "Last Month", value: lastMonthAmount },
    { label: "Last 3 Months", value: last3MonthsAmount },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className={`${headerBg} px-4 py-4`}>
        <div className="flex items-center justify-between">
          <span className="text-[0.6rem] font-gotham-black text-white/70 uppercase tracking-wide">
            {title}
          </span>
          <div className="bg-white/20 rounded-lg p-1.5">
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="font-jura-bold text-2xl text-white mt-2">
          {totalAmount}
        </div>
      </div>
      <div className="flex flex-col divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center px-4 py-2.5"
          >
            <span className="text-xs text-gray-500 font-gotham-regular">
              {label}
            </span>
            <span className="text-xs font-jura-bold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WritersPerformace;

type ActiveWriterDay = {
  day: string;
  total_writers: number;
  active_writers: number;
};

function formatDayLabel(isoDay: string) {
  const d = new Date(isoDay);
  if (Number.isNaN(d.getTime())) return isoDay;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function ActiveWritersStackedBarChart({ days }: { days: ActiveWriterDay[] }) {
  const deployedColor = "#2ECC71";
  const activeColor = "#18A2B8";
  const gridColor = "#E5E7EB";
  const axisTextColor = "#6B7280";

  if (!days?.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-xs font-gotham-regular text-gray-400">
          Data not available
        </span>
      </div>
    );
  }

  const chartData = days.map((d) => {
    const total = Math.max(0, d.total_writers);
    const active = Math.max(0, d.active_writers);
    const activeClamped = Math.min(active, total);
    const deployedRemainder = Math.max(0, total - activeClamped);
    return {
      day: d.day,
      active: activeClamped,
      deployed: deployedRemainder,
      total,
    };
  });

  const interval =
    days.length <= 12 ? 0 : Math.max(1, Math.floor(days.length / 10));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 45 }}
          barCategoryGap="10%"
          barGap={1}
        >
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="day"
            interval={interval}
            tick={{
              fontSize: 12,
              fill: axisTextColor,
              angle: -45,
              textAnchor: "end",
              dy: 10,
            }}
            tickFormatter={(v) => formatDayLabel(String(v))}
          />
          <YAxis
            domain={[0, "dataMax"]}
            tickLine={false}
            axisLine={false}
            orientation="right"
            tick={{ fontSize: 12, fill: axisTextColor }}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const activeVal = payload.find((p) => p.dataKey === "active")
                ?.value as number | undefined;
              const deployedVal = payload.find((p) => p.dataKey === "deployed")
                ?.value as number | undefined;
              return (
                <div className="bg-white border rounded-lg px-3 py-2 shadow-sm">
                  <div className="text-xs font-gotham-bold text-gray-700">
                    {formatDayLabel(String(label))}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: deployedColor }}
                      />
                      Deployed: {deployedVal ?? 0}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: activeColor }}
                      />
                      Active: {activeVal ?? 0}
                    </span>
                  </div>
                </div>
              );
            }}
          />

          <Bar
            dataKey="deployed"
            name="Deployed"
            stackId="writers"
            fill={deployedColor}
          />
          <Bar
            dataKey="active"
            name="Active"
            stackId="writers"
            fill={activeColor}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
