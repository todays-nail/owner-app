import Image from "next/image";
import Link from "next/link";

import { AppLaunchLogo } from "@/components/brand/app-launch-logo";
import SentenceLines from "@/components/ui/sentence-lines";
import { createPageMetadata } from "@/lib/metadata";

const challenges = [
  {
    icon: "textsms",
    title: "반복되는 예약 문자",
    description:
      "시술 중에 예약 문의까지, 복사해서 붙여넣고, 또 수십번 보내고 있지는 않나요?"
  },
  {
    icon: "calculate",
    title: "복잡한 금액 산출",
    description:
      "파츠 추가, 회원권 차감, 노쇼 방지 예약금 정산까지. 시술 시간보다 계산 시간이 더 스트레스라면."
  },
  {
    icon: "history",
    title: "기억에 의존하는 관리",
    description:
      "답장은 했는데 확정은 아닌 상태, 예약금은 아직인 상태 예약 확정이 애매한 상태들."
  }
];

const trendCards = [
  {
    title: "실키 베이지",
    score: "하트 1,284",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuA06RT-65mF0RGZIBfsbukjw_g3yf1DwIW3PHku-vgWErZ3krqfsRQJxXGjWakfedzU9Whm3SolRF_uowV_Z-0EIo0cUT9Pg1hj79irfgGeM_6Rtaim6tM4BK0f7bDD1Wmc8fzDJLVgS7AIQtBrbRPV_r27gogvWeUSSjMHnxrzt5rls5avbExpysa-ahzEAWDnNVAD48gVVnKes0GEqE4DAfz1IqGGI-iyZZUSze3prP1Ety79Bq6XPF97Z7SX_eP6KitmDqHmiF"
  },
  {
    title: "딥 포레스트",
    score: "하트 1,097",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnYF2o8FDvhYWBfe9lOoLXfB1Tz47zWMQGK6C9jRiFR22W_slPOfF1r87_UxBKLb8_2DTboUF1ycq0zIijE-r-5VlmHhByZkcL48_0VqgL2iq7cxJhOx1Se0UNk04RKKRy-5MbzHyuaXyXeUKHikCSswjYwcxQvoJLwI840xV8gT8JTdBBQ9vu4wLkVCqpsTFCh8XHsWP6qOZMpNdEhyye9vvXC3R5Ej0lF-vbi-7uLGP2UcGm42nwOVpVeEIkJK5WFog3catUPuMX"
  },
  {
    title: "선셋 코랄",
    score: "하트 956",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2wbs9vlfx1276bFQfolsXeZu4CUV80YgB8DCvxNhMYUc7RTsLMOXxR70E9pXzkwl4q5RNTLA3ILmJ0XP2dGBCVwNaBPntIf02krh7jaq3OBBQvqhZGoGtsVaScN81wxITqnabrZxY1o5lWXQm-hcijWFeh4dwhEJAaf0qghAJ1rty-ZKR8n13GhlZQKkveR8-qfu1L-Eulv2aAp5qARzT7BDfAGGIjqnWftefbjlwvz_csoCXKbTMWSWVcO5lT4rxxdHsRAKTVIWT"
  },
  {
    title: "글리터 클리어",
    score: "하트 1,322",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyplNi-ToSERYfkbgod4vA3gbY1UcUHDF2BMZUgBYnb-V6uSmvyx9p7EbtGnqasjAWPZapNe2gHYbUdpJ9yJQCFVCobL0ETKPlOk6gkvule48m8TGpcfkiSJMArnYaeh_uSscUzLaDSvgkKwhWFD8M8WbDJLhvjdo4v-RBza3nVQicEcux_5rLJJ6pl3w5DcpN7bit9ilupjQEwLkeBXmVCio7fckL-FnJA9sQHvA46l9Z4KNGzuBRikS3I70zwDZvsRS6WrKRQWg_"
  }
];

const START_HREF = "/signup";
const LOGIN_HREF = "/login";

