import * as React from "react";

import { cn } from "@/lib/utils";

export type ChipVariant =
  | "open-status"
  | "count-neutral"
  | "count-warning"
  | "count-success"
  | "count-info"
  | "time-default"
  | "time-strike"
  | "time-now"
  | "time-next"
  | "time-success"
  | "status-default"
  | "status-warning"
  | "status-success"
  | "status-attention";

export type ChipSize = "xs" | "sm";

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: ChipVariant;
  size?: ChipSize;
  leadingDotClassName?: string;
  leadingDotPulse?: boolean;
}

const SIZE_CLASS_MAP: Record<ChipSize, string> = {
  xs: "px-2 py-0.5 text-[10px]",
  sm: "px-2.5 py-1 text-xs"
};

const VARIANT_CLASS_MAP: Record<ChipVariant, string> = {
  "open-status": "rounded-full border border-emerald-300 bg-emerald-100 text-emerald-700",
  "count-neutral":
    "rounded-full border border-slate-300 bg-slate-100 text-slate-500 shadow-sm dark:border-slate-700 dark:bg-white/5",
  "count-warning": "rounded-full border border-orange-200 bg-orange-50 text-orange-500 shadow-sm",
  "count-success": "rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm",
  "count-info": "rounded-full border border-sky-200 bg-sky-50 text-sky-600 shadow-sm",
  "time-default": "rounded-full bg-slate-100 text-slate-500",
  "time-strike": "rounded-full bg-slate-100 text-slate-400 line-through",
  "time-now":
    "rounded-full border border-orange-400/40 bg-orange-500 text-white shadow-sm tracking-wide",
  "time-next":
    "rounded-full border border-slate-600/40 bg-slate-800 text-white shadow-sm tracking-wide",
  "time-success": "rounded-full bg-emerald-50 text-emerald-600",
  "status-default": "rounded-md bg-slate-100 text-slate-500",
  "status-warning": "rounded-md bg-yellow-50 text-yellow-700",
  "status-success": "rounded-md bg-emerald-100 text-emerald-600",
  "status-attention": "rounded-md bg-orange-50 text-orange-600"
};

export function Chip({
  variant,
  size = "xs",
  leadingDotClassName,
  leadingDotPulse = false,
  className,
  children,
  ...props
}: ChipProps) {
  const shouldRenderDot = variant === "open-status" && Boolean(leadingDotClassName);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold leading-tight",
        SIZE_CLASS_MAP[size],
        VARIANT_CLASS_MAP[variant],
        className
      )}
      {...props}
    >
      {shouldRenderDot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            leadingDotClassName,
            leadingDotPulse && "animate-pulse"
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
