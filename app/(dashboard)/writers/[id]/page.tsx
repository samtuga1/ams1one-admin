"use client";

import { Avatar, Button, CloseButton, Spinner, Tabs } from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WritersService from "@/api/writers";
import { formatGhs } from "@/utils/currency";
import EditRetailerUserDrawer from "../_components/edit-retailer-user-drawer";
import TopUpTable from "./_components/topup-table";
import SalesTable from "./_components/sales-table";
import WinningsTable from "./_components/winnings-table";
import CashoutTable from "./_components/cashout-table";
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePageAccess } from "@/hooks/use-page-access";
import {
  LuBuilding2,
  LuCalendar,
  LuClock,
  LuHash,
  LuMapPin,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuShieldOff,
  LuSmartphone,
  LuTrendingUp,
  LuWallet,
} from "react-icons/lu";
import Image from "next/image";
import ToastService from "@/utils/toast-service";
import ApiError from "@/utils/api_error";
import type { ElementType } from "react";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusClasses(status: string) {
  const s = status.toLowerCase();
  if (s === "active") return "text-green-700 bg-green-50 border-green-200";
  if (s === "inactive") return "text-red-500 bg-red-50 border-red-200";
  if (s === "suspended")
    return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-gray-500 bg-gray-50 border-gray-200";
}

