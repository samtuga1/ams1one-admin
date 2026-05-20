"use client";

import CustomTable from "@/components/custom-table";
import { useState } from "react";
import React from "react";
import DrawDrawer from "./_components/draw-drawer";
import CreateDrawModal from "./_components/create-draw-modal";
import { useQuery } from "@tanstack/react-query";
import FinancialsService from "@/api/financials";
import GamesService from "@/api/games";
import { LuShoppingBag, LuTrophy, LuTrendingUp } from "react-icons/lu";
import type { ElementType } from "react";
import { usePageAccess } from "@/hooks/use-page-access";

function DrawView() {
  const { hasPage, hasAnyPage } = usePageAccess();
  const canCreateDraw = hasAnyPage("autodraw.drawable_today", "autodraw.event");
  const canViewTickets = hasPage("draw.draw_event_tickets");
  const canViewCards = hasPage("draw.draws_winnings_card");
  const canViewTable = hasPage("draw.draws_winnings_table");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [isDrawOpen, setDrawnIsOpen] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(
    null,
  );
  const [drawerMode, setDrawerMode] = React.useState<
    "pre" | "post1" | "post2" | null
  >(null);

  const { data: dash, isPending: dashPending } = useQuery({
    queryKey: ["financials", "draws-and-winnings-dashboard"],
    queryFn: FinancialsService.fetchDrawsAndWinningsDashboard,
  });

  const { data: tableData, isPending: tablePending } = useQuery({
    queryKey: [
      "games",
      "draws-and-winnings-table",
      currentPage,
      currentPageSize,
    ],
    queryFn: () =>
      GamesService.fetchDrawsAndWinningsTable({
        page: currentPage,
        page_size: currentPageSize,
      }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
  };

  const handleRowClick = () => {};

  const handleSort = (column: string, direction: "asc" | "desc") => {
    void column;
    void direction;
  };

  const onPreDrawClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setDrawerMode("pre");
    setDrawnIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawnIsOpen(false);
    setSelectedEventId(null);
    setDrawerMode(null);
  };

  const rows = tableData?.results ?? [];
  const pagination = tableData
    ? {
        pageNumber: currentPage,
        pageSize: currentPageSize,
        totalCount: tableData.count,
      }
    : {
        pageNumber: 1,
        pageSize: currentPageSize,
        totalCount: 0,
      };

  const loading = dashPending || tablePending;

  const ytdSales = dash?.ytd_sales;
  const ytdWin = dash?.ytd_winnings;
  const ytdGgr = dash?.ytd_ggr;
  const ytdPlayers = ytdSales?.unique_players;
  const ytdTickets = ytdSales?.total_tickets;
  const ytdStakes = ytdSales?.total_stakes;

  return (
    <div className="flex flex-col px-7 pt-5 pb-5 gap-3 md:h-full md:overflow-hidden">
      <div className="flex flex-col items-start sm:flex-row space-y-2 sm:space-y-0 justify-between shrink-0">
        <span className="text-sm sm:text-lg transition-all font-gotham-black uppercase">
          DRAWS & WINNINGS
        </span>
        <div className="space-x-2 w-full sm:w-auto">
          {canCreateDraw && <CreateDrawModal />}
        </div>
      </div>

      {canViewCards && <div className="grid md:grid-cols-3 gap-3 shrink-0">
        <Card
          title="YTD Sales"
          amount={ytdSales?.total_sales ?? "—"}
          icon={LuShoppingBag}
          variant="primary"
          rows={[
            {
              label: "Players",
              value:
                ytdPlayers != null ? ytdPlayers.toLocaleString("en-US") : "—",
            },
            {
              label: "Tickets",
              value:
                ytdTickets != null ? ytdTickets.toLocaleString("en-US") : "—",
            },
            {
              label: "Stakes",
              value:
                ytdStakes != null ? ytdStakes.toLocaleString("en-US") : "—",
            },
          ]}
        />
        <Card
          title="YTD Winnings"
          amount={ytdWin?.total_winnings ?? "—"}
          icon={LuTrophy}
          variant="orange"
          rows={[
            { label: "Claimed", value: ytdWin?.claimed ?? "—" },
            { label: "Unclaimed", value: ytdWin?.unclaimed ?? "—" },
          ]}
        />
        <Card
          title="YTD Gross Gaming Revenue"
          amount={ytdGgr?.gross_gaming_revenue ?? "—"}
          icon={LuTrendingUp}
          variant="teal"
          rows={[
            { label: "Retention Rate", value: ytdGgr?.retention_rate ?? "—" },
            { label: "Retention Value", value: ytdGgr?.retention_value ?? "—" },
          ]}
        />
      </div>}

      {canViewTable && <div className="h-[500px] md:flex-1 md:min-h-0 overflow-hidden">
        <div className="h-full overflow-hidden">
          <CustomTable
            columns={[
              { key: "event", label: "Event #", sortable: true },
              { key: "drawDate", label: "Draw Date", sortable: true },
              { key: "eventName", label: "Event Name", sortable: false },
              { key: "drawTime", label: "Draw Time", sortable: true },
              { key: "preDraw", label: "Pre-Draw", sortable: false },
              { key: "drawNumbers", label: "Draw Numbers", sortable: false },
              { key: "payoutRatio", label: "Payout Ratio", sortable: false },
            ]}
            data={
              rows.map((r) => ({
                event: String(r.event_no),
                drawDate: r.draw_date,
                eventName: (
                  <span className="font-gotham-bold text-xs">
                    {r.event_name}
                  </span>
                ),
                drawTime: (
                  <span className="text-sm font-jura-bold">{r.draw_time}</span>
                ),
                preDraw: canViewTickets ? (
                  <span
                    className="text-xs font-jura-bold text-[#505FFF] underline decoration-dashed cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreDrawClick(r.event_id);
                    }}
                  >
                    {r.pre_draw}
                  </span>
                ) : (
                  <span className="text-xs font-jura-bold text-gray-400">{r.pre_draw}</span>
                ),
                drawNumbers: (
                  <div className="flex space-x-2 items-center">
                    {r.draw_numbers.map((n, i) => (
                      <span
                        key={i}
                        className="rounded bg-primary text-white p-1 px-1.5"
                      >
                        {n}
                      </span>
                    ))}
                    {/* <Image
                      src={DrawNumbersIcon}
                      alt="DrawNumbersIcon"
                      className="h-5 w-5"
                    /> */}
                  </div>
                ),
                payoutRatio: (
                  <span className="text-sm font-jura-bold">
                    {r.payout_ratio}
                  </span>
                ),
              })) ?? []
            }
            pagination={pagination}
            pageSize={currentPageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowClick={handleRowClick}
            onSort={handleSort}
            loading={loading}
            isRefetching={false}
          />
        </div>
      </div>}

      <DrawDrawer
        isOpen={isDrawOpen}
        onCloseTap={closeDrawer}
        eventId={selectedEventId}
        drawerMode={drawerMode}
      />
    </div>
  );
}

export default DrawView;

const Card = ({
  title,
  amount,
  icon: Icon,
  variant = "primary",
  rows,
}: {
  title: string;
  amount: string;
  icon: ElementType;
  variant?: "primary" | "orange" | "teal";
  rows: { label: string; value: string }[];
}) => {
  const headerBg =
    variant === "orange"
      ? "bg-linear-to-br from-[#E17100] to-[#f09a20]"
      : variant === "teal"
        ? "bg-linear-to-br from-teal-500 to-teal-700"
        : "bg-linear-to-br from-primary to-[#5b4abf]";

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
        <div className="font-jura-bold text-2xl text-white mt-2">{amount}</div>
      </div>
      <div className="flex flex-col divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center px-4 py-2.5"
          >
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-jura-bold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
