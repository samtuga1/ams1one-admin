"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Button, Spinner } from "@heroui/react";
import { LuMapPin, LuRefreshCw, LuX } from "react-icons/lu";
import { useRouter } from "next/navigation";
import WritersService from "@/api/writers";

const DeviceMapInner = dynamic(() => import("./device-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Spinner size="sm" />
    </div>
  ),
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeviceMapDrawer({ isOpen, onClose }: Props) {
  const router = useRouter();
  const {
    data: devices = [],
    isPending,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["writers", "device-locations"],
    queryFn: WritersService.fetchDeviceLocations,
    enabled: isOpen,
    staleTime: 30_000,
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[82vw] flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <LuMapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-gotham-black uppercase tracking-wide">
              POS Device Locations
            </span>
            {!isPending && (
              <span className="text-xs text-gray-400 font-gotham-bold">
                ({devices.length} device{devices.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              isIconOnly
              isDisabled={isFetching}
              onClick={() => void refetch()}
              className="bg-gray-100 text-gray-600 rounded-lg"
            >
              <LuRefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              size="sm"
              isIconOnly
              onClick={onClose}
              className="bg-gray-100 text-gray-600 rounded-lg"
            >
              <LuX className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-b border-gray-100 bg-gray-50 text-xs text-gray-600 shrink-0">
          <span className="font-gotham-bold text-gray-700">Status:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
            Active
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            No Use
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
            Other
          </span>
        </div>

        {/* Map */}
        <div className="flex-1 min-h-0 relative">
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <Spinner size="sm" />
            </div>
          ) : devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <LuMapPin className="w-10 h-10" />
              <p className="text-sm">
                No devices have reported their location yet.
              </p>
            </div>
          ) : (
            <DeviceMapInner
              devices={devices}
              onWriterClick={(writerId) => {
                onClose();
                router.push(`/writers/${writerId}`);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
