"use client";

import { cn, Popover } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAuth from "@/stores/auth.store";
import AuthService from "@/api/auth";
import { usePageAccess } from "@/hooks/use-page-access";
import {
  LuBanknote,
  LuBuilding2,
  LuCalendarDays,
  LuChevronRight,
  LuDices,
  LuFileText,
  LuLayoutDashboard,
  LuLogOut,
  LuMenu,
  LuSettings,
  LuShoppingBag,
  LuSmartphone,
  LuUsers,
} from "react-icons/lu";
import { RiUserLine } from "react-icons/ri";
import { MdOutlineBarChart } from "react-icons/md";

const navItems = [
  { label: "Sales", href: "/sales?tab=tickets", icon: LuLayoutDashboard, pagePrefixes: ["sales."] },
  { label: "Analysis", href: "/analysis", icon: MdOutlineBarChart, pagePrefixes: ["analysis."] },
  { label: "Draws", href: "/draws", icon: LuDices, pagePrefixes: ["draw.", "autodraw."] },
  { label: "Reports", href: "/reports", icon: LuFileText, pagePrefixes: ["reports."] },
  { label: "Supervisors", href: "/supervisors", icon: LuBuilding2, pagePrefixes: ["supervisors."] },
  { label: "Writers", href: "/writers", icon: LuShoppingBag, pagePrefixes: ["writers."] },
  { label: "Dollar Rush Players", href: "/dollar-rush-players", icon: LuUsers, pagePrefixes: ["players.dollar_rush."] },
  { label: "5/90 Players", href: "/five-ninety-players", icon: LuUsers, pagePrefixes: ["players.five_ninety."] },
  { label: "Events & Tickets", href: "/events", icon: LuCalendarDays, pagePrefixes: ["events."] },
  { label: "Payments", href: "/admin-payouts", icon: LuBanknote, pagePrefixes: ["admin_payouts."] },
  { label: "App Releases", href: "/app-releases", icon: LuSmartphone, pagePrefixes: ["admin_payouts.", "admin."] },
];

function canSeeItem(pages: string[] | "*" | undefined, prefixes: string[]): boolean {
  if (!pages) return true; // pages not yet loaded — show all to avoid flash
  if (pages === "*") return true;
  return pages.some((key) => prefixes.some((prefix) => key.startsWith(prefix)));
}

type NavItemProps = {
  item: (typeof navItems)[number];
  active: boolean;
  onNavigate: (href: string) => void;
};

function NavItem({ item, active, onNavigate }: NavItemProps) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onNavigate(item.href)}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
        active
          ? "bg-primary-light text-primary"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
      )}
    >
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0",
          active ? "text-primary" : "text-gray-400",
        )}
      />
      <span>{item.label}</span>
    </button>
  );
}

type SidebarContentProps = {
  pathname: string;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  fullName: string;
  role: string;
  photoUrl?: string;
  pages?: string[] | "*";
};

function SidebarContent({
  pathname,
  onNavigate,
  onLogout,
  fullName,
  role,
  photoUrl,
  pages,
}: SidebarContentProps) {
  const { hasPage } = usePageAccess();
  const canSeeSettings = hasPage("admin.users") || hasPage("admin.activity_logs");
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const visibleItems = navItems.filter((item) => canSeeItem(pages, item.pagePrefixes));

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center">
        <Image
          src="/images/new/icon.png"
          alt="icon"
          width={36}
          height={36}
          className="object-contain"
        />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={pathname.startsWith(item.href.split("?")[0])}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Bottom: User */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        {/* User row */}
        <Popover isOpen={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
          <Popover.Trigger>
            <button
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-150 cursor-pointer"
              onClick={() => setUserPopoverOpen(!userPopoverOpen)}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden border border-gray-300">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <RiUserLine className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Name + role */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                  {fullName}
                </p>
                <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                  {role}
                </p>
              </div>

              <LuChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </button>
          </Popover.Trigger>

          <Popover.Content className="rounded-lg shadow-lg border border-gray-100 w-48 p-1 mb-2">
            <Popover.Dialog className="p-0">
              {canSeeSettings && (
                <button
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    setUserPopoverOpen(false);
                    onNavigate("/settings");
                  }}
                >
                  <LuSettings className="w-4 h-4 text-gray-400" />
                  Settings
                </button>
              )}
              <button
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-md text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                onClick={() => {
                  setUserPopoverOpen(false);
                  onLogout();
                }}
              >
                <LuLogOut className="w-4 h-4" />
                Logout
              </button>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
}

function NavRail({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, removeAuth, setAuth } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Re-fetch pages for sessions that predate the permissions feature
  useEffect(() => {
    if (auth && auth.pages === undefined) {
      AuthService.fetchMyPages()
        .then((pages) => setAuth({ ...auth, pages }))
        .catch(() => {/* silently ignore — nav shows all items when pages is undefined */});
    }
  }, [auth, setAuth]);

  const handleNav = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    removeAuth();
    router.replace("/login");
  };

  const firstName = auth?.user?.first_name ?? "";
  const lastName = auth?.user?.last_name ?? "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Admin";
  const role = (auth?.user as { role?: string })?.role ?? "Administrator";
  const photoUrl = auth?.user?.photo ?? undefined;

  const sidebarProps: SidebarContentProps = {
    pathname,
    onNavigate: handleNav,
    onLogout: handleLogout,
    fullName,
    role,
    photoUrl,
    pages: auth?.pages,
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop rail */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-gray-100 bg-white">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 flex flex-col md:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <LuMenu className="w-5 h-5 text-gray-600" />
          </button>
          <Image
            src="/images/new/icon.png"
            alt="icon"
            width={28}
            height={28}
            className="object-contain"
          />
          <div className="w-8" />
        </header>

        <main className="flex-1 min-h-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default NavRail;
