"use client";

import { Tabs } from "@heroui/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import FirstSalesSegment from "./_components/first-segment";
import SecondSalesSegment from "./_components/second-segment";
import ThirdSalesSegment from "./_components/third-segment";
import { usePageAccess } from "@/hooks/use-page-access";

type Tab = "tickets" | "writers" | "winnings";
const VALID_TABS: Tab[] = ["tickets", "writers", "winnings"];

function SalesPageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hasAnyPage } = usePageAccess();

  const canSeeTickets = hasAnyPage("sales.detailed_tickets", "sales.today_sales");
  const canSeeWriters = hasAnyPage("sales.writer_statistics", "sales.today_topups", "sales.available_float");
  const canSeeWinnings = hasAnyPage("sales.winning_events", "sales.winners_list", "sales.today_wins", "sales.today_claims");

  const rawTab = searchParams.get("tab") ?? "";
  const activeTab: Tab = VALID_TABS.includes(rawTab as Tab) ? (rawTab as Tab) : "tickets";

  const defaultTab: Tab = canSeeTickets ? "tickets" : canSeeWriters ? "writers" : "winnings";
  const isCurrentTabAccessible =
    (activeTab === "tickets" && canSeeTickets) ||
    (activeTab === "writers" && canSeeWriters) ||
    (activeTab === "winnings" && canSeeWinnings);
  const effectiveTab: Tab = isCurrentTabAccessible ? activeTab : defaultTab;

  useEffect(() => {
    if (activeTab !== effectiveTab) {
      router.replace(`${pathname}?tab=${effectiveTab}`);
    }
  }, [activeTab, effectiveTab, router, pathname]);

  const setActiveTab = (tab: Tab) => {
    router.push(`${pathname}?tab=${tab}`);
  };

  return (
    <div className="w-full h-full flex flex-col py-5 px-5 md:px-8">
      <div className="mb-5 shrink-0 sm:max-w-sm">
        <Tabs
          selectedKey={effectiveTab}
          onSelectionChange={(key) => setActiveTab(key as Tab)}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Sales view" className="rounded-lg">
              {canSeeTickets && (
                <Tabs.Tab id="tickets" className="px-5 py-1.5 text-sm">
                  Tickets
                  <Tabs.Indicator className="rounded-md" />
                </Tabs.Tab>
              )}
              {canSeeWriters && (
                <Tabs.Tab id="writers" className="px-5 py-1.5 text-sm">
                  Writers
                  <Tabs.Indicator className="rounded-md" />
                </Tabs.Tab>
              )}
              {canSeeWinnings && (
                <Tabs.Tab id="winnings" className="px-5 py-1.5 text-sm">
                  Winnings
                  <Tabs.Indicator className="rounded-md" />
                </Tabs.Tab>
              )}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {effectiveTab === "tickets" && canSeeTickets && <FirstSalesSegment />}
        {effectiveTab === "writers" && canSeeWriters && <SecondSalesSegment />}
        {effectiveTab === "winnings" && canSeeWinnings && <ThirdSalesSegment />}
      </div>
    </div>
  );
}

export default SalesPageView;
