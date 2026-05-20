"use client";

import Image from "next/image";
import EmptyImage from "@/public/images/new/empty-page.jpg";
import CustomInputComponent from "@/components/custom-input-component";
import { RiSearchLine } from "react-icons/ri";
import { Avatar, Button, Spinner, Tabs } from "@heroui/react";
import { AiOutlineExport } from "react-icons/ai";
import OperationalTab from "./_components/operational-tab";
import FinancialTab from "./_components/financial-tab";
import NewLmcDrawer from "./_components/new-supervisor-drawer";
import { useQuery } from "@tanstack/react-query";
import LmcService from "@/api/lmc";
import { useMemo, useState } from "react";
import ToastService from "@/utils/toast-service";
import { useRouter } from "next/navigation";
import { usePageAccess } from "@/hooks/use-page-access";

function Lmcs() {
  const router = useRouter();
  const { hasPage } = usePageAccess();
  const canRegister = hasPage("supervisors.register");
  const canViewDetail = hasPage("supervisors.detail");

  const [searchTerm, setSearchTerm] = useState("");
  const { data: cards = [], isPending } = useQuery({
    queryKey: ["lmc", "detail-cards"],
    queryFn: LmcService.fetchDetailCards,
  });

  const filteredCards = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return cards;

    return cards.filter((card) =>
      [card.name, card.phone, card.code, card.address]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(query)),
    );
  }, [cards, searchTerm]);

  return (
    <div className="flex flex-col p-5 px-7 pb-10 space-y-5">
      <span className="text-sm sm:text-lg font-gotham-black uppercase">
        {`Supervisors (${cards.length})`}
      </span>
      <div className="w-full flex justify-end">
        <div className="space-x-2 items-center flex">
          <CustomInputComponent
            className="p-0 w-full md:w-[200px] rounded-lg border border-gray-300"
            prefixIcon={<RiSearchLine />}
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className="rounded-lg bg-transparent border text-black"
            size="md"
            onClick={() => {
              ToastService.info({ text: "Feature not yet available" });
            }}
          >
            <AiOutlineExport className="w-3.5 h-3.5" />
            <span className="text-xs font-gotham-bold">Export Data</span>
          </Button>
          {canRegister && <NewLmcDrawer />}
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
        {isPending && (
          <div className="col-span-full flex flex-row justify-center mt-10">
            <Spinner size="sm" />
          </div>
        )}
        {!isPending &&
          filteredCards.map((card) => {
            const initial = card.name.charAt(0).toUpperCase();
            return (
              <div key={card.id} className="border rounded-lg overflow-hidden">
                <div
                  className={`bg-linear-to-br from-primary to-[#5b4abf] px-4 py-5 flex flex-col items-center gap-2 ${canViewDetail ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => canViewDetail && router.push(`/supervisors/${card.id}`)}
                >
                  <Avatar className="w-14 h-14 ring-2 ring-white/30">
                    <Avatar.Image alt={initial} src={card.photo_url ?? ""} />
                    <Avatar.Fallback className="bg-white/20 text-xl text-white font-gotham-bold">
                      {initial}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-gotham-bold text-white text-sm text-center leading-tight">
                      {card.name}
                    </span>
                    <span className="font-jura-medium text-white/70 text-xs">
                      {card.phone}
                    </span>
                  </div>
                  <span className="bg-white/20 text-white text-[0.6rem] font-gotham-black px-2.5 py-0.5 rounded-full tracking-wide uppercase">
                    {card.code}
                  </span>
                </div>
                <Tabs className="w-full px-2 mt-1">
                  <Tabs.ListContainer>
                    <Tabs.List
                      aria-label="Options"
                      className="rounded-lg w-full"
                    >
                      <Tabs.Tab
                        className="text-xs font-gotham-bold flex-1"
                        id="operational"
                      >
                        Operational
                        <Tabs.Indicator className="rounded-lg" />
                      </Tabs.Tab>
                      <Tabs.Tab
                        className="text-xs font-gotham-bold flex-1"
                        id="financial"
                      >
                        Financial
                        <Tabs.Indicator className="rounded-lg" />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                  <Tabs.Panel className="px-4 py-3" id="operational">
                    <OperationalTab operational={card.operational} />
                  </Tabs.Panel>
                  <Tabs.Panel className="px-4 py-3" id="financial">
                    <FinancialTab financial={card.financial} />
                  </Tabs.Panel>
                </Tabs>
              </div>
            );
          })}
        {!isPending && filteredCards.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
            <div className="relative w-48 h-48">
              <Image
                src={EmptyImage}
                alt="No results"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm font-gotham-bold text-gray-700">
              {searchTerm.trim()
                ? "No supervisors match your search"
                : "No supervisors yet"}
            </p>
            <p className="text-xs font-gotham-regular text-gray-400 text-center max-w-[200px]">
              {searchTerm.trim()
                ? "Try a different name, phone number or code."
                : "Add your first supervisor to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lmcs;