export const metadata = createPageMetadata({
  title: "오늘 네일 - 사장님 운영 플랫폼",
  description: "네일 샵 운영을 위한 예약 운영 플랫폼 오늘 네일",
  noIndex: false
});

export default function OwnerMarketingPage() {
  return (
    <div className="landing-readable bg-background-light font-display text-zinc-900 antialiased dark:bg-background-dark dark:text-zinc-100">
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background-light/80 backdrop-blur-md dark:border-white/10 dark:bg-background-dark/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link className="flex items-center gap-2" href="/">
            <AppLaunchLogo size="sidebar" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              href="/user"
            >
              사용자 페이지
            </Link>
            <Link
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              href={LOGIN_HREF}
            >
              로그인
            </Link>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden pb-20 pt-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            샵 운영, 이렇게까지 <br />
            <span className="text-primary">복잡해야 할까요?</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg opacity-60">
            <SentenceLines text={'예약 현황을 한눈에, 반복되는 상담을 예약 확정으로. "오늘 네일"은 네일 아티스트를 위한 예약 운영 플랫폼입니다.'} />
          </p>

          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-xl border border-border bg-white p-4 shadow-2xl dark:border-white/5 dark:bg-zinc-800 md:p-8">
              <div className="mb-8 flex items-center gap-4 border-b border-border pb-4 dark:border-white/5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="h-6 w-px bg-border dark:bg-white/10" />
                <div className="text-xs font-semibold opacity-40">오늘 네일 대시보드</div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                  <div className="flex h-64 flex-col justify-between rounded-lg bg-background-light p-6 dark:bg-zinc-900">
                    <div className="flex items-start justify-between">
                      <div className="text-left">
                        <p className="mb-1 text-xs font-medium opacity-50">오늘의 예약 현황</p>
                        <h3 className="text-2xl font-bold">12건의 시술 예정</h3>
                      </div>
                      <span className="rounded bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                        LIVE
                      </span>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="h-32 flex-1 rounded-t-md bg-primary/20" />
                      <div className="h-20 flex-1 rounded-t-md bg-primary/10" />
                      <div className="h-40 flex-1 rounded-t-md bg-primary/30" />
                      <div className="h-28 flex-1 rounded-t-md bg-primary/20" />
                      <div className="h-36 flex-1 rounded-t-md bg-primary" />
                    </div>
                  </div>
                </div>

                <div className="col-span-4 space-y-4">
                  <div className="rounded-lg border border-border bg-zinc-50 p-4 text-left dark:border-white/5 dark:bg-zinc-900">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-50">Next up</p>
                    <p className="text-sm font-bold">김지민 고객님 (14:00)</p>
                    <p className="text-xs opacity-50">그라데이션 + 파츠 추가</p>
                  </div>
                  <div className="rounded-lg border border-border bg-zinc-50 p-4 text-left dark:border-white/5 dark:bg-zinc-900">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
                      Unconfirmed
                    </p>
                    <p className="text-sm font-bold">이서윤 고객님 (16:30)</p>
                    <p className="text-xs opacity-50">노쇼 방지 예약금 대기중</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-muted py-24 dark:bg-zinc-900/50" id="pain-points">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">이런 하루, 익숙하지 않으세요?</h2>
            <p className="opacity-60">네일 아티스트의 하루가 고객과의 순간으로 채워지도록</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {challenges.map((challenge) => (
              <div
                key={challenge.title}
                className="rounded-xl border border-border bg-white p-8 shadow-sm dark:border-white/5 dark:bg-zinc-800"
              >
                <div className="mb-6 text-primary">
                  <span className="material-symbols-outlined text-4xl">{challenge.icon}</span>
                </div>
                <h4 className="mb-3 text-xl font-bold">{challenge.title}</h4>
                <p className="text-sm leading-relaxed opacity-60">
                  <SentenceLines text={challenge.description} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-32 dark:bg-background-dark" id="workflow-system">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-primary">
                Workflow System
              </span>
              <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight">
                예약상담부터 예약금, 결제까지 이어집니다.
              </h2>
              <p className="mb-8 leading-relaxed opacity-60">
                <SentenceLines text="단순한 캘린더를 넘어 상담이 곧바로 매출로 연결되는 구조를 설계했습니다. 견적 제안부터 수락, 예약금 입금까지 물 흐르듯 이어지는 자동화 프로세스를 경험하세요." />
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                  <span className="text-sm font-medium">견적 제안부터 수락까지 원클릭 전환</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                  <span className="text-sm font-medium">자동화된 예약금 입금 안내 및 대기 상태 관리</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                  <span className="text-sm font-medium">입금 확인 시 즉시 예약 확정 및 캘린더 동기화</span>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-xl border-l-4 border-primary bg-background-light p-5 dark:bg-zinc-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    1
                  </div>
                  <div>
                    <h5 className="text-sm font-bold">Custom Quote (견적)</h5>
                    <p className="text-xs opacity-50">고객 요청에 따른 맞춤형 가격 및 시간 제안</p>
                  </div>
                </div>
                <div className="ml-8 flex items-center gap-4 rounded-xl border-l-4 border-primary/40 bg-background-light p-5 opacity-80 dark:bg-zinc-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-sm font-bold text-primary/60">
                    2
                  </div>
                  <div>
                    <h5 className="text-sm font-bold">Acceptance (수락)</h5>
                    <p className="text-xs opacity-50">고객의 옵션 선택 및 예약 대기 자동 생성</p>
                  </div>
                </div>
                <div className="ml-16 flex items-center gap-4 rounded-xl border-l-4 border-primary/20 bg-background-light p-5 opacity-60 dark:bg-zinc-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-sm font-bold text-primary/40">
                    3
                  </div>
                  <div>
                    <h5 className="text-sm font-bold">Deposit Payment (입금)</h5>
                    <p className="text-xs opacity-50">예약금 확인 후 확정 상태로 자동 전환</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-gradient-to-b from-primary/5 to-white py-32 dark:from-zinc-900 dark:to-background-dark">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">상담이 곧바로 예약으로 이어집니다</h2>
            <p className="mx-auto max-w-2xl text-lg opacity-60">
              비채팅 견적 요청서부터 수락과 동시에 예약금 발송까지.
            </p>
          </div>

          <div className="relative">
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-5">
              <div className="relative">
                <div className="flex h-full min-h-[280px] w-full flex-col rounded-2xl border border-white/50 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/5 dark:bg-zinc-800">
                  <div className="mb-3 flex h-6 w-12 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    STEP 1
                  </div>
                  <h4 className="mb-4 text-base font-bold">커스텀 견적 요청서</h4>
                  <div className="flex-1 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-zinc-900/50">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-primary">image</span>
                      <span className="text-[10px] font-medium opacity-50">Image Uploaded</span>
                    </div>
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        alt="Custom nail art sample"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuA06RT-65mF0RGZIBfsbukjw_g3yf1DwIW3PHku-vgWErZ3krqfsRQJxXGjWakfedzU9Whm3SolRF_uowV_Z-0EIo0cUT9Pg1hj79irfgGeM_6Rtaim6tM4BK0f7bDD1Wmc8fzDJLVgS7AIQtBrbRPV_r27gogvWeUSSjMHnxrzt5rls5avbExpysa-ahzEAWDnNVAD48gVVnKes0GEqE4DAfz1IqGGI-iyZZUSze3prP1Ety79Bq6XPF97Z7SX_eP6KitmDqHmiF"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 rounded bg-primary/5 p-2 text-[10px] text-primary">
                      <span className="material-symbols-outlined text-xs">analytics</span>
                      <span>AI 분석 완료</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 md:flex">
                  <span className="material-symbols-outlined text-2xl text-primary/30">chevron_right</span>
                </div>
              </div>

              <div className="relative">
                <div className="flex h-full min-h-[280px] w-full flex-col rounded-2xl border border-white/50 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/5 dark:bg-zinc-800">
                  <div className="mb-3 flex h-6 w-12 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    STEP 2
                  </div>
                  <h4 className="mb-4 text-base font-bold">샵 견적 응답</h4>
                  <div className="flex-1 space-y-3">
                    <div className="rounded-lg border border-border bg-zinc-50 p-3 dark:border-white/5 dark:bg-zinc-900">
                      <p className="mb-1 text-[10px] uppercase tracking-tighter opacity-40">Expected Price</p>
                      <p className="text-sm font-bold">₩ 85,000</p>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-white p-3 shadow-sm shadow-primary/5 dark:bg-zinc-800">
                      <p className="mb-2 text-[10px] font-bold text-primary">Available Slots</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between rounded bg-zinc-50 px-2 py-1 text-[10px] dark:bg-zinc-700">
                          <span>Oct 26</span>
                          <span className="font-bold">14:00</span>
                        </div>
                        <div className="flex justify-between rounded bg-zinc-50 px-2 py-1 text-[10px] dark:bg-zinc-700">
                          <span>Oct 26</span>
                          <span className="font-bold">16:30</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 md:flex">
                  <span className="material-symbols-outlined text-2xl text-primary/30">chevron_right</span>
                </div>
              </div>

              <div className="relative">
                <div className="flex h-full min-h-[280px] w-full flex-col rounded-2xl border border-white/50 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/5 dark:bg-zinc-800">
                  <div className="mb-3 flex h-6 w-12 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    STEP 3
                  </div>
                  <h4 className="mb-4 text-base font-bold">사용자 샵 선택</h4>
                  <div className="flex-1">
                    <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
                      <p className="mb-3 text-[10px] opacity-50">Time Selection</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded border border-border py-2 text-center text-[10px] dark:border-white/10">
                          14:00
                        </div>
                        <div className="rounded border-2 border-primary bg-primary/5 py-2 text-center text-[10px] font-bold text-primary">
                          16:30
                        </div>
                      </div>
                    </div>
                    <Link
                      className="block w-full rounded-lg bg-primary py-2 text-center text-xs font-bold text-white shadow-lg shadow-primary/20"
                      href={START_HREF}
                    >
                      예약하기
                    </Link>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 md:flex">
                  <span className="material-symbols-outlined text-2xl text-primary/30">chevron_right</span>
                </div>
              </div>

              <div className="relative">
                <div className="flex h-full min-h-[280px] w-full flex-col rounded-2xl border border-white/50 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-white/5 dark:bg-zinc-800">
                  <div className="mb-3 flex h-6 w-12 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    STEP 4
                  </div>
                  <h4 className="mb-4 text-base font-bold">예약 생성</h4>
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                      <span className="material-symbols-outlined text-amber-500">pending_actions</span>
                    </div>
                    <span className="mb-3 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase text-amber-600">
                      Pending Deposit
                    </span>
                    <p className="px-2 text-xs leading-relaxed opacity-60">
                      예약금 입금 확인 후
                      <br />
                      최종 확정됩니다.
                    </p>
                  </div>
                </div>
                <div className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 md:flex">
                  <span className="material-symbols-outlined text-2xl text-primary/30">chevron_right</span>
                </div>
              </div>

              <div>
                <div className="flex h-full min-h-[280px] w-full flex-col rounded-2xl border border-primary/20 bg-primary/[0.02] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="mb-3 flex h-6 w-12 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    STEP 5
                  </div>
                  <h4 className="mb-4 text-base font-bold">예약 확정</h4>
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                      <span className="material-symbols-outlined text-green-500">task_alt</span>
                    </div>
                    <div className="mb-4 flex flex-col gap-1">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-[9px] font-bold uppercase text-zinc-400 line-through">
                        Deposit Paid
                      </span>
                      <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-xs font-bold text-primary">예약이 완료되었습니다!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/5 to-transparent md:block" />
          </div>

          <div className="mt-20 flex justify-center">
            <Link
              className="group flex items-center gap-2 rounded-full border border-primary/10 bg-white px-8 py-4 text-sm font-bold text-primary shadow-xl shadow-primary/10"
              href="#workflow-system"
            >
              스마트 상담 기능 자세히 보기
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-muted py-24 dark:bg-zinc-900/50" id="trend-assistant">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                이달의 네일, <br />
                이제 혼자 고민하지 마세요.
              </h2>
              <p className="opacity-60">
                AI 트렌드 어시스턴트가 사용자들이 많이 선택한 디자인을 분석해 추천합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4" id="trend-grid">
            {trendCards.map((card) => (
              <div key={card.title} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-200">
                <Image
                  alt={card.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  src={card.src}
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-sm font-medium text-white">{card.title}</p>
                  <p className="text-[10px] text-white/70">{card.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 dark:bg-background-dark/60" id="pricing-policy">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Pricing Policy</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">지금은 무료로 시작하세요</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm opacity-60 md:text-base">
              초기에 빠르게 운영 흐름을 안정화할 수 있도록, 오늘 네일 사장님 서비스는 현재 무료로 제공합니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background-light p-6 text-left dark:border-white/10 dark:bg-zinc-900">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Policy 01</p>
              <h3 className="mt-3 text-lg font-bold">현재 이용료 0원</h3>
              <p className="mt-2 text-sm opacity-60">사장님 페이지 핵심 기능을 비용 부담 없이 바로 시작할 수 있습니다.</p>
            </div>
            <div className="rounded-xl border border-border bg-background-light p-6 text-left dark:border-white/10 dark:bg-zinc-900">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Policy 02</p>
              <h3 className="mt-3 text-lg font-bold">결제 정보 입력 없음</h3>
              <p className="mt-2 text-sm opacity-60">신용카드 등록 없이 계정 생성 후 즉시 운영 흐름을 구축할 수 있습니다.</p>
            </div>
            <div className="rounded-xl border border-border bg-background-light p-6 text-left dark:border-white/10 dark:bg-zinc-900">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Policy 03</p>
              <h3 className="mt-3 text-lg font-bold">초기 파트너 샵 운영 지원</h3>
              <p className="mt-2 text-sm opacity-60">초기 도입 샵의 예약 운영 셋업과 사용 가이드를 운영팀이 함께 지원합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background-light py-32 text-center dark:bg-background-dark" id="cta-register">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-6 text-4xl font-bold tracking-tight">이제 시술에만 집중하세요.</h2>
          <p className="mb-12 text-lg opacity-60">
            <SentenceLines text="시술 하는 동시에도 눈은 알림 따라 핸드폰만 보고 있진 않나요? 번거로운 운영은 '오늘 네일'이 대신 하겠습니다." />
          </p>
          <div className="flex justify-center">
            <Link
              className="rounded-xl bg-primary px-10 py-5 text-lg font-bold text-white shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02]"
              href={START_HREF}
            >
              사장님으로 등록하기
            </Link>
          </div>
          <p className="mt-8 text-xs opacity-40">현재 무료 제공 · 결제 정보 등록 불필요 · 운영팀 온보딩 지원</p>
        </div>
      </section>

      <footer className="border-t border-border py-12 opacity-60 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <Link className="flex items-center gap-2" href="/">
            <AppLaunchLogo size="sidebar" />
          </Link>

          <div className="flex gap-8 text-xs">
            <Link className="transition-colors hover:text-primary" href="/terms">
              이용약관
            </Link>
            <Link className="transition-colors hover:text-primary" href="/privacy">
              개인정보처리방침
            </Link>
            <Link className="transition-colors hover:text-primary" href="/login">
              고객센터
            </Link>
          </div>

          <p className="text-[10px]">© 2024 Oneul Nail Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
