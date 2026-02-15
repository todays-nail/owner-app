/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { DashboardSignOutButton } from "@/features/auth/dashboard-sign-out-button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
  badge?: string;
};

type DesignItem = {
  name: string;
  price: string;
  image: string;
};

type ScheduleItem = {
  time: string;
  customer: string;
  service: string;
  variant: "current" | "faded" | "active" | "upcoming";
  tag?: string;
};

const navItems: NavItem[] = [
  { label: "대시보드", href: "/", icon: "dashboard", active: true },
  { label: "예약 관리", href: "/bookings", icon: "calendar_today" },
  { label: "디자인 라이브러리", href: "/references", icon: "photo_library" },
  {
    label: "견적 및 채팅",
    href: "#",
    icon: "chat_bubble_outline",
    badge: "4"
  }
];

const designItems: DesignItem[] = [
  {
    name: "골든 샌드",
    price: "₩75,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMtvnCLpwiK62QJZEMACoktg6E0V_yzUy9b38JzKROLCoHL1iMcBklikV-MfjI81XokGcxGi4npM0FsL7ZFcixi9zlQ8VtAcyyJfa0k_izT_zEOHie-dpNyYwXJXNyAGJPHAvaQiut6nHg3f7yaLT2R0eHrKwoPfA-NUSJSpwlhrhTYH0ow0BlPsLZh-y0N6KA3ef4P2ZcwyrG6vsnEse27eccxhb-8k-nLg3VeCOSaTTpBadqRqVdKZYjrtSaPs1_UvgtZJDfodg"
  },
  {
    name: "아우라 핑크",
    price: "₩85,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADJ9s0xYk6wrfsXJE6CHcqWuxxJ-tdNYYVqveG2mplgSQCxgHrsd3nykgz_5rgYsbELmJcguwXG4UkuFyFb3VzIOYTJt0IfTkDRcIllg_E-M9i71BsktFzaCUvo_ktc6KoF2fvYGtwfK8bFMFjassAqGAlvCirE50EvrhjRap6paPugWJSBbYATXn_O6HYgK5kCN5sjYZit0WVqRlN26Pu2tnTu6VS-rP_aptI5VCavj_HdyDc2alLW8sYN6sT8y4Keabl2fGO0-o"
  },
  {
    name: "딥 씨 마블",
    price: "₩95,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARU91bmKufROkKoz257tweQ2rooH5bozrE_CYsK32VKP21s6QBkkswNU2EysCSsEnyvzRQSMNRqWowB_waFfN5UsQUBYvHrPc7YeaRW7yqc7IYQ-2wEcFmXwSAlkXmwi2yDdPPoclBhXCUiiyoMKITR3xSp5z6IfVdwncTX22M_p01Hbw58pVwWcNgDx2ptp7Qv_5wxL39a4AJd3vxZDjB5WyeGqhwCGT1IxTOD70QSkFNwuvZOWFBnlnn4AbdZZvwlfLdsnsErz4"
  },
  {
    name: "매트 스프링",
    price: "₩70,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZBpofl5rPS_t0zN3mDnpTFtoILsMBwvQ-eGT6ej4di_URTW8V30igYidvlt9bScndcvwp2JFS3qWg7i_i1Kf6eG43T7Z420Uegq9slQYPATb0GmrVlQ9QESgk4zlo0U82iqVe4owovnQZasQExDmj8baR6oLAItIiyEO8kSvItRGq-U8gtTMr5V04CEM6Ry12K6KKbRFBq0f7fQFQqgN4dZ1q-pNTxEXO16IGqzQvQd60Y1ii1KMXx-3RE91Q0kIKflfk3kcNAxA"
  }
];