// ─── Left sidebar row with icon ───────────────────────────────────────────────
function InfoRow({
  icon: Icon,
  iconBg,
  iconColor,
  value,
}: {
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${iconBg} rounded-md p-1 shrink-0`}>
        <Icon className={`w-3 h-3 ${iconColor}`} />
      </div>
      <span className="text-xs text-gray-600 truncate">{value}</span>
    </div>
  );
}

// ─── Gradient stat card ────────────────────────────────────────────────────────
const variantMap = {
  primary: "bg-linear-to-br from-primary to-[#5b4abf]",
  teal: "bg-linear-to-br from-teal-500 to-teal-700",
  orange: "bg-linear-to-br from-[#E17100] to-[#f09a20]",
  indigo: "bg-linear-to-br from-indigo-500 to-indigo-700",
};

function MiniStatCard({
  label,
  value,
  sub,
  variant = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  variant?: keyof typeof variantMap;
}) {
  return (
    <div className={`${variantMap[variant]} rounded-lg px-4 py-4`}>
      <span className="text-[0.6rem] font-gotham-black text-white/70 uppercase tracking-wide block">
        {label}
      </span>
      <div className="font-jura-bold text-base text-white mt-1.5 truncate">
        {value}
      </div>
      {sub && (
        <span className="text-[0.6rem] text-white/60 mt-0.5 font-gotham-bold block truncate">
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function RetailerDetailView() {
  const { hasPage } = usePageAccess();
  const canSeeTopUps = hasPage("writers.topups");
  const canSeeSales = hasPage("writers.sales");
  const canSeeWinnings = hasPage("writers.winnings");
  const canSeeCashouts = hasPage("writers.cashouts");

  const params = useParams();
  const router = useRouter();
  const writerId = typeof params?.id === "string" ? params.id : "";

  const qc = useQueryClient();

  const { data: profile, isPending } = useQuery({
    queryKey: ["writers", "profile", writerId],
    queryFn: () => WritersService.fetchWriterProfile(writerId),
    enabled: !!writerId,
  });

  const isBlocked = profile?.status === "inactive" || profile?.status === "no_use";

  const { mutate: block, isPending: blocking } = useMutation({
    mutationFn: () => WritersService.blockWriter(writerId),
    onSuccess: () => {
      ToastService.success({ text: "Writer blocked successfully." });
      void qc.invalidateQueries({ queryKey: ["writers", "profile", writerId] });
      void qc.invalidateQueries({ queryKey: ["writers", "all"] });
    },
    onError: (err: ApiError) => {
      ToastService.error({ text: err.message ?? "Failed to block writer." });
    },
  });

  const { mutate: unblock, isPending: unblocking } = useMutation({
    mutationFn: () => WritersService.unblockWriter(writerId),
    onSuccess: () => {
      ToastService.success({ text: "Writer unblocked successfully." });
      void qc.invalidateQueries({ queryKey: ["writers", "profile", writerId] });
      void qc.invalidateQueries({ queryKey: ["writers", "all"] });
    },
    onError: (err: ApiError) => {
      ToastService.error({ text: err.message ?? "Failed to unblock writer." });
    },
  });

  if (!writerId) {
    return <div className="p-6 text-sm text-gray-500">Invalid writer id.</div>;
  }

  if (isPending || !profile) {
    return <div className="p-6 text-sm text-gray-500">Loading writer…</div>;
  }

  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <div className="px-7 py-5 pb-10 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 min-w-0">
        <CloseButton
          className="bg-transparent shrink-0"
          onClick={() => router.back()}
        >
          <IoMdArrowRoundBack className="w-[25px] h-[25px] text-black" />
        </CloseButton>
        {profile.photo_url ? (
          <a href={profile.photo_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Avatar size="sm" className="w-12 h-12 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
              <Avatar.Image alt={initial} src={profile.photo_url} />
              <Avatar.Fallback className="bg-primary text-xl font-gotham-bold text-white">
                {initial}
              </Avatar.Fallback>
            </Avatar>
          </a>
        ) : (
          <Avatar size="sm" className="w-12 h-12 shrink-0">
            <Avatar.Fallback className="bg-primary text-xl font-gotham-bold text-white">
              {initial}
            </Avatar.Fallback>
          </Avatar>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-gotham-black text-2xl truncate min-w-0">
              {profile.name}
            </span>
            <EditRetailerUserDrawer writerId={writerId} />
          </div>
          <span className="text-xs text-gray-400 font-jura-bold">
            ID: {String(profile.writer_id)}
          </span>
        </div>

        {/* Block / Unblock */}
        {isBlocked ? (
          <Button
            size="sm"
            isDisabled={unblocking}
            onClick={() => unblock()}
            className="shrink-0 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
          >
            {unblocking ? (
              <Spinner size="sm" color="current" />
            ) : (
              <LuShieldCheck className="w-3.5 h-3.5" />
            )}
            <span className="text-xs font-gotham-bold">
              {unblocking ? "Unblocking…" : "Unblock Account"}
            </span>
          </Button>
        ) : (
          <Button
            size="sm"
            isDisabled={blocking}
            onClick={() => block()}
            className="shrink-0 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100"
          >
            {blocking ? (
              <Spinner size="sm" color="current" />
            ) : (
              <LuShieldOff className="w-3.5 h-3.5" />
            )}
            <span className="text-xs font-gotham-bold">
              {blocking ? "Blocking…" : "Block Account"}
            </span>
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-5 items-start">
        {/* ── Left sidebar ── */}
        <div className="col-span-5 md:col-span-1 space-y-4">
          {/* Contact */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                Contact
              </span>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2.5">
              <InfoRow
                icon={LuBuilding2}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-500"
                value={profile.supervisor_name ?? "—"}
              />
              <InfoRow
                icon={LuPhone}
                iconBg="bg-green-100"
                iconColor="text-green-600"
                value={profile.phone}
              />
              <InfoRow
                icon={LuMail}
                iconBg="bg-blue-100"
                iconColor="text-blue-500"
                value={profile.email || "—"}
              />
              <InfoRow
                icon={LuMapPin}
                iconBg="bg-red-100"
                iconColor="text-red-400"
                value={profile.location_address || "—"}
              />
              <InfoRow
                icon={LuCalendar}
                iconBg="bg-gray-100"
                iconColor="text-gray-500"
                value={`DOB: ${profile.date_of_birth || "—"}`}
              />
              <InfoRow
                icon={LuHash}
                iconBg="bg-gray-100"
                iconColor="text-gray-400"
                value={`Joined ${formatDate(profile.created_at)}`}
              />
            </div>
          </div>

          {/* Status & performance */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                Status
              </span>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2.5">
              <div>
                <span
                  className={`text-[0.65rem] font-gotham-black px-2 py-0.5 rounded-full border capitalize ${statusClasses(profile.status)}`}
                >
                  {profile.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-md p-1">
                    <LuClock className="w-3 h-3 text-gray-500" />
                  </div>
                  <span className="text-xs font-gotham-bold text-gray-600">
                    Days on Task
                  </span>
                </div>
                <span className="text-xs font-jura-bold">
                  {profile.days_on_task}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-md p-1">
                    <LuTrendingUp className="w-3 h-3 text-gray-500" />
                  </div>
                  <span className="text-xs font-gotham-bold text-gray-600">
                    LT Avg. Sale
                  </span>
                </div>
                <span className="text-xs font-jura-bold">
                  {formatGhs(parseFloat(profile.lifetime_avg_sale) || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Wallets */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                Wallets
              </span>
            </div>
            <div className="px-4 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 rounded-md p-1">
                    <LuSmartphone className="w-3 h-3 text-orange-500" />
                  </div>
                  <span className="text-xs font-gotham-bold text-gray-600">
                    Airtime
                  </span>
                </div>
                <span className="text-xs font-jura-bold">
                  USD {profile.airtime_balance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-md p-1">
                    <LuWallet className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-gotham-bold text-gray-600">
                    Claims
                  </span>
                </div>
                <span className="text-xs font-jura-bold">
                  USD {profile.claims_balance}
                </span>
              </div>
            </div>
          </div>

          {/* ID Card */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
                ID Card
              </span>
            </div>
            <div className="p-3">
              {profile.id_card_image_url ? (
                <a
                  href={profile.id_card_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    <Image
                      src={profile.id_card_image_url}
                      alt="ID Card"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <p className="text-[0.6rem] text-gray-400 text-center mt-1.5">
                    Click to view full size
                  </p>
                </a>
              ) : (
                <div className="flex items-center justify-center py-6 text-gray-300">
                  <span className="text-xs">No ID card uploaded</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="col-span-5 md:col-span-4 flex flex-col gap-4 min-w-0">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStatCard
              label="YTD Sales"
              value={formatGhs(parseFloat(String(profile.ytd_sales)) || 0)}
              sub={`This month: ${formatGhs(parseFloat(String(profile.month_sales)) || 0)}`}
              variant="primary"
            />
            <MiniStatCard
              label="YTD Top-Ups"
              value={formatGhs(parseFloat(String(profile.ytd_topups)) || 0)}
              sub={`This month: ${formatGhs(parseFloat(String(profile.month_topups)) || 0)}`}
              variant="teal"
            />
            <MiniStatCard
              label="YTD Winnings"
              value={formatGhs(parseFloat(String(profile.ytd_winnings)) || 0)}
              variant="orange"
            />
            <MiniStatCard
              label="Tier"
              value={profile.tier}
              sub={`Avg Top-Up: ${formatGhs(parseFloat(String(profile.avg_topup)) || 0)}`}
              variant="indigo"
            />
          </div>

          {/* Tabs */}
          <div className="min-w-0 overflow-x-auto">
            <Tabs className="w-full min-w-0" variant="secondary">
              <Tabs.ListContainer className="shrink-0 w-full max-w-full overflow-x-auto overflow-y-hidden md:overflow-visible">
                <Tabs.List
                  aria-label="Writer tabs"
                  className="inline-flex! w-max! whitespace-nowrap"
                >
                  {canSeeTopUps && (
                    <Tabs.Tab
                      id="topups"
                      className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                    >
                      Top-ups
                      <Tabs.Indicator className="bg-black" />
                    </Tabs.Tab>
                  )}
                  {canSeeSales && (
                    <Tabs.Tab
                      id="sales"
                      className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                    >
                      Sales
                      <Tabs.Indicator className="bg-black" />
                    </Tabs.Tab>
                  )}
                  {canSeeWinnings && (
                    <Tabs.Tab
                      id="winnings"
                      className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                    >
                      Winnings
                      <Tabs.Indicator className="bg-black" />
                    </Tabs.Tab>
                  )}
                  {canSeeCashouts && (
                    <Tabs.Tab
                      id="cashout"
                      className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                    >
                      Cashout
                      <Tabs.Indicator className="bg-black" />
                    </Tabs.Tab>
                  )}
                </Tabs.List>
              </Tabs.ListContainer>

              {canSeeTopUps && (
                <Tabs.Panel
                  id="topups"
                  className="md:flex-1 md:min-h-0 min-w-0 w-full"
                >
                  <TopUpTable writerId={writerId} />
                </Tabs.Panel>
              )}
              {canSeeSales && (
                <Tabs.Panel
                  id="sales"
                  className="md:flex-1 md:min-h-0 min-w-0 w-full"
                >
                  <SalesTable writerId={writerId} />
                </Tabs.Panel>
              )}
              {canSeeWinnings && (
                <Tabs.Panel
                  id="winnings"
                  className="md:flex-1 md:min-h-0 min-w-0 w-full"
                >
                  <WinningsTable writerId={writerId} />
                </Tabs.Panel>
              )}
              {canSeeCashouts && (
                <Tabs.Panel
                  id="cashout"
                  className="md:flex-1 md:min-h-0 min-w-0 w-full"
                >
                  <CashoutTable writerId={writerId} />
                </Tabs.Panel>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerDetailView;
