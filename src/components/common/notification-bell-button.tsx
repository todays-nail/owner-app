import type {MouseEventHandler} from "react";

import {cn} from "@/lib/utils";

type NotificationBellVariant = "dashboard" | "bookings";

interface NotificationBellButtonProps {
  variant: NotificationBellVariant;
  showUnreadDot?: boolean;
  unreadCount?: number;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const variantClassMap: Record<
  NotificationBellVariant,
  { dot: string; button: string; icon: string }
> = {
  dashboard: {
    dot: "right-0 top-0 h-2 w-2 rounded-full bg-primary ring-2 ring-white dark:ring-background-dark",
    button: "rounded-lg bg-white p-2 text-slate-400 shadow-sm dark:bg-background-dark",
    icon: "material-icons"
  },
  bookings: {
    dot: "right-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-white",
    button:
      "rounded-xl border border-primary/10 bg-white p-2.5 text-slate-400 shadow-sm transition-colors hover:text-primary dark:bg-background-dark",
    icon: "material-icons text-[22px]"
  }
};

export function NotificationBellButton({
  variant,
  showUnreadDot = true,
  unreadCount,
  ariaLabel = "알림 보기",
  ariaExpanded,
  ariaControls,
  onClick,
  className
}: NotificationBellButtonProps) {
  const classes = variantClassMap[variant];
  const hasUnread = showUnreadDot && (unreadCount !== undefined ? unreadCount > 0 : true);
  const unreadCountLabel = unreadCount ? (unreadCount > 99 ? "99+" : `${unreadCount}`) : "0";

  return (
    <div className={cn("relative", className)}>
      {hasUnread ? (
        <span className={cn("absolute", classes.dot)}>
          <span className="sr-only">미확인 알림 {unreadCountLabel}건</span>
        </span>
      ) : null}
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        className={cn(
          "inline-flex items-center justify-center leading-none",
          classes.button
        )}
        onClick={onClick}
      >
        <span className={cn("block leading-none", classes.icon)} aria-hidden="true">
          notifications
        </span>
      </button>
    </div>
  );
}
