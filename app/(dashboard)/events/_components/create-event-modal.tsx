"use client";

import React from "react";
import { Button, Form, Modal, Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuCalendarDays } from "react-icons/lu";
import EventsService from "@/api/events";
import ApiError from "@/utils/api_error";
import ToastService from "@/utils/toast-service";
import CustomInputComponent from "@/components/custom-input-component";

export default function CreateEventModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      EventsService.createEvent({
        name: data.get("name") as string,
        event_date: data.get("event_date") as string,
        venue: (data.get("venue") as string) || undefined,
        description: (data.get("description") as string) || undefined,
      }),
    onSuccess: () => {
      ToastService.success({ text: "Event created successfully." });
      qc.invalidateQueries({ queryKey: ["events"] });
      setIsOpen(false);
    },
    onError: (err: ApiError) => {
      ToastService.error({ text: err.message ?? "Failed to create event." });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutateAsync(new FormData(e.currentTarget));
  };

  return (
    <>
      <Button
        className="rounded-lg bg-transparent border text-black text-xs font-gotham-bold"
        size="md"
        onClick={() => setIsOpen(true)}
      >
        Create Event
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => { if (!open && !isPending) setIsOpen(false); }}
        isDismissable={!isPending}
        isKeyboardDismissDisabled={isPending}
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon className="bg-primary/10 text-primary">
                <LuCalendarDays className="w-5 h-5" />
              </Modal.Icon>
              <Modal.Heading className="font-gotham-black">Create Event</Modal.Heading>
              <p className="text-sm text-gray-500 mb-2">
                Create an invite-only event and issue QR tickets via SMS.
              </p>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
              <Modal.Body className="flex flex-col gap-3">
                <CustomInputComponent
                  label="Event Name"
                  name="name"
                  type="text"
                  isRequired
                  placeholder="e.g. AMS1One Anniversary Party"
                />
                <CustomInputComponent
                  label="Date & Time"
                  name="event_date"
                  type="datetime-local"
                  isRequired
                />
                <CustomInputComponent
                  label="Venue"
                  name="venue"
                  type="text"
                  placeholder="e.g. La Palm Royal Beach Hotel, Accra"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Description</label>
                  <textarea
                    name="description"
                    placeholder="Optional event description"
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  isDisabled={isPending}
                  className="font-gotham-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isPending={isPending}
                  isDisabled={isPending}
                  className="bg-primary text-white font-gotham-bold text-xs"
                >
                  {isPending ? <Spinner size="sm" color="current" /> : "Create"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
