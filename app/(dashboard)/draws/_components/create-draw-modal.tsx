"use client";

import CustomSelectComponent from "@/components/custom-select-component";
import GamesService from "@/api/games";
import ToastService from "@/utils/toast-service";
import { Button, Modal, Spinner } from "@heroui/react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ApiError from "@/utils/api_error";
import type { IAutoDrawResult } from "@/interfaces/games.interface";
import { LuDices } from "react-icons/lu";
import DrawRevealScreen from "./draw-reveal-screen";

function CreateDrawModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedEventId, setSelectedEventId] = React.useState<string>("");
  const [drawResult, setDrawResult] = React.useState<IAutoDrawResult | null>(
    null,
  );
  const queryClient = useQueryClient();

  const { data: drawableEvents = [], isPending: eventsPending } = useQuery({
    queryKey: ["games", "drawable-today"],
    queryFn: GamesService.fetchDrawableToday,
    enabled: isOpen,
  });

  const eventOptions = drawableEvents.map((e) => ({
    key: e.id,
    label: e.label,
  }));

  const { mutateAsync: runAutoDraw, isPending: isSubmitting } = useMutation({
    mutationKey: ["games", "auto-draw"],
    mutationFn: (eventId: string) => GamesService.autoDraw(eventId),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: ["games", "draws-and-winnings-table"],
      });
      handleClose();
      setDrawResult(result);
    },
    onError: (error: ApiError) => {
      ToastService.error({
        text: error?.message ?? "Action failed. Please try again.",
      });
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setSelectedEventId("");
  };

  const handleSubmit = async () => {
    if (!selectedEventId) {
      ToastService.error({ text: "Please select an event" });
      return;
    }
    await runAutoDraw(selectedEventId);
  };

  // When the reveal is active, render only it — completely unmounts the modal
  if (drawResult !== null) {
    return (
      <DrawRevealScreen
        result={drawResult}
        onComplete={() => setDrawResult(null)}
      />
    );
  }

  return (
    <>
      <Button
        className="rounded-lg bg-transparent border text-black text-xs font-gotham-bold"
        size="md"
        onClick={() => setIsOpen(true)}
      >
        Create Draw
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        isDismissable={!isSubmitting}
        isKeyboardDismissDisabled={isSubmitting}
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon className="bg-primary/10 text-primary">
                <LuDices className="w-5 h-5" />
              </Modal.Icon>
              <Modal.Heading className="font-gotham-black">
                Create Draw
              </Modal.Heading>
              <p className="text-sm text-gray-500 mb-2">
                Select an event to run the auto-draw algorithm.
              </p>
            </Modal.Header>

            <Modal.Body>
              <CustomSelectComponent
                label="Event"
                placeholder=""
                showDropDownIcon
                list={eventOptions}
                isDisabled={eventsPending || eventOptions.length === 0}
                onSelectionChange={(item) => setSelectedEventId(item.key)}
              />
              {!eventsPending && eventOptions.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  No drawable events available for today.
                </p>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                slot="close"
                variant="danger"
                className="text-xs font-gotham-bold"
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-xs font-gotham-black"
                isPending={isSubmitting}
                isDisabled={isSubmitting || !selectedEventId}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  "Draw Results"
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

export default CreateDrawModal;
