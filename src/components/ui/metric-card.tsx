import type {ReactNode} from "react";

import {cn} from "@/lib/utils";

export interface MetricCardProps {
  label: ReactNode;
  value: ReactNode;
  icon: string;
  helper?: ReactNode;
  wrapperClassName?: string;
  contentClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  helper,
  wrapperClassName,
  contentClassName,
  labelClassName,
  valueClassName,
  iconWrapperClassName,
  iconClassName
}: MetricCardProps) {
  return (
    <article
      className={cn(
        "flex items-center justify-between rounded-xl border border-primary/5 bg-white p-6 shadow-sm dark:bg-background-dark",
        wrapperClassName
      )}
    >
      <div className={contentClassName}>
        <p className={cn("text-sm font-medium text-slate-500", labelClassName)}>
          {label}
        </p>
        <h3 className={cn("text-3xl font-extrabold tracking-tight", valueClassName)}>
          {value}
        </h3>
        {helper}
      </div>

      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          iconWrapperClassName
        )}
      >
        <span
          className={cn("material-icons text-[22px]", iconClassName)}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
    </article>
  );
}
