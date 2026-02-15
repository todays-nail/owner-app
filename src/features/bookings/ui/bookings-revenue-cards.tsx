const REVENUE_ITEMS = [
  {
    key: "today",
    label: "오늘 총 매출",
    amount: "₩840,000",
    icon: "payments",
    iconClassName: "bg-emerald-100 text-emerald-600"
  },
  {
    key: "month",
    label: "이번 달 누적 매출",
    amount: "₩12,450,000",
    icon: "bar_chart",
    iconClassName: "bg-primary/10 text-primary"
  }
] as const;

export function BookingsRevenueCards() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {REVENUE_ITEMS.map((item) => (
        <article
          key={item.key}
          className="flex items-center justify-between rounded-[28px] border border-[#efe6e2] bg-[#fdfaf9] px-6 py-5 shadow-[0_1px_0_rgba(15,23,42,0.03)] dark:border-white/10 dark:bg-background-dark"
        >
          <div>
            <p className="mb-2 text-sm font-bold text-slate-400">{item.label}</p>
            <h3 className="text-[42px] font-extrabold leading-none tracking-tight text-slate-800 dark:text-white">
              {item.amount}
            </h3>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconClassName}`}
          >
            <span className="material-icons text-2xl" aria-hidden="true">
              {item.icon}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
