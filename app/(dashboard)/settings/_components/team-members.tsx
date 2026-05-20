"use client";
import CustomInputComponent from "@/components/custom-input-component";
import { Avatar, Chip, CloseButton, Spinner } from "@heroui/react";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { FaRegAddressCard } from "react-icons/fa";
import { MdOutlineHandshake } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import NewUserDrawer from "./new-user-drawer";
import ExistingRolesDrawer from "./existing-roles-drawer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminUsersService from "@/api/admin-users";
import type { IAdminUser } from "@/interfaces/admin-users.interface";
import EditUserDrawer from "./edit-user";

function TeamMembers() {
  const queryClient = useQueryClient();
  const [searchDraft, setSearchDraft] = React.useState("");

  const { data: adminResp, isPending } = useQuery({
    queryKey: ["admin-users", "list"],
    queryFn: () =>
      AdminUsersService.fetchAdmins({
        page: 1,
        page_size: 100,
      }),
  });

  const admins = React.useMemo(
    () => adminResp?.results ?? [],
    [adminResp?.results],
  );
  const filteredAdmins = React.useMemo(() => {
    const query = searchDraft.trim().toLowerCase();
    if (!query) return admins;

    return admins.filter((user) => {
      const fullName = user.full_name?.toLowerCase() ?? "";
      const firstName = user.first_name?.toLowerCase() ?? "";
      const lastName = user.last_name?.toLowerCase() ?? "";
      const phone = user.phone?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";

      return (
        fullName.includes(query) ||
        firstName.includes(query) ||
        lastName.includes(query) ||
        phone.includes(query) ||
        email.includes(query)
      );
    });
  }, [admins, searchDraft]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center shrink-0 gap-3">
        <span className="text-sm font-gotham-black">Current Members</span>
        <ExistingRolesDrawer />
      </div>

      <div className="flex flex-col md:flex-row md:items-center w-full gap-3 shrink-0">
        <div className="rounded-lg p-3 md:flex-1 bg-[#F9F7F7] w-full flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <div className="w-full md:flex-1 px-2 md:px-0">
            <CustomInputComponent
              className="border-gray-300 bg-white py-0 rounded-lg w-full"
              placeholder="Search by name or phone number"
              onChange={(e) => setSearchDraft(e.target.value)}
              suffixIcon={
                <CloseButton className="mr-2">
                  <BiSearch className="h-3.5" />
                </CloseButton>
              }
            />
          </div>
          {/* <Button
            size="sm"
            variant="ghost"
            className="border bg-white rounded-lg text-xs py-4.5 w-full md:w-auto md:px-6 shrink-0"
            onClick={() => setSearchDraft((prev) => prev.trim())}
          >
            <IoFilter className="text-gray-600 h-4 w-4" />
            Filter
          </Button> */}
        </div>
        <div className="w-full md:w-auto md:shrink-0">
          <NewUserDrawer
            onCreated={() =>
              queryClient.invalidateQueries({
                queryKey: ["admin-users", "list"],
              })
            }
          />
        </div>
      </div>

      <div className="md:flex-1 md:min-h-0 overflow-y-auto custom-scrollbar pr-1 space-y-3">
        {isPending ? (
          <div className="w-full flex flex-row justify-center mt-3">
            <Spinner size="sm" />
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="w-full flex flex-row justify-center mt-3 text-xs">
            No members found.
          </div>
        ) : (
          filteredAdmins.map((user) => (
            <MemberItem
              key={user.id}
              user={user}
              onEdited={() =>
                queryClient.invalidateQueries({
                  queryKey: ["admin-users", "list"],
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TeamMembers;

const MemberItem = ({
  user,
  onEdited,
}: {
  user: IAdminUser;
  onEdited?: () => void;
}) => {
  const initials =
    (user.first_name?.[0] ?? user.full_name?.[0] ?? "U").toUpperCase() +
    (user.last_name?.[0] ?? "").toUpperCase();
  const joined = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="rounded-lg border flex flex-col md:flex-row md:justify-between p-4 gap-3 md:gap-4 md:items-center">
      <div className="flex items-center gap-x-3 min-w-0">
        <Avatar size="lg">
          <Avatar.Fallback className="bg-primary text-white text-sm font-gotham-bold">
            {initials}
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col space-y-1 min-w-0">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-gotham-black">
              {user.full_name || `${user.first_name} ${user.last_name}`}
            </span>
            <EditUserDrawer user={user} onEdited={onEdited} />
          </div>
          <span className="text-[11px] break-all">{user.email}</span>
        </div>
      </div>

      <div className="w-full md:w-auto md:ml-auto flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
        <span className="text-sm font-jura-bold wrap-break-word">
          {user.phone}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Chip className="px-3 py-1 gap-x-1.5">
            <FaRegAddressCard />
            <Chip.Label className="text-xs font-gotham-medium text-black">
              {user.role}
            </Chip.Label>
          </Chip>

          <Chip className="px-3 py-1 gap-x-1.5">
            <MdOutlineHandshake />
            <Chip.Label className="text-xs font-gotham-medium text-black">
              {joined}
            </Chip.Label>
          </Chip>

          <Chip className="px-3 py-1 gap-x-1.5">
            <RxPerson />
            <Chip.Label className="text-xs font-gotham-medium text-black">
              {user.is_active ? "Active" : "Inactive"}
            </Chip.Label>
          </Chip>
        </div>
      </div>
    </div>
  );
};
