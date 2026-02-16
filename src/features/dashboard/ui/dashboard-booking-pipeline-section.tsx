import Link from "next/link";

export function DashboardBookingPipelineSection() {
  return (
    <section className="mb-6 rounded-xl border border-primary/5 bg-white p-4 shadow-sm sm:p-5 dark:bg-background-dark">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-lg font-bold tracking-tight">예약 파이프라인</h3>
          <p className="mt-1 text-xs italic text-slate-400">총 84건 진행 중</p>
        </div>
        <Link
          href="/bookings"
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-400 transition-all hover:text-primary dark:border-slate-700"
        >
          더보기
          <span className="material-icons text-sm" aria-hidden="true">
            chevron_right
          </span>
        </Link>
      </div>

      <div className="relative px-0 sm:px-6">
        <div className="pointer-events-none absolute left-0 right-0 top-5 hidden h-0.5 bg-primary/10 sm:block" />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex h-10 items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white text-xs font-bold text-primary shadow-sm dark:bg-background-dark">
                14
              </div>
            </div>
            <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-slate-500">
              예약금 확인
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex h-10 items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-primary font-bold text-white shadow-lg dark:border-background-dark">
                22
              </div>
            </div>
            <p className="text-center text-[10px] font-extrabold uppercase tracking-tighter text-primary">
              오늘의 시술
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex h-10 items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 bg-white text-xs font-bold text-primary dark:bg-background-dark">
                15
              </div>
            </div>
            <p className="text-center text-[10px] font-bold uppercase tracking-tighter text-slate-500">
              결제 대기
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex h-10 items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-xs font-bold text-emerald-600 dark:border-background-dark">
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
  );
}
