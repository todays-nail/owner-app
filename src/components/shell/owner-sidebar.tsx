import Link from "next/link";

import { DashboardSignOutButton } from "@/features/auth/dashboard-sign-out-button";
import { cn } from "@/lib/utils";

export type OwnerSidebarActiveItem =
  | "dashboard"
  | "bookings"
  | "references"
  | "options"
  | "slots"
  | "chat";

export interface OwnerSidebarProps {
  activeItem: OwnerSidebarActiveItem;
}

type NavItem = {
  key: OwnerSidebarActiveItem;
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

const navItems: NavItem[] = [
  { key: "dashboard", label: "대시보드", href: "/", icon: "dashboard" },
  { key: "bookings", label: "예약 관리", href: "/bookings", icon: "calendar_today" },
  {
    key: "references",
    label: "디자인 라이브러리",
    href: "/references",
    icon: "photo_library"
  },
  {
    key: "chat",
    label: "견적 및 채팅",
    href: "#",
    icon: "chat_bubble_outline",
    badge: "4"
  }
];

export function OwnerSidebar({ activeItem }: OwnerSidebarProps) {
  return (
    <aside className="z-20 w-full border-b border-primary/10 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r dark:bg-background-dark/50">
      <div className="p-8">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary leading-none">
          <span className="material-icons text-2xl" aria-hidden="true">
            spa
          </span>
          <span className="leading-none">ONEUL</span>
          <span className="rounded-full border border-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
            nail
          </span>
        </h1>
      </div>

      <nav className="space-y-1 px-4">
        {navItems.map((item) => {
          const content = (
            <>
              <span className="material-icons text-xl" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-base font-medium leading-tight">{item.label}</span>
              {item.badge ? (
                <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-white">
                  {item.badge}
                </span>
              ) : null}
            </>
          );

          const baseClassName =
            "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors";
          const className =
            item.key === activeItem
              ? cn(baseClassName, "bg-primary text-white shadow-sm")
              : cn(
                  baseClassName,
                  "text-slate-700 hover:bg-primary/5 hover:text-primary dark:text-slate-400"
                );

          if (item.href === "#") {
            return (
              <a key={item.key} href={item.href} className={className}>
                {content}
              </a>
            );
          }

          return (
            <Link key={item.key} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-primary/5 p-6 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#f8f1f1] p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
            <span className="material-icons text-xl text-primary" aria-hidden="true">
              person
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">김지연</p>
            <p className="text-xs text-slate-500">원장</p>
          </div>
        </div>
        <DashboardSignOutButton />
      </div>
    </aside>
  );
}
