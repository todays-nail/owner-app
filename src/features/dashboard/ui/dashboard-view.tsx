/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { NotificationBellButton } from "@/components/common/notification-bell-button";
import { OwnerSidebar } from "@/components/shell/owner-sidebar";
import type {
  DashboardDesignItem,
  DashboardScheduleItem
} from "@/features/dashboard/model/dashboard";
import { cn } from "@/lib/utils";

export interface DashboardViewProps {
  designItems: DashboardDesignItem[];
  scheduleItems: DashboardScheduleItem[];
}

export function DashboardView({ designItems, scheduleItems }: DashboardViewProps) {
  return (
    <div className="owner-dashboard-root owner-dashboard-fit-root">
      <div className="owner-dashboard-fit">
        <OwnerSidebar activeItem="dashboard" />

        <main className="flex-1 bg-nude-soft p-4 sm:p-6 lg:p-7 dark:bg-background-dark/30">
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="min-w-0 flex-1">
              <header className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-light tracking-tight dark:text-white sm:text-3xl">
                    안녕하세요, <span className="font-bold text-primary">지연님</span>
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    오늘 샵의 현황을 확인해보세요.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <NotificationBellButton variant="dashboard" />
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
                  >
                    <span className="material-icons text-sm" aria-hidden="true">
                      add
                    </span>
                    새 예약 등록
                  </button>
                </div>
              </header>

              <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        오늘 매출
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                        ₩1,240,000
                      </h3>
                      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-500">
                        <span className="material-icons text-xs" aria-hidden="true">
                          trending_up
                        </span>
                        어제 대비 +12.4%
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <span className="material-icons text-[22px]" aria-hidden="true">
                        payments
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        신규 예약
                      </p>
                      <h3 className="mt-2 text-3xl font-extrabold tracking-tight">28</h3>
                      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-primary">
                        <span className="material-icons text-xs" aria-hidden="true">
                          priority_high
                        </span>
                        5건의 긴급 요청
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="material-icons text-[22px]" aria-hidden="true">
                        calendar_month
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6 rounded-xl border border-primary/5 bg-white p-6 shadow-sm sm:p-7 dark:bg-background-dark">
                <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">예약 파이프라인</h3>
                    <p className="mt-1 text-xs italic text-slate-400">총 84건 진행 중</p>
                  </div>
                  <Link
                    href="/bookings"
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-400 transition-all hover:text-primary dark:border-slate-700"
                  >
                    더보기
                    <span className="material-icons text-sm" aria-hidden="true">
                      chevron_right
                    </span>
                  </Link>
                </div>

                <div className="relative px-0 sm:px-10">
                  <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-0.5 bg-primary/10 sm:block" />

                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="flex h-12 items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-bold text-primary shadow-sm dark:bg-background-dark">
                          14
                        </div>
                      </div>
                      <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                        예약금 확인
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="flex h-12 items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary font-bold text-white shadow-lg dark:border-background-dark">
                          22
                        </div>
                      </div>
                      <p className="text-center text-[10px] font-extrabold uppercase tracking-tighter text-primary">
                        오늘의 시술
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="flex h-12 items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-white text-sm font-bold text-primary dark:bg-background-dark">
                          15
                        </div>
                      </div>
                      <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                        결제 대기
                      </p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="flex h-12 items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-sm font-bold text-emerald-600 dark:border-background-dark">
                          33
                        </div>
                      </div>
                      <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-emerald-600">
                        완료
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="space-y-6">
                <section className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
                  <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold">디자인 라이브러리</h3>
                      <p className="text-xs text-slate-400">시즌별 카탈로그 관리</p>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-primary/20 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      <span className="material-icons text-sm" aria-hidden="true">
                        add_photo_alternate
                      </span>
                      레퍼런스 등록
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                    {designItems.map((item) => (
                      <div
                        key={item.name}
                        className="group relative aspect-square overflow-hidden rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
                          <p className="text-[10px] font-bold text-white">{item.name}</p>
                          <p className="text-[10px] text-white/80">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <aside className="h-fit w-full rounded-xl border border-primary/5 bg-white shadow-sm dark:bg-background-dark xl:sticky xl:top-6 xl:w-[26rem]">
              <div className="flex items-center justify-between border-b border-primary/5 p-6">
                <h3 className="flex items-center gap-2 font-bold">
                  <span className="material-icons text-lg text-primary" aria-hidden="true">
                    event_note
                  </span>
                  오늘 일정
                </h3>
                <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase dark:bg-white/5">
                  5월 12일
                </span>
              </div>
              <div className="max-h-[560px] space-y-8 overflow-y-auto p-6">
                {scheduleItems.map((item) => (
                  <div
                    key={`${item.time}${item.customer}`}
                    className={cn(
                      "relative border-l-2 border-primary/10 py-1 pl-8",
                      item.variant === "faded" && "opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-white dark:border-background-dark",
                        item.variant === "current" && "bg-primary",
                        item.variant === "faded" && "bg-slate-200 dark:bg-slate-700",
                        item.variant === "active" && "bg-primary/40",
                        item.variant === "upcoming" && "bg-primary/20"
                      )}
                    />
                    <p
                      className={cn(
                        "text-[10px] font-bold",
                        item.variant === "faded" && "text-slate-500",
                        item.variant === "current" && "text-primary uppercase",
                        item.variant === "active" && "text-primary",
                        item.variant === "upcoming" && "text-slate-400"
                      )}
                    >
                      {item.time}
                    </p>
                    <h4 className="mt-1 text-sm font-bold">{item.customer}</h4>
                    <p className="text-xs text-slate-500">{item.service}</p>
                    {item.tag ? (
                      <div className="mt-2 flex gap-1">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {item.tag}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="border-t border-primary/5 p-6">
                <button
                  type="button"
                  className="w-full rounded-lg border border-dashed border-primary/30 py-3 text-xs font-bold text-slate-500 transition-colors hover:border-primary hover:text-primary"
                >
                  + 일정 추가
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          aria-label="채팅 열기"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-110"
        >
          <span className="material-icons" aria-hidden="true">
            chat
          </span>
        </button>
      </div>
    </div>
  );
}
