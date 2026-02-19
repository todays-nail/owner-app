import Link from "next/link";

import { createPageMetadata } from "@/lib/metadata";
import SentenceLines from "@/components/ui/sentence-lines";
import { OneulNailLogo } from "@/components/brand/oneulnail-logo";

export const metadata = createPageMetadata({
  title: "오늘 네일 | Oneul Nail",
  description: "사장님과 사용자를 연결하는 오늘 네일 서비스 허브",
  noIndex: false
});

export default function RootHubPage() {
  return (
    <div className="promo-root landing-readable min-h-screen text-[#1A1A1A] antialiased">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 md:px-10">
        <header className="flex items-center justify-between py-2">
          <OneulNailLogo size="sidebar" />
          <Link
            className="rounded-lg border border-[#e5dfd8] bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            href="/login"
          >
            로그인
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">오늘 네일</h1>
            <p className="mt-4 text-base text-[#4A4A4A] md:text-xl">
              <SentenceLines text="서비스 유형을 선택해 원하는 페이지로 이동하세요." />
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <section className="glass-card flex flex-col rounded-[2rem] p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Owner</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">사장님 페이지</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4A4A4A] md:text-base">
                <SentenceLines text="예약 운영, 상담 흐름, 예약금/확정 프로세스를 소개하는 사장님 전용 홍보 페이지입니다." />
              </p>
              <Link
                className="btn-glass mt-8 inline-flex w-fit items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25"
                href="/owner"
              >
                사장님 페이지로 이동
                <span className="material-symbols-outlined ml-1 text-lg">arrow_right_alt</span>
              </Link>
            </section>

            <section className="glass-card flex flex-col rounded-[2rem] p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">User</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">사용자 페이지</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#4A4A4A] md:text-base">
                <SentenceLines text="내 손 피팅, 디자인 탐색, 예약 흐름을 소개하는 사용자 전용 홍보 페이지입니다." />
              </p>
              <Link
                className="btn-glass mt-8 inline-flex w-fit items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25"
                href="/user"
              >
                사용자 페이지로 이동
                <span className="material-symbols-outlined ml-1 text-lg">arrow_right_alt</span>
              </Link>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
