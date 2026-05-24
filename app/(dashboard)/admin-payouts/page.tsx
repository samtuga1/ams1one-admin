"use client";

import CustomInputComponent from "@/components/custom-input-component";
import CustomSelectComponent from "@/components/custom-select-component";
import PayoutsService, { IAdminPayout } from "@/api/payouts";
import ToastService from "@/utils/toast-service";
import ApiError from "@/utils/api_error";
import { Button, Form, Spinner } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { usePageAccess } from "@/hooks/use-page-access";
import {
  LuBanknote,
  LuCheck,
  LuTriangleAlert,
  LuClock,
} from "react-icons/lu";

const PROVIDERS = [
  { key: "MTN", label: "MTN Mobile Money" },
  { key: "VOD", label: "Vodafone Cash" },
  { key: "ATL", label: "AirtelTigo Money" },
];

function statusBadge(status: IAdminPayout["status"]) {
  if (status === "success")
    return (
      <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 text-xs font-gotham-bold px-2.5 py-1 rounded-full">
        <LuCheck className="w-3.5 h-3.5" />
        Success
      </span>
    );
  if (status === "failed")
    return (
      <span className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 text-xs font-gotham-bold px-2.5 py-1 rounded-full">
        <LuTriangleAlert className="w-3.5 h-3.5" />
        Failed
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border border-amber-200 text-xs font-gotham-bold px-2.5 py-1 rounded-full">
      <LuClock className="w-3.5 h-3.5" />
      Pending
    </span>
  );
}

function AdminPayoutsView() {
  const { hasPage } = usePageAccess();
  const canSend = hasPage("admin_payouts.send");

  const [provider, setProvider] = useState<"MTN" | "VOD" | "ATL">("MTN");
  const [lastPayout, setLastPayout] = useState<IAdminPayout | null>(null);
  const [formKey, setFormKey] = useState(0);

  const { mutate: send, isPending } = useMutation({
    mutationFn: ({
      payload,
      key,
    }: {
      payload: Parameters<typeof PayoutsService.sendAdminPayout>[0];
      key: string;
    }) => PayoutsService.sendAdminPayout(payload, key),
    onSuccess: (data) => {
      ToastService.success({ text: "Payout initiated successfully." });
      setLastPayout(data);
      setFormKey((k) => k + 1);
    },
    onError: (err: ApiError) => {
      ToastService.error({ text: err.message ?? "Failed to send payout." });
    },
  });

  const handleSubmit: React.ComponentProps<typeof Form>["onSubmit"] = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const amount = String(data.amount ?? "").trim();
    const mobile_number = String(data.mobile_number ?? "").trim();
    const recipient_name = String(data.recipient_name ?? "").trim();
    const description = String(data.description ?? "").trim();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      ToastService.error({ text: "Enter a valid amount." });
      return;
    }
    if (!mobile_number) {
      ToastService.error({ text: "Enter a mobile number." });
      return;
    }

    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    send({
      payload: { amount, mobile_number, mobile_provider: provider, recipient_name, description: description || undefined },
      key: idempotencyKey,
    });
  };

  if (!canSend) {
    return (
      <div className="flex items-center justify-center h-full p-10 text-gray-400 text-sm">
        You don&apos;t have permission to access this page.
      </div>
    );
  }

  return (
    <div className="p-5 px-7 pb-10 max-w-xl">
      <div className="flex items-center gap-2.5 mb-6">
        <LuBanknote className="w-5 h-5 text-primary" />
        <span className="text-lg font-gotham-black uppercase">Payments</span>
      </div>

      {lastPayout && (
        <div className="mb-6 border rounded-xl p-4 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-gotham-black text-gray-500 uppercase tracking-wide">
              Last Payout
            </span>
            {statusBadge(lastPayout.status)}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600">
            <div>
              <span className="font-gotham-bold block text-gray-400">Reference</span>
              <span className="font-jura-bold">{lastPayout.reference}</span>
            </div>
            <div>
              <span className="font-gotham-bold block text-gray-400">Amount</span>
              <span className="font-jura-bold">USD {lastPayout.amount}</span>
            </div>
            <div>
              <span className="font-gotham-bold block text-gray-400">Recipient</span>
              <span>{lastPayout.recipient_name}</span>
            </div>
            <div>
              <span className="font-gotham-bold block text-gray-400">Mobile</span>
              <span className="font-jura-bold">{lastPayout.mobile_number}</span>
            </div>
            {lastPayout.paystack_transfer_code && (
              <div className="col-span-2">
                <span className="font-gotham-bold block text-gray-400">Transfer Code</span>
                <span className="font-jura-bold">{lastPayout.paystack_transfer_code}</span>
              </div>
            )}
          </div>
          {lastPayout.status === "pending" && (
            <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Status is pending — it will flip to success or failed once Paystack confirms via webhook.
            </p>
          )}
        </div>
      )}

      <Form key={formKey} onSubmit={handleSubmit}>
        <div className="space-y-4 w-full">
          <CustomInputComponent
            label="Amount (USD)"
            name="amount"
            type="number"
            className="p-0 border rounded-lg border-gray-300"
            showPreficIcon={false}
            showPlaceholder={false}
            isRequired
          />
          <CustomInputComponent
            label="Mobile Number"
            name="mobile_number"
            type="tel"
            className="p-0 border rounded-lg border-gray-300"
            isRequired
          />
          <CustomSelectComponent
            label="Mobile Provider"
            placeholder="Select provider"
            showDropDownIcon
            list={PROVIDERS}
            initialItemKey="MTN"
            onSelectionChange={(val) => setProvider(val.key as "MTN" | "VOD" | "ATL")}
          />
          <CustomInputComponent
            label="Recipient Name"
            name="recipient_name"
            className="p-0 border rounded-lg border-gray-300"
            showPreficIcon={false}
            showPlaceholder={false}
            isRequired
          />
          <CustomInputComponent
            label="Description (optional)"
            name="description"
            className="p-0 border rounded-lg border-gray-300"
            showPreficIcon={false}
            showPlaceholder={false}
            isRequired={false}
          />
          <Button
            type="submit"
            isDisabled={isPending}
            className="w-full rounded-lg bg-primary text-white text-xs font-gotham-black mt-2"
          >
            {isPending ? <Spinner size="sm" color="current" /> : "Send Payout"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AdminPayoutsView;
