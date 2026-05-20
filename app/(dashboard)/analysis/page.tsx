"use client";
import WritersPerformace from "./_components/writers-performance";
import { Suspense, useState } from "react";
import { Tabs } from "@heroui/react";
import RetentionRatePerformance from "./_components/rate-performace";
import { usePageAccess } from "@/hooks/use-page-access";

type Tab = "writers" | "rate";

function AnalysisPageView() {
  const { hasAnyPage } = usePageAccess();

  const canSeeWritersPerf = hasAnyPage(
    "analysis.active_writer_daily",
    "analysis.active_writer_daily_download",
    "analysis.top_writers",
    "analysis.topup_stats",
    "analysis.winning_stats",
    "analysis.best_worst",
    "analysis.sales_card",
    "analysis.net_topups_card",
    "analysis.writers_at_work_card",
    "analysis.wins_card",
    "analysis.liquidation_card",
    "analysis.settlements_card",
  );
  const canSeeRatePerf = hasAnyPage("analysis.retention_rate", "analysis.retention_trend");

  const [userSelectedTab, setUserSelectedTab] = useState<Tab>("writers");

  // Derive the active tab — fall back to a permitted tab if the user's
  // selection is no longer accessible (e.g. permissions changed after load).
  const canAccess = (tab: Tab) =>
    (tab === "writers" && canSeeWritersPerf) ||
    (tab === "rate" && canSeeRatePerf);
  const activeTab = canAccess(userSelectedTab)
    ? userSelectedTab
    : canSeeWritersPerf
      ? "writers"
      : "rate";

  return (
    <div className="flex flex-col py-5 px-5 md:px-8">
      <div className="mb-5 shrink-0 sm:max-w-sm">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setUserSelectedTab(key as Tab)}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Analysis view" className="rounded-lg">
              {canSeeWritersPerf && (
                <Tabs.Tab id="writers" className="px-5 py-1.5 text-sm">
                  Writers Performance
                  <Tabs.Indicator className="rounded-md" />
                </Tabs.Tab>
              )}
              {canSeeRatePerf && (
                <Tabs.Tab id="rate" className="px-5 py-1.5 text-sm">
                  Rate Performance
                  <Tabs.Indicator className="rounded-md" />
                </Tabs.Tab>
              )}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>

      {activeTab === "writers" && canSeeWritersPerf && <WritersPerformace />}
      {activeTab === "rate" && canSeeRatePerf && <RetentionRatePerformance />}
    </div>
  );
}

export default function AnalysisPageWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="p-5 px-7 text-sm text-gray-500">Loading analysis…</div>
      }
    >
      <AnalysisPageView />
    </Suspense>
  );
}
