"use client";

import { Avatar, CloseButton, Tabs } from "@heroui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  LuWallet,
  LuArrowDownLeft,
  LuArrowUpRight,
  LuTrophy,
  LuTicket,
  LuPhone,
  LuMail,
  LuCalendar,
} from "react-icons/lu";
import PlayersService, { type PlayerGame } from "@/api/players";
import { formatGhs } from "@/utils/currency";
import TicketsTable from "./_components/tickets-table";
import WinsTable from "./_components/wins-table";
import TransactionsTable from "./_components/transactions-table";
import type { ElementType } from "react";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PlayerDetailView() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const playerId = String(params?.id ?? "");
  const game = (searchParams.get("game") ?? "five-ninety") as PlayerGame;

  const { data, isPending } = useQuery({
    queryKey: ["players", game, playerId, "detail"],
    queryFn: () => PlayersService.fetchPlayerDetail(game, playerId),
    enabled: !!playerId,
  });

  if (!playerId) {
    return <div className="p-6 text-sm text-gray-500">Invalid player id.</div>;
  }

  if (isPending || !data) {
    return <div className="p-6 text-sm text-gray-500">Loading player…</div>;
  }

  const initials = data.full_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const wallet = data.wallet;
  const tc = data.ticket_counts;

  return (
    <div className="px-7 py-5 pb-10 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 min-w-0">
        <CloseButton className="bg-transparent shrink-0" onClick={() => router.back()}>
          <IoMdArrowRoundBack className="w-[25px] h-[25px] text-black" />
        </CloseButton>
        <Avatar size="sm" className="w-12 h-12 shrink-0">
          <Avatar.Image alt="" src="" />
          <Avatar.Fallback className="bg-primary text-xl font-gotham-bold text-white">
            {initials}
          </Avatar.Fallback>
        </Avatar>
        <span className="font-gotham-black text-2xl truncate min-w-0">
          {data.full_name}
        </span>
      </div>

      <div className="grid md:grid-cols-5 gap-5 items-start">
        {/* Left column — info + wallet */}
        <div className="col-span-5 md:col-span-1 space-y-4">
          {/* Contact card */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                Contact
              </span>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 rounded-md p-1 shrink-0">
                  <LuPhone className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-xs font-jura-bold text-gray-700">{data.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 rounded-md p-1 shrink-0">
                  <LuMail className="w-3 h-3 text-blue-500" />
                </div>
                <span className="text-xs text-gray-600 truncate">{data.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 rounded-md p-1 shrink-0">
                  <LuCalendar className="w-3 h-3 text-gray-500" />
                </div>
                <span className="text-xs text-gray-500">Joined {formatDate(data.joined)}</span>
              </div>
            </div>
          </div>

          {/* Wallet card */}
          {wallet && (
            <div className="border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                  Wallet
                </span>
              </div>
              <div className="px-4 py-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 rounded-md p-1">
                      <LuWallet className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs font-gotham-bold text-gray-600">Balance</span>
                  </div>
                  <span className="text-xs font-jura-bold">
                    {formatGhs(parseFloat(wallet.balance))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 rounded-md p-1">
                      <LuArrowDownLeft className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-xs font-gotham-bold text-gray-600">Deposited</span>
                  </div>
                  <span className="text-xs font-jura-bold">
                    {formatGhs(parseFloat(wallet.total_deposited))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-teal-100 rounded-md p-1">
                      <LuTrophy className="w-3 h-3 text-teal-600" />
                    </div>
                    <span className="text-xs font-gotham-bold text-gray-600">Won</span>
                  </div>
                  <span className="text-xs font-jura-bold text-teal-700">
                    {formatGhs(parseFloat(wallet.total_won))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-red-100 rounded-md p-1">
                      <LuArrowUpRight className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-xs font-gotham-bold text-gray-600">Withdrawn</span>
                  </div>
                  <span className="text-xs font-jura-bold text-red-500">
                    {formatGhs(parseFloat(wallet.total_withdrawn))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ticket counts */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                Ticket Status
              </span>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2">
              {(
                [
                  { label: "Active", key: "active", color: "text-blue-600" },
                  { label: "Won", key: "won", color: "text-green-600" },
                  { label: "Lost", key: "lost", color: "text-red-500" },
                  { label: "Claimed", key: "claimed", color: "text-teal-600" },
                  { label: "Cancelled", key: "cancelled", color: "text-gray-500" },
                  { label: "Expired", key: "expired", color: "text-gray-400" },
                ] as { label: string; key: keyof typeof tc; color: string }[]
              ).map(({ label, key, color }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-md p-1">
                      <LuTicket className="w-3 h-3 text-gray-500" />
                    </div>
                    <span className="text-xs font-gotham-bold text-gray-600">{label}</span>
                  </div>
                  <span className={`text-xs font-jura-bold ${color}`}>{tc[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — summary cards + tabs */}
        <div className="col-span-5 md:col-span-4 flex flex-col gap-4 min-w-0">
          {wallet && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MiniStatCard icon={LuWallet} label="Balance" value={formatGhs(parseFloat(wallet.balance))} variant="primary" />
              <MiniStatCard icon={LuArrowDownLeft} label="Total Deposited" value={formatGhs(parseFloat(wallet.total_deposited))} variant="teal" />
              <MiniStatCard icon={LuTrophy} label="Total Won" value={formatGhs(parseFloat(wallet.total_won))} variant="orange" />
              <MiniStatCard icon={LuArrowUpRight} label="Total Withdrawn" value={formatGhs(parseFloat(wallet.total_withdrawn))} variant="indigo" />
            </div>
          )}

          <div className="min-w-0 overflow-x-auto">
            <Tabs
              className="w-full min-w-0"
              variant="secondary"
            >
              <Tabs.ListContainer className="shrink-0 w-full max-w-full overflow-x-auto overflow-y-hidden md:overflow-visible">
                <Tabs.List aria-label="Player tabs" className="inline-flex! w-max! whitespace-nowrap">
                  <Tabs.Tab id="tickets" className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!">
                    Tickets
                    <Tabs.Indicator className="bg-black" />
                  </Tabs.Tab>
                  <Tabs.Tab id="wins" className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!">
                    Wins
                    <Tabs.Indicator className="bg-black" />
                  </Tabs.Tab>
                  <Tabs.Tab id="transactions" className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!">
                    Transactions
                    <Tabs.Indicator className="bg-black" />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel id="tickets" className="md:flex-1 md:min-h-0 min-w-0 w-full">
                <TicketsTable game={game} playerId={playerId} />
              </Tabs.Panel>
              <Tabs.Panel id="wins" className="md:flex-1 md:min-h-0 min-w-0 w-full">
                <WinsTable game={game} playerId={playerId} />
              </Tabs.Panel>
              <Tabs.Panel id="transactions" className="md:flex-1 md:min-h-0 min-w-0 w-full">
                <TransactionsTable game={game} playerId={playerId} />
              </Tabs.Panel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense>
      <PlayerDetailView />
    </Suspense>
  );
}

const variantMap = {
  primary: "bg-linear-to-br from-primary to-[#5b4abf]",
  teal: "bg-linear-to-br from-teal-500 to-teal-700",
  orange: "bg-linear-to-br from-[#E17100] to-[#f09a20]",
  indigo: "bg-linear-to-br from-indigo-500 to-indigo-700",
};

const MiniStatCard = ({
  icon: Icon,
  label,
  value,
  variant = "primary",
}: {
  icon: ElementType;
  label: string;
  value: string;
  variant?: keyof typeof variantMap;
}) => (
  <div className="border rounded-lg overflow-hidden">
    <div className={`${variantMap[variant]} px-4 py-4`}>
      <div className="flex items-center justify-between">
        <span className="text-[0.6rem] font-gotham-black text-white/70 uppercase tracking-wide">
          {label}
        </span>
        <div className="bg-white/20 rounded-lg p-1.5">
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="font-jura-bold text-base text-white mt-2 truncate">{value}</div>
    </div>
  </div>
);
