"use client";

import { Avatar, Button, Popover } from "@heroui/react";
import { Suspense } from "react";
import FilterRetailers from "./_components/filter-retailers";
import CustomTable, { TableRow } from "@/components/custom-table";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewRetailerDrawer from "./_components/new-retailer-drawer";
import DeviceMapDrawer from "./_components/device-map-drawer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import WritersService from "@/api/writers";
import { formatGhs } from "@/utils/currency";
import { usePageAccess } from "@/hooks/use-page-access";
import {
  LuMap,
  LuChevronDown,
  LuShieldOff,
  LuShieldCheck,
} from "react-icons/lu";
import ToastService from "@/utils/toast-service";
import ApiError from "@/utils/api_error";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusClass(status: string) {
  const s = status.toLowerCase();
  if (s === "active") return "border-green-600 text-green-700";
  if (s === "no_use" || s === "no use")
    return "border-[#E74C3D] text-[#E74C3D]";
  return "border-gray-400 text-gray-600";
}

function WriterActionMenu({
  writerId,
  status,
  onDone,
}: {
  writerId: string;
  status: string;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const isBlocked = status === "inactive" || status === "no_use";

  const { mutate: block, isPending: blocking } = useMutation({
    mutationFn: () => WritersService.blockWriter(writerId),
    onSuccess: () => {
      ToastService.success({ text: "Writer blocked successfully." });
      void qc.invalidateQueries({ queryKey: ["writers", "all"] });
      setOpen(false);
      onDone();
    },
    onError: (err: ApiError) => {
      ToastService.error({ text: err.message ?? "Failed to block writer." });
    },
  });

  const { mutate: unblock, isPending: unblocking } = useMutation({
    mutationFn: () => WritersService.unblockWriter(writerId),
    onSuccess: () => {
      ToastService.success({ text: "Writer unblocked successfully." });
      void qc.invalidateQueries({ queryKey: ["writers", "all"] });
      setOpen(false);
      onDone();
    },
    onError: (err: ApiError) => {
      ToastService.error({ text: err.message ?? "Failed to unblock writer." });
    },
  });

  const isPending = blocking || unblocking;

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
        >
          <span className="text-[10px] font-gotham-bold">Actions</span>
          <LuChevronDown className="w-3 h-3" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="rounded-lg shadow-lg border border-gray-100 w-40 p-1">
        <Popover.Dialog className="p-0">
          {isBlocked ? (
            <button
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                unblock();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md text-xs text-green-600 hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LuShieldCheck className="w-3.5 h-3.5 shrink-0" />
              {unblocking ? "Unblocking…" : "Unblock Writer"}
            </button>
          ) : (
            <button
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                block();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md text-xs text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <LuShieldOff className="w-3.5 h-3.5 shrink-0" />
              {blocking ? "Blocking…" : "Block Writer"}
            </button>
          )}
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

function RetailersView() {
  const { hasPage } = usePageAccess();
  const canRegister = hasPage("writers.register");
  const canViewProfile = hasPage("writers.profile");

  const [mapOpen, setMapOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(20);
  const searchParams = useSearchParams();
  const router = useRouter();

  const nameParam = searchParams.get("name") ?? "";
  const phoneParam = searchParams.get("phone") ?? "";
  const search = [nameParam, phoneParam].filter(Boolean).join(" ").trim();

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["writers", "all", currentPage, currentPageSize, search],
    queryFn: () =>
      WritersService.fetchAllWriters({
        page: currentPage,
        page_size: currentPageSize,
        search: search || undefined,
      }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    void column;
    void direction;
  };

  const rows = data?.results ?? [];

  const handleRowClick = (_row: TableRow, index: number) => {
    if (!canViewProfile) return;
    const w = rows[index];
    if (w) router.push(`/writers/${w.id}`);
  };
  const pagination = data
    ? {
        pageNumber: currentPage,
        pageSize: currentPageSize,
        totalCount: data.count,
      }
    : { pageNumber: 1, pageSize: currentPageSize, totalCount: 0 };

  const tableData: TableRow[] = rows.map((w) => {
    const initial = w.name
      .split(" ")
      .map((i) => i.charAt(0))
      .join("");

    const ytdSales = parseFloat(w.ytd_sales);
    const ytdTop = parseFloat(w.ytd_topups);
    return {
      id: <span className="text-xs font-jura-medium">{w.writer_id}</span>,
      name: (
        <div className="text-xs flex items-center gap-x-2">
          <Avatar size="sm">
            <Avatar.Image alt={initial} src={w.photo_url ?? ""} />
            <Avatar.Fallback className="bg-primary text-sm font-gotham-bold text-white">
              {initial}
            </Avatar.Fallback>
          </Avatar>
          {w.name}
        </div>
      ),
      contact: <span className="text-sm font-jura-bold">{w.phone}</span>,
      signUpDate: formatDate(w.created_at),
      dop: <span className="text-sm font-jura-bold">{w.days_on_task}</span>,
      dot: <span className="text-sm font-jura-bold">{w.days_on_task}</span>,
      ytdSales: (
        <span className="text-sm font-jura-bold">
          {formatGhs(Number.isFinite(ytdSales) ? ytdSales : 0)}
        </span>
      ),
      ytdTopUps: (
        <span className="text-sm font-jura-bold">
          {formatGhs(Number.isFinite(ytdTop) ? ytdTop : 0)}
        </span>
      ),
      lastTransDate: w.last_transaction ? formatDate(w.last_transaction) : "—",
      status: (
        <div
          className={`rounded-sm text-white ${w.status.includes("inactive") ? "bg-red-600" : "bg-green-600"} font-medium text-center text-xs py-[2px] px-2 ${statusClass(w.status)}`}
        >
          <span className="text-[.6rem] capitalize">
            {w.status.replace(/_/g, " ")}
          </span>
        </div>
      ),
      actions: (
        <div onClick={(e) => e.stopPropagation()}>
          <WriterActionMenu
            writerId={w.id}
            status={w.status}
            onDone={() => {}}
          />
        </div>
      ),
    };
  });

  return (
    <div className="flex flex-col p-5 px-7 pb-10 space-y-5 h-auto sm:h-[calc(110vh-6rem)] sm:overflow-hidden">
      <span className="text-sm sm:text-lg font-gotham-black uppercase">
        {`Retailers & Writers (${data?.count ?? 0})`}
      </span>
      <div className="w-full flex justify-end">
        <div className="space-x-2 items-center flex">
          {/* <Button
          className="rounded-lg bg-transparent border text-black"
          size="md"
          onClick={() => {
            ToastService.info({ text: "Feature not yet available" });
          }}
        >
          <AiOutlineExport className="w-3.5 h-3.5" />
          <span className="text-xs font-gotham-bold">Export Data</span>
        </Button> */}
          <Button
            size="sm"
            onClick={() => setMapOpen(true)}
            className="rounded-lg bg-transparent border border-gray-200 text-gray-700"
          >
            <LuMap className="w-3.5 h-3.5" />
            <span className="text-xs font-gotham-bold">Show Map</span>
          </Button>
          <FilterRetailers onFilterTap={() => setCurrentPage(1)} />
          {canRegister && <NewRetailerDrawer />}
          {/* <SetCreditPromiseDrawer /> */}
        </div>
      </div>

      <DeviceMapDrawer isOpen={mapOpen} onClose={() => setMapOpen(false)} />

      <div className="h-[500px] sm:h-full sm:flex-1 sm:min-h-0 mt-2">
        <div className="h-full overflow-hidden">
          <CustomTable
            columns={[
              { key: "id", label: "ID #", sortable: true },
              { key: "name", label: "Name", sortable: true },
              { key: "contact", label: "Contact", sortable: false },
              { key: "signUpDate", label: "Sign-up Date", sortable: true },
              { key: "dop", label: "DoP", sortable: false },
              { key: "dot", label: "DoT", sortable: false },
              { key: "ytdSales", label: "YTD Sales", sortable: false },
              { key: "ytdTopUps", label: "YTD Top-ups", sortable: false },
              {
                key: "lastTransDate",
                label: "Last Trans Date",
                sortable: false,
              },
              { key: "status", label: "Status", sortable: false },
              { key: "actions", label: "", sortable: false },
            ]}
            data={tableData}
            pagination={pagination}
            pageSize={currentPageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRowClick={handleRowClick}
            onSort={handleSort}
            loading={isPending}
            isRefetching={isFetching}
          />
        </div>
      </div>
    </div>
  );
}

export default function WritersPage() {
  return (
    <Suspense>
      <RetailersView />
    </Suspense>
  );
}
