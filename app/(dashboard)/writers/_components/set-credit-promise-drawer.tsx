import CustomInputComponent from "@/components/custom-input-component";
import { Button, CloseButton, CloseIcon, Drawer, Form } from "@heroui/react";
import React from "react";

type Props = {
  onFilterTap?: (payload: { name: string; phoneNumber: string }) => void;
};

function SetCreditPromiseDrawer(payload: Props) {
  const [drawerIsOpen, setDrawerOpen] = React.useState(false);

  return (
    <Drawer>
      <Button
        className="rounded-lg bg-black text-xs font-gotham-bold"
        size="md"
        onClick={() => setDrawerOpen(true)}
      >
        Credit Promise
      </Button>
      <Drawer.Backdrop
        variant="blur"
        className={"backdrop-blur-xs"}
        isOpen={drawerIsOpen}
        onOpenChange={setDrawerOpen}
      >
        <Drawer.Content placement="right">
          <Drawer.Dialog className="rounded-none">
            <Drawer.Header>
              <CloseButton
                className="self-end bg-transparent"
                onClick={() => setDrawerOpen(false)}
              >
                <CloseIcon className="w-[20px] h-[20px] text-shadow-black" />
              </CloseButton>
            </Drawer.Header>
            <Drawer.Body className="text-black">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = Object.fromEntries(
                    new FormData(e.currentTarget),
                  );

                  const finalData = {
                    name: data.name as string,
                    phoneNumber: data.phoneNumber as string,
                  };

                  payload.onFilterTap?.(finalData);
                }}
              >
                <div className="flex flex-col space-y-3">
                  <span className="text-sm font-gotham-black">
                    Set Credit Promise
                  </span>
                  <div className="space-y-4">
                    <CustomInputComponent
                      label="Amount"
                      className="p-0 border rounded-lg border-gray-300"
                      name="amount"
                      validate={(value) => {
                        if (!value || value.trim() === "") {
                          return "Amount is required";
                        }
                        const num = Number(value);
                        if (isNaN(num)) {
                          return "Amount must be a number";
                        }
                        if (num <= 0) {
                          return "Amount must be greater than 0";
                        }
                        return true;
                      }}
                    />
                    <Button
                      className="rounded-lg bg-black w-full text-xs font-gotham-black mt-2"
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Form>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default SetCreditPromiseDrawer;
