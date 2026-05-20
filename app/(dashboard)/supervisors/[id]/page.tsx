"use client";
import { Avatar, CloseButton, Tabs } from "@heroui/react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePageAccess } from "@/hooks/use-page-access";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PieChart, Pie } from "recharts";
import LmcDetailTable from "../_components/supervisor-detail-table";
import ToastService from "@/utils/toast-service";
import {
  LuMapPin,
  LuShoppingBag,
  LuTrendingUp,
  LuTrophy,
  LuUsers,
  LuTablet,
  LuActivity,
  LuPhone,
} from "react-icons/lu";
import { ImBin } from "react-icons/im";
import EditLmcUserDrawer from "../_components/edit-supervisor-user-drawer";
import { useQuery } from "@tanstack/react-query";
import LmcService from "@/api/lmc";
import { ILmcSummary } from "@/interfaces/lmc.interface";
import type { ElementType } from "react";

const formatUSD = (n: number) =>
  `USD ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function LmcDetailView() {
  const { hasPage } = usePageAccess();
  const canSeeSummary = hasPage("supervisors.summary");
  const canSeeTransactions = hasPage("supervisors.transactions");
  const canSeeWritersOverview = hasPage("supervisors.writers_overview");

  const firstTab = canSeeTransactions ? "transactions" : canSeeWritersOverview ? "writers" : "";

  const router = useRouter();
  const params = useParams();
  const lmcId = String(params.id ?? "");
  const [activeTab, setActiveTab] = useState(firstTab);

  const { data: summary } = useQuery<ILmcSummary>({
    queryKey: ["lmc", lmcId, "summary"],
    queryFn: () => LmcService.fetchSummary(lmcId),
    enabled: !!lmcId,
  });

  const s = summary?.summary;
  const info = summary?.supervisor_info;

  const initials = info?.name
    ? info.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "—";

  return (
    <div className="px-7 py-5 pb-10 overflow-x-hidden">
      <div className="flex justify-between items-center mb-5 gap-3 min-w-0">
        <div className="flex gap-3 items-center min-w-0">
          <CloseButton className="bg-transparent shrink-0" onClick={() => router.back()}>
            <IoMdArrowRoundBack className="w-[25px] h-[25px] text-black" />
          </CloseButton>
          <Avatar size="sm" className="w-12 h-12 shrink-0">
            <Avatar.Image alt="" src={""} />
            <Avatar.Fallback className="bg-primary text-xl font-gotham-bold text-white">
              {initials}
            </Avatar.Fallback>
          </Avatar>
          <span className="font-gotham-black text-2xl truncate min-w-0">
            {info?.name ?? "—"}
          </span>
        </div>
        <div className="shrink-0">
          <EditLmcUserDrawer lmcId={lmcId} info={summary?.supervisor_info} />
        </div>
      </div>

      <div className="grid md:grid-cols-5 items-start gap-5">
        <div className="space-y-5 col-span-5 md:col-span-4 min-w-0">
          {canSeeSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TopCard
                icon={LuShoppingBag}
                value={s ? formatUSD(parseFloat(s.ytd_sales)) : "—"}
                label="YTD Sales"
                chartValue={s?.ytd_sales_ratio ?? 0}
                variant="primary"
              />
              <TopCard
                icon={LuTrendingUp}
                value={s ? formatUSD(parseFloat(s.ytd_topups)) : "—"}
                label="YTD Top-Ups"
                chartValue={s?.ytd_topups_ratio ?? 0}
                variant="orange"
              />
              <TopCard
                icon={LuTrophy}
                value={s ? formatUSD(parseFloat(s.ytd_winnings)) : "—"}
                label="YTD Winnings"
                chartValue={s?.ytd_winnings_ratio ?? 0}
                variant="teal"
              />
              <TopCard
                icon={LuUsers}
                value={s ? String(s.writers_count) : "—"}
                label="Writers"
                chartValue={s?.writers_ratio ?? 0}
                variant="indigo"
              />
            </div>
          )}

          <div className="min-w-0 overflow-x-auto">
            <Tabs
              className="w-full min-w-0 mb-2"
              variant="secondary"
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(String(key))}
            >
              <Tabs.ListContainer className="shrink-0 w-full max-w-full overflow-x-auto overflow-y-hidden md:overflow-visible">
                <Tabs.List
                  aria-label="Options"
                  className="inline-flex! w-max! whitespace-nowrap"
                >
                  {canSeeTransactions && (
                    <Tabs.Tab
                      id="transactions"
                      className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                    >
                      Transactions
                      <Tabs.Indicator className="bg-black" />
                    </Tabs.Tab>
                  )}
                  {canSeeWritersOverview && (
                    <Tabs.Tab
                      id="writers"
                      className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                    >
                      Writers
                      <Tabs.Indicator className="bg-black" />
                    </Tabs.Tab>
                  )}
                  {canSeeWritersOverview && (
                    <Tabs.Tab
                      id="agents"
                      className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                    >
                      Agents
                      <Tabs.Indicator className="bg-black" />
                    </Tabs.Tab>
                  )}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>

            {activeTab === "transactions" && canSeeTransactions && (
              <LmcDetailTable
                type="Transactions"
                tabs={["View All", "Commissions", "Top-ups", "Transfers"]}
                lmcId={lmcId}
              />
            )}
            {activeTab === "writers" && canSeeWritersOverview && (
              <LmcDetailTable
                type="Writers"
                tabs={[
                  "View All",
                  "Active",
                  "Passive",
                  "Inactive",
                  "Recover",
                  "No Use",
                ]}
                lmcId={lmcId}
              />
            )}
            {activeTab === "agents" && canSeeWritersOverview && (
              <LmcDetailTable
                type="Agents"
                tabs={["View All", "Active", "Inactive"]}
                lmcId={lmcId}
              />
            )}
          </div>
        </div>

        {canSeeSummary && (
          <div className="col-span-5 md:col-span-1 space-y-4">
            <PrimaryAddressCard
              name={info?.name}
              address={info?.address}
              phone={info?.phone}
            />
            <PosCard
              posIssued={info?.pos_issued ?? 0}
              posTrading={info?.pos_trading ?? 0}
              writersTotal={info?.writers_total ?? 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default LmcDetailView;

const variantStyles = {
  primary: {
    bg: "bg-linear-to-br from-primary to-[#5b4abf]",
    chartColor: "#a78bfa",
  },
  orange: {
    bg: "bg-linear-to-br from-[#E17100] to-[#f09a20]",
    chartColor: "#fcd34d",
  },
  teal: {
    bg: "bg-linear-to-br from-teal-500 to-teal-700",
    chartColor: "#5eead4",
  },
  indigo: {
    bg: "bg-linear-to-br from-indigo-500 to-indigo-700",
    chartColor: "#a5b4fc",
  },
};

const TopCard = ({
  icon: Icon,
  label,
  value,
  chartValue,
  variant = "primary",
}: {
  icon: ElementType;
  label: string;
  value: string;
  chartValue: number;
  variant?: keyof typeof variantStyles;
}) => {
  const { bg, chartColor } = variantStyles[variant];
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className={`${bg} px-4 py-4`}>
        <div className="flex items-start justify-between">
          <span className="text-[0.6rem] font-gotham-black text-white/70 uppercase tracking-wide">
            {label}
          </span>
          <div className="bg-white/20 rounded-lg p-1.5">
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <div className="font-jura-bold text-xl text-white mt-2 leading-tight">
          {value}
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
          Contribution Ratio
        </span>
        <DonutChart value={chartValue} color={chartColor} />
      </div>
    </div>
  );
};

const PrimaryAddressCard = ({
  name,
  address,
  phone,
}: {
  name?: string;
  address?: string;
  phone?: string;
}) => (
  <div className="border rounded-lg overflow-hidden">
    <div className="px-4 py-3 border-b bg-gray-50">
      <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
        Primary Address
      </span>
    </div>
    <div className="px-4 py-3 flex flex-col gap-2.5">
      <div className="flex items-start gap-2">
        <div className="bg-primary/10 rounded-md p-1 mt-0.5 shrink-0">
          <LuUsers className="w-3 h-3 text-primary" />
        </div>
        <span className="text-xs font-gotham-bold text-gray-700">
          {name ?? "—"}
        </span>
      </div>
      <div className="flex items-start gap-2">
        <div className="bg-orange-100 rounded-md p-1 mt-0.5 shrink-0">
          <LuMapPin className="w-3 h-3 text-orange-500" />
        </div>
        <span className="text-xs font-jura-bold text-gray-600">
          {address || "N/A"}
        </span>
      </div>
      <div className="border-t pt-2.5 mt-0.5">
        <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
          Phone Numbers
        </span>
        <div className="mt-2 flex flex-col gap-2">
          {phone ? (
            <div className="flex items-center gap-2">
              <div className="bg-green-100 rounded-md p-1 shrink-0">
                <LuPhone className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs font-jura-bold flex-1 text-gray-700">
                {phone}
              </span>
              <CloseButton
                className="bg-transparent p-1"
                onClick={() =>
                  ToastService.info({ text: "Feature not yet available" })
                }
              >
                <ImBin className="w-3 h-3 text-red-400" />
              </CloseButton>
            </div>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
          <span
            className="text-xs text-primary font-gotham-bold cursor-pointer"
            onClick={() =>
              ToastService.info({ text: "Feature not yet available" })
            }
          >
            + Add New
          </span>
        </div>
      </div>
    </div>
  </div>
);

const PosCard = ({
  posIssued,
  posTrading,
  writersTotal,
}: {
  posIssued: number;
  posTrading: number;
  writersTotal: number;
}) => (
  <div className="border rounded-lg overflow-hidden">
    <div className="px-4 py-3 border-b bg-gray-50">
      <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
        POS Devices
      </span>
    </div>
    <div className="px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 rounded-md p-1">
            <LuTablet className="w-3 h-3 text-purple-600" />
          </div>
          <span className="text-xs font-gotham-bold text-gray-600">Issued</span>
        </div>
        <span className="text-xs font-jura-bold">{posIssued}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-teal-100 rounded-md p-1">
            <LuActivity className="w-3 h-3 text-teal-600" />
          </div>
          <span className="text-xs font-gotham-bold text-gray-600">
            Trading
          </span>
        </div>
        <span className="text-xs font-jura-bold">{posTrading}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 rounded-md p-1">
            <LuUsers className="w-3 h-3 text-indigo-600" />
          </div>
          <span className="text-xs font-gotham-bold text-gray-600">
            Writers
          </span>
        </div>
        <span className="text-xs font-jura-bold">{writersTotal}</span>
      </div>
    </div>
  </div>
);

const DonutChart = ({
  value,
  size = 44,
  color = "#a78bfa",
}: {
  value: number;
  size?: number;
  color?: string;
}) => {
  const progress = Math.min(Math.max(value, 0), 100);
  const data = [
    { value: progress, fill: color },
    { value: 100 - progress, fill: "#e5e7eb" },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart
        width={size}
        height={size}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <Pie
          data={data}
          cx={size / 2}
          cy={size / 2}
          innerRadius={size * 0.32}
          outerRadius={size * 0.48}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          strokeWidth={0}
        />
      </PieChart>
      <span
        className="absolute font-gotham-black text-[10px] text-gray-700"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {progress}%
      </span>
    </div>
  );
};
