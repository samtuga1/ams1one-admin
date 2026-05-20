import Image from "next/image";
import OrganizationImage from "@/public/images/organization-image-placeholder.webp";
import {
  LuMail,
  LuMapPin,
  LuPhone,
  LuHash,
  LuLandmark,
  LuBadgeCheck,
  LuCreditCard,
  LuNetwork,
  LuBanknote,
  LuGlobe,
  LuDatabase,
  LuLanguages,
  LuCircleDollarSign,
} from "react-icons/lu";
import type { ElementType } from "react";

function GeneralSettings() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-linear-to-br from-primary to-[#5b4abf] px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="rounded-xl overflow-hidden border-2 border-white/30 shrink-0">
            <Image
              src={OrganizationImage}
              alt="Organisation logo"
              className="w-20 h-20 object-cover"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[0.6rem] font-gotham-black text-white/60 uppercase tracking-wide">
              Organisation
            </span>
            <span className="text-lg font-gotham-black text-white leading-tight">
              N/A
            </span>
            <span className="text-xs font-jura-medium text-white/70">N/A</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <InfoTile
            icon={LuMail}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Primary Email"
            value="N/A"
          />
          <InfoTile
            icon={LuPhone}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Primary Contact"
            value="N/A"
          />
        </div>
        <div className="border-t">
          <InfoTile
            icon={LuMapPin}
            iconBg="bg-orange-100"
            iconColor="text-orange-500"
            label="Address"
            value="N/A"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
            Organisation Details
          </span>
        </div>
        <div className="grid sm:grid-cols-2 divide-gray-100">
          <InfoTile
            icon={LuHash}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            label="Organisation's ID"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuBadgeCheck}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            label="License Type"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuNetwork}
            iconBg="bg-teal-100"
            iconColor="text-teal-600"
            label="Distribution Channel"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuGlobe}
            iconBg="bg-sky-100"
            iconColor="text-sky-600"
            label="Country"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuLanguages}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            label="Default Language"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuCircleDollarSign}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            label="Default Currency"
            value="N/A"
            border
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50">
          <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
            Financial Settings
          </span>
        </div>
        <div className="grid sm:grid-cols-2 divide-gray-100">
          <InfoTile
            icon={LuLandmark}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            label="Partner Bank"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuCreditCard}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Collection Account #"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuBanknote}
            iconBg="bg-orange-100"
            iconColor="text-orange-500"
            label="Payout Account #"
            value="N/A"
            border
          />
          <InfoTile
            icon={LuDatabase}
            iconBg="bg-red-100"
            iconColor="text-red-500"
            label="Operations Account #"
            value="N/A"
            border
          />
        </div>
      </div>
    </div>
  );
}

export default GeneralSettings;

const InfoTile = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  border = false,
}: {
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  border?: boolean;
}) => (
  <div
    className={`flex items-center gap-3 px-5 py-3.5 ${border ? "border-b border-gray-100" : ""}`}
  >
    <div className={`${iconBg} rounded-md p-2 shrink-0`}>
      <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
      <span className="text-[0.6rem] font-gotham-black text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xs font-jura-bold text-gray-700 truncate">
        {value}
      </span>
    </div>
  </div>
);
