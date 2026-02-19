import type {BookingsRevenueCardViewData} from "@/features/bookings/presenter/booking-view-mapper";
import {MetricCard} from "@/components/ui/metric-card";

export interface BookingsRevenueCardsViewProps {
  items: BookingsRevenueCardViewData[];
}

export function BookingsRevenueCards({ items }: BookingsRevenueCardsViewProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <MetricCard
          key={item.key}
          label={item.label}
          value={item.amount}
          icon={item.icon}
          wrapperClassName="rounded-[28px] border border-border bg-card px-6 py-5 shadow-[0_1px_0_rgba(15,23,42,0.03)] dark:border-white/10 dark:bg-background-dark"
          labelClassName="mb-2 text-sm font-bold text-slate-400"
          valueClassName="text-[30px] font-extrabold leading-none tracking-tight text-slate-800 dark:text-white"
          iconWrapperClassName={item.iconClassName}
          iconClassName="text-2xl"
        />
      ))}
    </div>
  );
}
