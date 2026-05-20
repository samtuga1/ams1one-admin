import CustomInputComponent from "@/components/custom-input-component";
import { Button, Form, Popover } from "@heroui/react";
import React from "react";
import { IoFilter } from "react-icons/io5";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Props = {
  onFilterTap?: () => void;
};

function FilterRetailers({ onFilterTap }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentName = searchParams.get("name") ?? "";
  const currentPhone = searchParams.get("phone") ?? "";
  const filtersCount = [currentName, currentPhone].filter(Boolean).length;
  const hasActiveFilter = !!(currentName || currentPhone);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const name = (data.name as string)?.trim() ?? "";
    const phone = (data.phoneNumber as string)?.trim() ?? "";

    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (phone) params.set("phone", phone);

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    onFilterTap?.();
    setIsOpen(false);
  };

  const handleReset = () => {
    router.push(pathname);
    onFilterTap?.();
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <Button
          className={`rounded-lg border text-xs font-gotham-bold ${"bg-transparent text-black"}`}
          size="md"
          onClick={() => setIsOpen(true)}
        >
          <IoFilter className="h-4 w-4" />
          <span>Filter</span>
          {hasActiveFilter && (
            <div className="rounded-full w-[12px] h-[12px] bg-red-600 text-[10px] text-white">
              {filtersCount}
            </div>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="rounded-lg shadow-lg border border-gray-100 w-72 p-0"
        placement="bottom right"
      >
        <Popover.Dialog className="w-full p-0">
          {/* key forces inputs to re-render with fresh defaultValues when params change */}
          <Form key={`${currentName}-${currentPhone}`} onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 p-4 w-full">
              <span className="text-sm font-gotham-black">
                Filter Retailers
              </span>
              <CustomInputComponent
                label="Name"
                className="p-0 border rounded-lg border-gray-300"
                name="name"
                defaultValue={currentName}
              />
              <CustomInputComponent
                label="Phone Number"
                className="p-0 border rounded-lg border-gray-300"
                name="phoneNumber"
                type="tel"
                defaultValue={currentPhone}
              />
              <Button
                className="rounded-lg bg-primary w-full text-xs font-gotham-black text-white"
                type="submit"
              >
                Apply Filter
              </Button>
              {hasActiveFilter && (
                <Button
                  className="rounded-lg border bg-transparent w-full text-xs font-gotham-black text-gray-600"
                  type="button"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </Form>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

export default FilterRetailers;
