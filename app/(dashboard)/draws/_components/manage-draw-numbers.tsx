"use client";

import {
  AlertDialog,
  Button,
  CloseButton,
  Drawer,
  Spinner,
} from "@heroui/react";
import { useState } from "react";
import { RiCheckLine, RiCloseCircleLine } from "react-icons/ri";
import { LuCalendar, LuUser } from "react-icons/lu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GamesService from "@/api/games";
import { IPendingApproval } from "@/interfaces/games.interface";
import ToastService from "@/utils/toast-service";
import React from "react";
import CustomSelectComponent from "@/components/custom-select-component";
import ApiError from "@/utils/api_error";

type PendingAction = {
  type: "confirm" | "reject";
  item: IPendingApproval;
};

const today = new Date().toISOString().split("T")[0];

function ManageDrawDrawer({
  isOpen,
  onCloseTap,
}: {
  isOpen: boolean;
  onCloseTap: () => void;
}) {
  const [selectedEventId, setSelectedEventId] = React.useState<string>("");
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const queryClient = useQueryClient();

  const { data: eventsData, isPending: eventsPending } = useQuery({
    queryKey: ["games", "events-list", today],
    queryFn: () =>
      GamesService.fetchDrawEvents({ page_size: 100, draw_date: today }),
    enabled: isOpen,
  });

  const eventOptions = React.useMemo(() => {
    const mapped = (eventsData?.results ?? []).map((e) => {
      const name =
        e.event_name ?? e.name ?? e.game_type_name ?? e.game_type?.name ?? "—";
      const date = e.draw_date
        ? new Date(e.draw_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—";
      return {
        key: e.event_id ?? e.id,
        label: `#${e.event_no} — ${name} (${date})`,
      };
    });
    return [{ key: "allEvents", label: "All Events" }, ...mapped];
  }, [eventsData]);

  const { data, isFetching } = useQuery({
    queryKey: ["pending-approvals"],
    queryFn: GamesService.fetchPendingApprovals,
    enabled: isOpen,
  });

  const { mutate: executeAction, isPending: isActing } = useMutation({
    mutationFn: async (action: PendingAction) => {
      if (action.type === "confirm") {
        await GamesService.confirmDrawResult(action.item.confirm_url);
      } else {
        await GamesService.rejectDrawResult(action.item.reject_url);
      }
    },
    onSuccess: (_, action) => {
      ToastService.success({
        text:
          action.type === "confirm"
            ? "Draw result confirmed successfully."
            : "Draw result rejected.",
      });
      setPendingAction(null);
      queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
    },
    onError: (error: ApiError) => {
      ToastService.error({
        text: error?.message ?? "Action failed. Please try again.",
      });
    },
  });

  const allPending = data?.pending ?? [];
  const filteredPending =
    !selectedEventId || selectedEventId === "allEvents"
      ? allPending
      : allPending.filter((item) => item.draw_event_id === selectedEventId);

  return (
    <div>
      <Drawer isOpen={isOpen}>
        <Drawer.Backdrop isDismissable={true}>
          <Drawer.Content
            placement="right"
            className="w-[420px]! max-w-[95vw] min-w-[300px] bg-white h-screen"
          >
            <Drawer.Dialog className="rounded-none w-full flex flex-col h-full">
              <Drawer.Header className="shrink-0">
                <div className="flex justify-between items-center">
                  <Drawer.Heading className="text-sm font-gotham-bold">
                    Manage Pending Draws
                  </Drawer.Heading>
                  <CloseButton
                    className="bg-transparent text-black"
                    onClick={onCloseTap}
                  />
                </div>
              </Drawer.Header>

              <div className="pb-3 shrink-0 mt-4">
                <CustomSelectComponent
                  label="Filter by Event"
                  placeholder=""
                  showDropDownIcon
                  initialItemKey="allEvents"
                  list={eventOptions}
                  isDisabled={eventsPending || eventOptions.length === 0}
                  onSelectionChange={(item) => setSelectedEventId(item.key)}
                />
              </div>

              <Drawer.Body className="flex-1 min-h-0 overflow-y-auto pb-6">
                {isFetching ? (
                  <div className="flex justify-center items-center h-32">
                    <Spinner size="sm" />
                  </div>
                ) : filteredPending.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <span className="text-xs text-gray-400">
                      No pending approvals
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredPending.map((item) => (
                      <PendingCard
                        key={item.approval_id}
                        item={item}
                        onConfirm={() =>
                          setPendingAction({ type: "confirm", item })
                        }
                        onReject={() =>
                          setPendingAction({ type: "reject", item })
                        }
                      />
                    ))}
                  </div>
                )}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      <AlertDialog
        isOpen={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="rounded-lg">
              <AlertDialog.Header>
                <AlertDialog.Icon
                  status={
                    pendingAction?.type === "confirm" ? "success" : "danger"
                  }
                />
                <AlertDialog.Heading className="font-gotham-black text-sm">
                  {pendingAction?.type === "confirm"
                    ? "Confirm Draw Result"
                    : "Reject Draw Result"}
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p className="text-xs text-gray-600">
                  {pendingAction?.type === "confirm"
                    ? "Are you sure you want to confirm the draw result? The numbers "
                    : "Are you sure you want to reject the draw result for this event?"}
                  {pendingAction?.type === "confirm" && (
                    <span className="font-gotham-black text-gray-800">
                      {pendingAction?.item.numbers.join(", ")}
                    </span>
                  )}
                  {pendingAction?.type === "confirm" && " will be finalised."}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted by:{" "}
                  <span className="font-gotham-black">
                    {pendingAction?.item.submitted_by}
                  </span>
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  size="sm"
                  className="bg-transparent border text-black rounded-lg px-6 py-1 text-xs font-gotham-black"
                  onPress={() => setPendingAction(null)}
                  isDisabled={isActing}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className={`text-white rounded-lg text-xs font-gotham-black ${
                    pendingAction?.type === "confirm"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                  onPress={() => pendingAction && executeAction(pendingAction)}
                  isPending={isActing}
                  isDisabled={isActing}
                >
                  {({ isPending }) => (
                    <>
                      {isPending ? (
                        <Spinner color="current" size="sm" />
                      ) : pendingAction?.type === "confirm" ? (
                        "Yes, Confirm"
                      ) : (
                        "Yes, Reject"
                      )}
                    </>
                  )}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
}

export default ManageDrawDrawer;

const PendingCard = ({
  item,
  onConfirm,
  onReject,
}: {
  item: IPendingApproval;
  onConfirm: () => void;
  onReject: () => void;
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Gradient header */}
      <div className="bg-linear-to-br from-primary to-[#5b4abf] px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[0.6rem] font-gotham-black text-white/60 uppercase tracking-wide">
              {item.game_type}
            </span>
            <span className="text-sm font-gotham-bold text-white truncate">
              {item.event_name ?? "—"}
            </span>
          </div>
          {/* Draw numbers */}
          <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
            {item.numbers.map((n, i) => (
              <span
                key={i}
                className="bg-white/20 text-white font-jura-bold text-xs px-2 py-1 rounded-md"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <LuCalendar className="w-3.5 h-3.5 shrink-0" />
          <span>{item.draw_date ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <LuUser className="w-3.5 h-3.5 shrink-0" />
          <span>{item.submitted_by ?? "—"}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 border-t divide-x divide-gray-100">
        <button
          onClick={onReject}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-gotham-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <RiCloseCircleLine className="w-3.5 h-3.5" />
          Reject
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-gotham-bold text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
        >
          <RiCheckLine className="w-3.5 h-3.5" />
          Confirm
        </button>
      </div>
    </div>
  );
};
