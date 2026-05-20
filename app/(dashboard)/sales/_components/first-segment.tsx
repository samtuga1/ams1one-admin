"use client";

import CustomTable, { TableRow } from "@/components/custom-table";
import { useMemo, useState } from "react";
import { CloseButton, Popover, Separator } from "@heroui/react";
import CustomCheckboxItem from "@/components/custom-checkbox";
import { IoMdMore } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import SalesService from "@/api/sales";
import GamesService from "@/api/games";
import { formatGhs, parseStakeAmount } from "@/utils/currency";
import { IDetailedTicket } from "@/interfaces/sales.interface";
import { usePageAccess } from "@/hooks/use-page-access";

function formatTime(isoDateTime: string) {
  const normalized = isoDateTime.includes("T")
    ? isoDateTime
    : isoDateTime.replace(" ", "T");
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return isoDateTime;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function ticketMatchesGameFilter(
  ticket: IDetailedTicket,
  selected: Record<string, boolean>,
): boolean {
  // Treat missing keys as "selected" by default.
  const selectedCodes = Object.keys(selected).filter(
    (c) => selected[c] === true,
  );
  const unselectedCodes = Object.keys(selected).filter(
    (c) => selected[c] === false,
  );

  // If the user hasn't explicitly unchecked anything, don't filter.
  if (selectedCodes.length === 0 && unselectedCodes.length === 0) return true;

  // If the user explicitly unchecked something, apply filtering using default=true for missing.
  return ticket.stakes.some((s) => selected[s.game.code] ?? true);
}

function FirstSalesSegment() {
  const { hasPage } = usePageAccess();
  const canSeeSalesCard = hasPage("sales.today_sales");
  const canSeeGameTypes = hasPage("sales.game_types");
  const canSeeTickets = hasPage("sales.detailed_tickets");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [gameSelected, setGameSelected] = useState<Record<string, boolean>>({});

  const { data: todaySales, isPending: salesPending } = useQuery({
    queryKey: ["sales", "today"],
    queryFn: SalesService.fetchTodaySales,
  });

  const { data: gameTypes = [], isPending: gamesPending } = useQuery({
    queryKey: ["games", "types"],
    queryFn: () => GamesService.fetchGameTypes({ is_active: true }),
  });

  const { data: ticketsResp, isPending: ticketsPending } = useQuery({
    queryKey: ["sales", "detailed-tickets", currentPage, currentPageSize],
    queryFn: () =>
      SalesService.fetchDetailedTickets({
        page: currentPage,
        page_size: currentPageSize,
      }),
  });

  const tickets = useMemo(
    () => ticketsResp?.results ?? [],
    [ticketsResp?.results],
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => ticketMatchesGameFilter(t, gameSelected));
  }, [tickets, gameSelected]);

  const pagination = useMemo(
    () => ({
      pageNumber: currentPage,
      pageSize: currentPageSize,
      totalCount: ticketsResp?.count ?? filteredTickets.length,
    }),
    [currentPage, currentPageSize, ticketsResp?.count, filteredTickets.length],
  );

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

  const loading = salesPending || gamesPending || ticketsPending;
  const headerAmount = todaySales ? formatGhs(todaySales.total_sales) : "—";
  const ticketLine = todaySales
    ? `${todaySales.ticket_count.toLocaleString("en-US")} tickets`
    : "—";

  const tableData: TableRow[] = filteredTickets.map((ticket) => {
    const first = ticket.stakes[0];
    return {
      ticket: (
        <div className="flex flex-col items-start space-y-1">
          <span>{ticket.ticket_no}</span>
          <span className="text-[10px] font-gotham-black text-gray-400">
            {first?.writer?.name ?? "—"}
          </span>
        </div>
      ),
      play: ticket.play_group || first?.play || "—",
      stakes: String(ticket.total_stake ?? ticket.stakes.length ?? 0),
      amount: (
        <span className="font-jura-bold text-sm">
          {formatGhs(parseStakeAmount(ticket.total_stake_amount))}
        </span>
      ),
      time: (
        <div className="flex space-x-2 items-center">
          <span className="font-jura-bold text-sm">
            {formatTime(ticket.time)}
          </span>
          <Popover>
            <CloseButton className="bg-transparent">
              <IoMdMore size={30} />
            </CloseButton>
            <Popover.Content
              className="rounded-lg shadow-sm border w-full sm:max-w-lg"
              placement="bottom right"
            >
              <Popover.Dialog className="w-full p-0">
                <div className="space-y-5 max-h-72 overflow-y-auto custom-scrollbar py-5">
                  {ticket.stakes.map((stake, index) => {
                    const nums = stake.numbers.split(",").map((n) => n.trim());
                    const isLast = index === ticket.stakes.length - 1;
                    return (
                      <div key={stake.stake_id}>
                        <div className="flex flex-row justify-between items-center w-full px-5 gap-2">
                          <div className="flex flex-col items-start space-y-1 min-w-0">
                            <span className="text-[12px] truncate">
                              {stake.writer?.name}
                            </span>
                            <span className="text-[10px] font-gotham-medium text-gray-500">
                              {stake.writer?.phone}
                            </span>
                          </div>
                          <span className="text-[12px] shrink-0">
                            {stake.play}
                          </span>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="flex flex-wrap gap-1 justify-start">
                              {nums.map((num, ni) => (
                                <div
                                  key={ni}
                                  className="bg-primary text-white font-jura-bold text-xs h-[24px] flex justify-center items-center w-[24px] text-center rounded-sm"
                                >
                                  {num}
                                </div>
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-600">
                              {stake.game?.name}
                            </span>
                          </div>
                          <span className="text-xs font-jura-bold shrink-0">
                            {formatGhs(parseStakeAmount(stake.stake_amount))}
                          </span>
                          <span className="text-xs font-jura-bold shrink-0">
                            {formatTime(stake.created_at)}
                          </span>
                        </div>
                        {!isLast && <Separator className="w-full mt-5" />}
                      </div>
                    );
                  })}
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        </div>
      ),
    };
  });

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <div className="flex flex-col shrink-0 gap-2">
        {/* Colorful sales summary */}
        {canSeeSalesCard && (
          <div className="bg-linear-to-br from-primary to-[#5b4abf] rounded-lg px-5 py-4">
            <div className="flex flex-col text-white">
              <span className="text-[0.65rem] font-gotham-bold text-white/70 uppercase tracking-wide">
                Today&apos;s total sales
              </span>
              <span className="font-jura-bold text-2xl">{headerAmount}</span>
              <span className="text-[0.65rem] text-white/70">
                {"from "}
                <span className="font-gotham-bold text-white">
                  {ticketLine}
                </span>
              </span>
            </div>
          </div>
        )}
        {/* Game filter row */}
        {canSeeGameTypes && (
          <div className="flex justify-end">
            <div className="border rounded-lg bg-gray-50 px-3 py-2.5 flex flex-wrap gap-2">
              {gameTypes.map((g) => (
                <CustomCheckboxItem
                  key={g.code}
                  selected={gameSelected[g.code] ?? true}
                  label={g.name}
                  setIsSelected={(v) =>
                    setGameSelected((prev) => ({ ...prev, [g.code]: v }))
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {canSeeTickets && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full">
            <CustomTable
              columns={[
                { key: "ticket", label: "Ticket #", sortable: true },
                { key: "play", label: "Play", sortable: true },
                { key: "stakes", label: "Stakes", sortable: false },
                { key: "amount", label: "Amount", sortable: true },
                { key: "time", label: "Time", sortable: false },
              ]}
              data={tableData}
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
        </div>
      )}
    </div>
  );
}

export default FirstSalesSegment;
