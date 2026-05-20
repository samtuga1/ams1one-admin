"use client";

import CustomInputComponent from "@/components/custom-input-component";
import CustomTable, { TableRow } from "@/components/custom-table";
import { Avatar, CloseButton } from "@heroui/react";
import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import WritersService from "@/api/writers";
import FinancialsService from "@/api/financials";
import { usePageAccess } from "@/hooks/use-page-access";

function SecondSalesSegment() {
  const { hasPage } = usePageAccess();
  const canSeeTopUp = hasPage("sales.today_topups");
  const canSeeFloat = hasPage("sales.available_float");
  const canSeeWriters = hasPage("sales.writer_statistics");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isPending: statsPending } = useQuery({
    queryKey: ["writers", "statistics"],
    queryFn: WritersService.fetchStatistics,
  });

  const { data: todayTopUp, isPending: topUpPending } = useQuery({
    queryKey: ["writers", "today-topup"],
    queryFn: WritersService.fetchTodayTopUp,
  });

  const { data: availableFloat, isPending: floatPending } = useQuery({
    queryKey: ["writers", "available-float"],
    queryFn: WritersService.fetchAvailableFloat,
  });

  const writers = useMemo(() => stats?.writers ?? [], [stats?.writers]);
  const filteredWriters = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return writers;

    return writers.filter((row) => {
      const name = row.writer.name?.toLowerCase() ?? "";
      const phone = row.writer.contact.phone?.toLowerCase() ?? "";
      const email = row.writer.contact.email?.toLowerCase() ?? "";
      return (
        name.includes(query) || phone.includes(query) || email.includes(query)
      );
    });
  }, [writers, searchTerm]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    return filteredWriters.slice(start, start + currentPageSize);
  }, [filteredWriters, currentPage, currentPageSize]);

  const pagination = useMemo(
    () => ({
      pageNumber: currentPage,
      pageSize: currentPageSize,
      totalCount: filteredWriters.length,
    }),
    [currentPage, currentPageSize, filteredWriters.length],
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

  const { data: writersAtWork } = useQuery({
    queryKey: ["financials", "writers-at-work"],
    queryFn: FinancialsService.fetchWritersAtWorkCard,
  });

  const loading = statsPending || topUpPending || floatPending;

  const tradingCount =
    writersAtWork != null
      ? `${writersAtWork.active_writers} of ${writersAtWork.total_writers}`
      : "—";

  const topUpDisplay = todayTopUp?.total_topup ?? "—";

  const tableData: TableRow[] = paged.map((row) => {
    const initial = row.writer.name.charAt(0).toUpperCase();
    return {
      retailer: (
        <div className="flex items-center space-x-4">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              row.writer.online ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <Avatar size="lg" className="w-8 h-8">
            <Avatar.Image alt="" src={row.writer.profileImage ?? ""} />
            <Avatar.Fallback className="bg-primary text-white text-sm font-gotham-bold">
              {initial}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-1 min-w-0">
            <span className="text-[12px] truncate">{row.writer.name}</span>
            <span className="text-[10px] font-gotham-medium text-gray-500">
              {row.writer.contact.phone}
            </span>
          </div>
        </div>
      ),
      topUp: <span className="font-jura-bold text-sm">{row.topup}</span>,
      sales: <span className="font-jura-bold text-sm">{row.sales}</span>,
    };
  });

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {(canSeeTopUp || canSeeFloat) && (
        <div className="rounded-lg shrink-0 overflow-hidden border">
          {/* Colorful stats row */}
          <div className="grid grid-cols-2">
            {canSeeTopUp && (
              <div className="flex flex-col items-start px-5 py-4 bg-linear-to-br from-primary to-[#5b4abf]">
                <span className="text-[0.65rem] font-gotham-black text-white/70 uppercase tracking-wide">
                  Today&apos;s Top-Up
                </span>
                <span className="font-jura-bold text-xl text-white">
                  {topUpDisplay}
                </span>
              </div>
            )}
            {canSeeFloat && (
              <div className="flex flex-col items-start px-5 py-4 bg-linear-to-br from-[#E17100] to-[#f09a20]">
                <span className="text-[0.65rem] font-gotham-black text-white/70 uppercase tracking-wide">
                  Available Float
                </span>
                <span className="font-jura-bold text-xl text-white">
                  {availableFloat?.available_float ?? "—"}
                </span>
              </div>
            )}
          </div>
          {/* Search row */}
          {canSeeWriters && (
            <div className="border-t bg-gray-50 p-3 flex flex-col gap-2">
              <div>
                <span className="font-jura-bold text-sm">{tradingCount}</span>
                <span className="font-jura-light text-sm">
                  {" retailers trading"}
                </span>
              </div>
              <CustomInputComponent
                className="border-gray-300 py-0 rounded-lg"
                placeholder="Enter retailer's phone number"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                suffixIcon={
                  <CloseButton className="mr-2">
                    <BiSearch className="h-3.5" />
                  </CloseButton>
                }
              />
            </div>
          )}
        </div>
      )}

      {canSeeWriters && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full">
            <CustomTable
              columns={[
                { key: "retailer", label: "Retailer", sortable: true },
                { key: "topUp", label: "Top-Up", sortable: true },
                { key: "sales", label: "Sales", sortable: false },
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

export default SecondSalesSegment;