const scheduleItems: ScheduleItem[] = [
  {
    time: "11:00 AM — 12:30 PM",
    customer: "이민희 고객님",
    service: "그라데이션 + 스톤 아트",
    variant: "current",
    tag: "특별 관리"
  },
  {
    time: "01:30 PM — 02:00 PM",
    customer: "박지원 고객님",
    service: "단순 젤 제거",
    variant: "faded"
  },
  {
    time: "02:30 PM — 04:00 PM",
    customer: "오현지 고객님",
    service: "클래식 프렌치 + 크롬 파우더",
    variant: "active"
  },
  {
    time: "04:30 PM — 06:00 PM",
    customer: "최수빈 고객님",
    service: "전체 연장 + 버터플라이 아트",
    variant: "active"
  },
  {
    time: "06:30 PM — 07:30 PM",
    customer: "강유진 고객님",
    service: "원톤 젤 + 케어",
    variant: "upcoming"
  },
  {
    time: "08:00 PM — 09:30 PM",
    customer: "정다은 고객님",
    service: "이달의 아트 (5월)",
    variant: "upcoming"
  }
];

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="owner-dashboard-root owner-dashboard-fit-root">
      <div className="owner-dashboard-fit">
        <aside className="w-full border-b border-primary/10 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r dark:bg-background-dark/50">
        <div className="p-8">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary">
            <span className="material-icons" aria-hidden="true">
              spa
            </span>
            ONEUL{" "}
            <span className="rounded-full border border-primary px-2 py-0.5 text-[10px] font-normal uppercase tracking-widest">
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
                <span className="font-medium">{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </>
            );

            const baseClassName =
              "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors";
            const className = item.active
              ? cn(baseClassName, "bg-primary text-white shadow-sm")
              : cn(
                  baseClassName,
                  "text-slate-600 hover:bg-primary/5 hover:text-primary dark:text-slate-400"
                );

            if (item.href === "#") {
              return (
                <a key={item.label} href={item.href} className={className}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.label} href={item.href} className={className}>
                {content}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-primary/5 p-6 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-primary/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <span className="material-icons text-primary" aria-hidden="true">
                person
              </span>
            </div>
            <div>
              <p className="text-xs font-bold">김지연</p>
              <p className="text-[10px] opacity-70">원장</p>
            </div>
          </div>
          <DashboardSignOutButton />
        </div>
        </aside>

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
                <div className="relative">
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark" />
                  <button
                    type="button"
                    aria-label="알림 보기"
                    className="rounded-lg bg-white p-2 text-slate-400 shadow-sm dark:bg-background-dark"
                  >
                    <span className="material-icons" aria-hidden="true">
                      notifications
                    </span>
                  </button>
                </div>
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
                <a
                  href="#"
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-400 transition-all hover:text-primary dark:border-slate-700"
                >
                  더보기
                  <span className="material-icons text-sm" aria-hidden="true">
                    chevron_right
                  </span>
                </a>
              </div>

              <div className="relative grid grid-cols-2 gap-6 px-0 sm:grid-cols-4 sm:px-10">
                <div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-primary/10 sm:block" />

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white text-sm font-bold text-primary shadow-sm dark:bg-background-dark">
                    14
                  </div>
                  <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                    예약금 확인
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary font-bold text-white shadow-lg dark:border-background-dark">
                    22
                  </div>
                  <p className="text-center text-[10px] font-extrabold uppercase tracking-tighter text-primary">
                    오늘의 시술
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-white text-sm font-bold text-primary dark:bg-background-dark">
                    15
                  </div>
                  <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                    결제 대기
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-sm font-bold text-emerald-600 dark:border-background-dark">
                    33
                  </div>
                  <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-emerald-600">
                    완료
                  </p>
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
                    <div key={item.name} className="group relative aspect-square overflow-hidden rounded-lg">
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

              <section className="rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-bold">
                    <span className="material-icons text-lg text-primary" aria-hidden="true">
                      question_answer
                    </span>
                    신규 견적 요청
                  </h3>
                  <a href="#" className="text-[10px] font-bold text-primary underline">
                    모든 메시지 보기
                  </a>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 rounded-lg border border-primary/5 bg-nude-soft p-4 dark:bg-white/5">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIil0uqKlP4ba_px3aR3ONLUYkh-j_p6kZyCfhCfnIk5tFhrqgdMX09Z3JfmszOM4BgxSOzAD8TMyv47w8d4Yp8B9rIN8tyQJsPIlDnUrCnahqTaH1vt24pm5v0xg4J3yPy6k5P72p_Sf3afli8DWx6zZn-xGXhqxvc5PvJgGzRg9jDTYVJc46cYGSZCCjMqBW4wIkktKqsw5Uu5Et0Tsi93R5KG-hiBkenorby89ULifzpX-PVRtXnl3oYFnIzmEDwnRiZjpUO-A"
                        alt="Hanna J."
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-tight">Hanna J.</h4>
                        <span className="text-[10px] text-slate-400">2분 전</span>
                      </div>
                      <p className="mt-1 overflow-hidden text-[11px] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        &quot;웨딩용으로 이 정도 길이 가능한가요? 다음 주 토요일
                        오전까지 필요해요. 타샵 제거 포함하면 얼마일까요?&quot;
                      </p>
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="금액 입력 (₩)..."
                          className="flex-1 rounded border border-primary/10 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-background-dark"
                        />
                        <button
                          type="button"
                          className="rounded bg-primary px-3 py-1.5 text-xs font-bold text-white transition-shadow hover:shadow-md"
                        >
                          제안 보내기
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 rounded-lg border border-primary/5 bg-nude-soft p-4 dark:bg-white/5">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB59cKEqNi5BnN3mAvSaIBIOjMJIxPjGU5VoxbnfX7eSYOhCjfTN-9cq9ID7hKXVquGHVID74XHO1bNK4sWcTq_KYKtMZWbOsEkgCeVaOFSPS7rV5Zj7vrS5c45nRyMMcPmgzfXSIW7DYS1TEl0G_Vz1J5-YRrUGgAKa7An73R8TlpCW5YYXRpvY0B8K0nHBmolW_PWGogBCDd_t4g39NcZrGX-WuV7YeKcEsVLz5VawA8HgoUgSn1ss7RnlP7ylBeSNeja_Wh_H5o"
                        alt="Sarah Moon"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-tight">
                          Sarah Moon
                        </h4>
                        <span className="text-[10px] text-slate-400">1시간 전</span>
                      </div>
                      <p className="mt-1 overflow-hidden text-[11px] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        &quot;5월 20일에 심플한 원톤 젤 예약하고 싶어요. 손톱이 아주
                        짧은데 가능할까요?&quot;
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                          <span className="material-icons text-[14px]" aria-hidden="true">
                            check_circle
                          </span>
                          제안 완료: ₩45,000
                        </span>
                        <button
                          type="button"
                          className="ml-auto text-[10px] font-bold text-slate-400 hover:text-primary"
                        >
                          다시 채팅하기
                        </button>
                      </div>
                    </div>
                  </div>
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
