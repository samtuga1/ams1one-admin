"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminUsersService from "@/api/admin-users";
import type { IActivityLog } from "@/interfaces/admin-users.interface";
import {
  LuLogIn,
  LuUserPlus,
  LuUserCog,
  LuActivity,
} from "react-icons/lu";

const ACTION_META: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  login: {
    label: "Login",
    icon: LuLogIn,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  create_admin: {
    label: "Created Admin",
    icon: LuUserPlus,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  edit_admin: {
    label: "Edited Admin",
    icon: LuUserCog,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
};

const PAGE_SIZE = 20;

function ActivityLogsTab() {
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["admin-users", "activity-logs", page],
    queryFn: () =>
      AdminUsersService.fetchActivityLogs({ page, page_size: PAGE_SIZE }),
  });

  const logs = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-gotham-black">Activity Logs</span>
          {totalCount > 0 && (
            <span className="ml-2 text-xs text-gray-400 font-jura-bold">
              {totalCount} total
            </span>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {isPending ? (
          <div className="flex items-center justify-center py-16">
            <span className="text-xs text-gray-400">Loading…</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <LuActivity className="w-8 h-8 text-gray-300" />
            <span className="text-xs text-gray-400">No activity logs yet.</span>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400 font-jura-bold">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-xs font-gotham-bold px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs font-gotham-bold px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityLogsTab;

const LogRow = ({ log }: { log: IActivityLog }) => {
  const meta = ACTION_META[log.action] ?? {
    label: log.action.replace(/_/g, " "),
    icon: LuActivity,
    color: "text-gray-600",
    bg: "bg-gray-50",
  };
  const Icon = meta.icon;

  const when = new Date(log.created_at);
  const isValid = !Number.isNaN(when.getTime());
  const dateText = isValid
    ? when.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  const timeText = isValid
    ? when.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className={`${meta.bg} rounded-lg p-2 mt-0.5 shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-gotham-bold ${meta.color}`}>
            {meta.label}
          </span>
          <span className="text-xs text-gray-700 truncate">
            {log.description}
          </span>
        </div>
        <span className="text-[0.65rem] text-gray-400 font-jura-bold">
          {log.actor_name ?? log.actor_email}
        </span>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-0.5">
        <span className="text-[0.65rem] text-gray-500 font-jura-bold">
          {dateText}
        </span>
        <span className="text-[0.65rem] text-gray-400 font-jura-bold">
          {timeText}
        </span>
      </div>
    </div>
  );
};
