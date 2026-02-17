"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
  {
    key: "shop",
    label: "샵 정보 관리",
    href: "/settings"
  },
  {
    key: "account",
    label: "계정 정보",
    href: "/settings/account"
  }
] as const;

function isTabActive(pathname: string, href: string) {
  if (href === "/settings") {
    return pathname === "/settings";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SettingsSectionTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-6 border-b border-stone-200 dark:border-stone-800"
      aria-label="설정 탭"
    >
      {SETTINGS_TABS.map((tab) => {
        const active = isTabActive(pathname, tab.href);

        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
