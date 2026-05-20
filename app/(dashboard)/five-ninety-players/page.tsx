"use client";

import CustomTable, { TableRow } from "@/components/custom-table";
import { Avatar } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PlayersService from "@/api/players";
import { formatGhs } from "@/utils/currency";
import {
  LuUsers,
  LuActivity,
  LuTicket,
  LuWallet,
} from "react-icons/lu";
import type { ElementType } from "react";
import CustomInputComponent from "@/components/custom-input-component";
import { usePageAccess } from "@/hooks/use-page-access";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const GAME = "five-ninety" as const;

function FiveNinetyPlayersView() {
  const { hasPage } = usePageAccess();
  const canSeeStats = hasPage("players.five_ninety.stats");
  const canSeeDetail = hasPage("players.five_ninety.detail");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data: stats } = useQuery({
    queryKey: ["players", GAME, "stats"],
    queryFn: () => PlayersService.fetchPlayerStats(GAME),
  });

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["players", GAME, "list", currentPage, currentPageSize, search],
    queryFn: () =>
      PlayersService.fetchPlayerList(GAME, {
        page: currentPage,
        page_size: currentPageSize,
        search: search || undefined,
      }),
  });

  const rows = data?.results ?? [];

  const pagination = data
    ? { pageNumber: currentPage, pageSize: currentPageSize, totalCount: data.count }
    : { pageNumber: 1, pageSize: currentPageSize, totalCount: 0 };

  const tableData: TableRow[] = rows.map((p) => {
    const initials = p.full_name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
    return {
      name: (
        <div className="flex items-center gap-2 text-xs">
          <Avatar size="sm">
            <Avatar.Image alt={initials} src="" />
            <Avatar.Fallback className="bg-primary text-sm font-gotham-bold text-white">
              {initials}
            </Avatar.Fallback>
          </Avatar>
          {p.full_name}
        </div>
      ),
      phone: <span className="text-sm font-jura-bold">{p.phone}</span>,
      email: <span className="text-xs text-gray-600">{p.email || "—"}</span>,
      balance: (
        <span className="text-sm font-jura-bold">
          {p.wallet ? formatGhs(parseFloat(p.wallet.balance)) : "—"}
        </span>
      ),
      deposited: (
        <span className="text-sm font-jura-bold">
          {p.wallet ? formatGhs(parseFloat(p.wallet.total_deposited)) : "—"}
        </span>
      ),
      won: (
        <span className="text-sm font-jura-bold">
          {p.wallet ? formatGhs(parseFloat(p.wallet.total_won)) : "—"}
        </span>
      ),
      joined: formatDate(p.joined),
    };
  });

  const wt = stats?.wallet_totals;

  return (
    <div className="flex flex-col px-7 pt-5 pb-5 gap-4 md:h-full md:overflow-hidden">
      <span className="text-sm sm:text-lg font-gotham-black uppercase shrink-0">
        5/90 Players
      </span>

      <div className="flex flex-col gap-4 h-full">
        {canSeeStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            <StatCard
              icon={LuUsers}
              label="Total Players"
              value={stats?.total_players?.toLocaleString() ?? "—"}
              variant="primary"
            />
            <StatCard
              icon={LuActivity}
              label="Active Today"
              value={stats?.active_today?.toLocaleString() ?? "—"}
              variant="teal"
            />
            <StatCard
              icon={LuTicket}
              label="Tickets Today"
              value={stats?.tickets_today?.toLocaleString() ?? "—"}
              variant="orange"
            />
            <StatCard
              icon={LuWallet}
              label="Total Balance"
              value={wt ? formatGhs(parseFloat(wt.total_balance)) : "—"}
              variant="indigo"
            />
          </div>
        )}

        <div className="flex justify-between items-center shrink-0">
          <span className="text-xs text-gray-400">
            {data ? `${data.count} players` : ""}
          </span>
          <div className="w-64">
            <CustomInputComponent
              label="Search players"
              showLabel={false}
              placeholder="Search by name or phone…"
              showPreficIcon={false}
              className="p-0 border rounded-lg border-gray-300"
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="h-[500px] md:flex-1 md:min-h-0 overflow-hidden">
          <div className="h-full overflow-hidden">
            <CustomTable
              columns={[
                { key: "name", label: "Name", sortable: false },
                { key: "phone", label: "Phone", sortable: false },
                { key: "email", label: "Email", sortable: false },
                { key: "balance", label: "Balance", sortable: false },
                { key: "deposited", label: "Total Deposited", sortable: false },
                { key: "won", label: "Total Won", sortable: false },
                { key: "joined", label: "Joined", sortable: false },
              ]}
              data={tableData}
              pagination={pagination}
              pageSize={currentPageSize}
              onPageChange={(p) => setCurrentPage(p)}
              onPageSizeChange={() => {}}
              onRowClick={(_row, index) => {
                if (!canSeeDetail) return;
                const p = rows[index];
                if (p) router.push(`/players/${p.id}?game=${GAME}`);
              }}
              onSort={() => {}}
              loading={isPending}
              isRefetching={isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiveNinetyPlayersView;

const variantMap = {
  primary: { bg: "bg-linear-to-br from-primary to-[#5b4abf]" },
  teal: { bg: "bg-linear-to-br from-teal-500 to-teal-700" },
  orange: { bg: "bg-linear-to-br from-[#E17100] to-[#f09a20]" },
  indigo: { bg: "bg-linear-to-br from-indigo-500 to-indigo-700" },
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  variant = "primary",
}: {
  icon: ElementType;
  label: string;
  value: string;
  variant?: keyof typeof variantMap;
}) => {
  const { bg } = variantMap[variant];
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className={`${bg} px-4 py-4`}>
        <div className="flex items-center justify-between">
          <span className="text-[0.6rem] font-gotham-black text-white/70 uppercase tracking-wide">
            {label}
          </span>
          <div className="bg-white/20 rounded-lg p-1.5">
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="font-jura-bold text-xl text-white mt-2">{value}</div>
      </div>
    </div>
  );
};
