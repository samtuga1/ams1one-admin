"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, cn, Spinner } from "@heroui/react";
import {
  LuCalendarDays,
  LuMapPin,
  LuScanLine,
  LuTicket,
} from "react-icons/lu";
import EventsService from "@/api/events";
import type { IEvent } from "@/interfaces/events.interface";
import CreateEventModal from "./_components/create-event-modal";
import EventDrawer from "./_components/event-drawer";
import ScanTab from "./_components/scan-tab";
import { usePageAccess } from "@/hooks/use-page-access";

type Tab = "events" | "scanner";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// ─── Events list ──────────────────────────────────────────────────────────────

function EventCard({
  event,
  onManage,
  canManage,
}: {
  event: IEvent;
  onManage: (e: IEvent) => void;
  canManage: boolean;
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-gray-300 transition-colors bg-white">
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-gotham-black text-gray-900 truncate">
            {event.name}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-gotham-bold uppercase shrink-0",
              event.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500",
            )}
          >
            {event.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <LuCalendarDays className="w-3 h-3 shrink-0" />
            {formatDate(event.event_date)}
          </span>
          {event.venue && (
            <span className="flex items-center gap-1 text-xs text-gray-400 truncate max-w-xs">
              <LuMapPin className="w-3 h-3 shrink-0" />
              {event.venue}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-gray-500">
          <LuTicket className="w-4 h-4" />
          <span className="text-sm font-gotham-bold">{event.ticket_count}</span>
          <span className="text-xs text-gray-400">tickets</span>
        </div>
        {canManage && (
          <Button
            size="sm"
            onPress={() => onManage(event)}
            className="text-xs font-gotham-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/15"
          >
            Manage
          </Button>
        )}
      </div>
    </div>
  );
}

function EventsList({ canManage }: { canManage: boolean }) {
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["events"],
    queryFn: EventsService.fetchEvents,
  });
  const events = data?.results ?? [];

  return (
    <>
      <div className="flex flex-col gap-3">
        {isPending ? (
          <div className="flex justify-center py-12">
            <Spinner size="md" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <LuCalendarDays className="w-10 h-10" />
            <p className="text-sm">No events yet. Create one to get started.</p>
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onManage={setSelectedEvent}
              canManage={canManage}
            />
          ))
        )}
      </div>

      <EventDrawer
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const { hasPage } = usePageAccess();

  const canList = hasPage("events.list");
  const canCreate = hasPage("events.create");
  const canManage = hasPage("events.detail");
  const canScan = hasPage("events.scan");

  const defaultTab: Tab = canList ? "events" : "scanner";
  const [tab, setTab] = useState<Tab>(defaultTab);

  const showEventTab = canList;
  const showScannerTab = canScan;

  return (
    <div className="flex flex-col px-7 pt-5 pb-5 gap-5 h-full overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <span className="text-sm sm:text-lg font-gotham-black uppercase">
          Events &amp; QR Tickets
        </span>
        <div className="flex items-center gap-2">
          {tab === "events" && canCreate && <CreateEventModal />}
        </div>
      </div>

      {/* Tab switcher — only render the container if at least one tab is visible */}
      {(showEventTab || showScannerTab) && (
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit shrink-0">
          {showEventTab && (
            <button
              onClick={() => setTab("events")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-gotham-bold transition-all",
                tab === "events"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <LuCalendarDays className="w-3.5 h-3.5" />
              Events
            </button>
          )}
          {showScannerTab && (
            <button
              onClick={() => setTab("scanner")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-gotham-bold transition-all",
                tab === "scanner"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <LuScanLine className="w-3.5 h-3.5" />
              Gate Scanner
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {tab === "events" && showEventTab && <EventsList canManage={canManage} />}
      {tab === "scanner" && showScannerTab && <ScanTab />}
    </div>
  );
}
