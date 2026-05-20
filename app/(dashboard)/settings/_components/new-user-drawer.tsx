import CustomInputComponent from "@/components/custom-input-component";
import CustomSelectComponent from "@/components/custom-select-component";
import PermissionsService from "@/api/permissions";
import {
  Button,
  CloseButton,
  CloseIcon,
  Drawer,
  Form,
  Spinner,
} from "@heroui/react";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminUsersService from "@/api/admin-users";
import ToastService from "@/utils/toast-service";
import ApiError from "@/utils/api_error";

type Props = {
  onCreated?: () => void;
};

function NewUserDrawer(payload: Props) {
  const [drawerIsOpen, setDrawerOpen] = React.useState(false);
  const [passwordValue, setPasswordValue] = React.useState("");
  const [roleId, setRoleId] = React.useState<string>("");
  const queryClient = useQueryClient();

  const { data: roles = [] } = useQuery({
    queryKey: ["permissions", "roles"],
    queryFn: PermissionsService.fetchRoles,
    enabled: drawerIsOpen,
  });

  const roleOptions = roles.map((r) => ({ key: r.id, label: r.name }));

  const { mutateAsync: createAdmin, isPending } = useMutation({
    mutationKey: ["admin-users", "create"],
    mutationFn: AdminUsersService.createAdmin,
    onSuccess: async () => {
      ToastService.success({ text: "New team member created" });
      await queryClient.invalidateQueries({ queryKey: ["admin-users", "list"] });
      payload.onCreated?.();
      setDrawerOpen(false);
    },
    onError: (error: ApiError) => {
      ToastService.error({ text: error?.message ?? "Unable to create admin" });
    },
  });

  return (
    <>
      <Button
        className="rounded-lg w-full bg-primary text-xs font-gotham-bold"
        size="md"
        onClick={() => setDrawerOpen(true)}
      >
        Add New Member
      </Button>
      <Drawer.Backdrop
        variant="blur"
        className="backdrop-blur-xs"
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  const data = Object.fromEntries(new FormData(e.currentTarget));
                  const password = String(data.password ?? "");
                  const confirmPassword = String(data.confirmPassword ?? "");
                  if (password.length < 8) {
                    ToastService.error({ text: "password: Ensure this field has at least 8 characters." });
                    return;
                  }
                  if (password !== confirmPassword) {
                    ToastService.error({ text: "Passwords do not match" });
                    return;
                  }
                  if (!roleId) {
                    ToastService.error({ text: "Please select a dashboard role" });
                    return;
                  }
                  await createAdmin({
                    first_name: String(data.firstName ?? ""),
                    last_name: String(data.surname ?? ""),
                    email: String(data.email ?? ""),
                    phone: String(data.phoneNumber ?? ""),
                    password,
                    role_id: roleId || null,
                  });
                }}
              >
                <div className="flex flex-col space-y-3">
                  <span className="text-lg font-gotham-black">New user</span>
                  <div className="space-y-4">
                    <CustomInputComponent
                      label="First Name"
                      className="p-0 border rounded-lg border-gray-300"
                      name="firstName"
                      isRequired
                    />
                    <CustomInputComponent
                      label="Surname"
                      className="p-0 border rounded-lg border-gray-300"
                      name="surname"
                      isRequired
                    />
                    <CustomInputComponent
                      label="Email"
                      className="p-0 border rounded-lg border-gray-300"
                      name="email"
                      showPlaceholder={false}
                      type="email"
                      isRequired
                    />
                    <CustomInputComponent
                      label="Phone Number"
                      className="p-0 border rounded-lg border-gray-300"
                      name="phoneNumber"
                      type="tel"
                      isRequired
                    />
                    <CustomInputComponent
                      type="password"
                      name="password"
                      label="Password"
                      minLength={8}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      showPlaceholder={false}
                      showSuffixIcon={false}
                      showPreficIcon={false}
                      className="p-0 border rounded-lg border-gray-300"
                      isRequired
                    />
                    <CustomInputComponent
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      showLabel={true}
                      showPlaceholder={false}
                      validate={(val) => {
                        if (!val) return "This field is required";
                        if (val !== passwordValue) return "Passwords do not match";
                        return null;
                      }}
                      showSuffixIcon={false}
                      showPreficIcon={false}
                      className="p-0 border rounded-lg border-gray-300"
                      isRequired
                    />
                    <CustomSelectComponent
                      label="Dashboard Role"
                      placeholder="Select a role"
                      showDropDownIcon
                      isRequired
                      list={roleOptions}
                      onSelectionChange={(item) => setRoleId(item.key)}
                    />
                  </div>
                  <Button
                    className="rounded-lg bg-primary w-full text-xs font-gotham-black mt-2"
                    type="submit"
                    isDisabled={isPending}
                    isPending={isPending}
                  >
                    {({ isPending }) => (
                      <>{isPending ? <Spinner color="current" size="sm" /> : "Save"}</>
                    )}
                  </Button>
                </div>
              </Form>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
}

export default NewUserDrawer;
