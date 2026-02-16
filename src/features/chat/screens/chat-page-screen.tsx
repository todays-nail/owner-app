"use client";

import Image from "next/image";
import Link from "next/link";

import { DashboardSignOutButton } from "@/features/auth/dashboard-sign-out-button";
import { ChatPageClient } from "@/features/chat/ui/chat-page-client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "대시보드", href: "/", icon: "dashboard" },
  { label: "예약 관리", href: "/bookings", icon: "calendar_month" },
  { label: "디자인 라이브러리", href: "/references", icon: "auto_fix_high" },
  { label: "견적 및 채팅", href: "/chat", icon: "chat_bubble" }
] as const;

export function ChatPageScreen() {
  return (
    <div className="owner-dashboard-root min-h-screen bg-[#fdfaf9]">
      <div className="flex min-h-screen overflow-hidden">
        <aside className="z-30 flex w-20 shrink-0 flex-col items-center border-r border-primary/5 bg-white py-8 lg:w-64 lg:items-stretch">
          <div className="mb-10 flex items-center gap-3 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-icons-round">auto_awesome</span>
            </div>
            <span className="hidden text-xl font-extrabold tracking-tight text-primary lg:block">
              ONEUL nail
            </span>
          </div>

          <nav className="flex-1 space-y-1.5 px-4">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/chat";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-4 py-3 transition-all",
                    active
                      ? "bg-primary text-white shadow-[0_10px_30px_-10px_rgba(232,92,79,0.42)]"
                      : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <span className="material-icons-round">{item.icon}</span>
                  <span className="hidden font-semibold lg:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 px-6 pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-[#fdecea]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnvZc3wbbVpXZCvaYxO-5tTfmXj7y-AJrxLAM4zvI27Oq9vN5hskQqPR0AP_g3zCB1B5GhcFnMROvsBonzbpWS1KylBsPziyMIx67ha-zGyJMSaGZ7tSSJ2XO4aDJDG_KrmztDS82oVNFe1FpRoPpyJ-JBm3IQJItiMju2IRZAW2JSXNi9lHjqmCaYY_wH1hH5oILDeLuWPDy8RUG7PVSZw8rWM-VFl8vzfFJd27OScH6uW-nGt4J7IywhnIx0B5UzUnfHdx6_I-I"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden min-w-0 lg:block">
                <p className="truncate text-xs font-bold text-slate-900">김지연 원장</p>
                <div className="mt-1 text-[10px] text-slate-400">
                  <DashboardSignOutButton />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
          <ChatPageClient />
        </main>
      </div>
    </div>
  );
}
