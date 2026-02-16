"use client";

import {type ReactNode, useEffect, useId, useMemo, useRef, useState} from "react";

import {Chip} from "@/components/ui/chip";
import type {NotificationItem, NotificationType} from "@/features/notifications/model/types";
import {cn} from "@/lib/utils";

type NotificationFilter = "all" | "unread";

interface TriggerRenderProps {
  isOpen: boolean;
  controlsId: string;
  toggle: () => void;
}

interface NotificationPopoverProps {
  items: NotificationItem[];
  isOpen: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: (ids: string[]) => void;
  onMarkRead?: (id: string) => void;
  onViewAll?: () => void;
  trigger: (props: TriggerRenderProps) => ReactNode;
  className?: string;
}

const typeVisualMap: Record<
  NotificationType,
  { icon: string; iconContainerClassName: string }
> = {
  booking: {
    icon: "calendar_month",
    iconContainerClassName: "bg-primary/10 text-primary"
  },
  chat: {
    icon: "chat_bubble",
    iconContainerClassName: "bg-sky-100 text-sky-600"
  },
  payment: {
    icon: "payments",
    iconContainerClassName: "bg-emerald-100 text-emerald-600"
  },
  system: {
    icon: "info",
    iconContainerClassName: "bg-slate-100 text-slate-600"
  }
};

export function NotificationPopover({
  items,
  isOpen,
  onOpenChange,
  onItemClick,
  onMarkAllRead,
  onMarkRead,
  onViewAll,
  trigger,
  className
}: NotificationPopoverProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const rootElement = rootRef.current;

      if (!rootElement) {
        return;
      }

      if (!rootElement.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      setFilter("all");
    }
  }, [isOpen]);

  const unreadCount = useMemo(
    () => items.filter((item) => !item.isRead).length,
    [items]
  );

  const unreadCountLabel = unreadCount > 99 ? "99+" : `${unreadCount}`;

  const filteredItems = useMemo(
    () => (filter === "unread" ? items.filter((item) => !item.isRead) : items),
    [filter, items]
  );

  const unreadTargetIds = useMemo(
    () => filteredItems.filter((item) => !item.isRead).map((item) => item.id),
    [filteredItems]
  );

  const handleToggle = () => {
    onOpenChange(!isOpen);
  };

  const handleMarkAllRead = () => {
    if (unreadTargetIds.length === 0) {
      return;
    }

    if (onMarkAllRead) {
      onMarkAllRead(unreadTargetIds);
      return;
    }

    unreadTargetIds.forEach((id) => onMarkRead?.(id));
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      onMarkRead?.(item.id);
    }

    onItemClick?.(item);
    onOpenChange(false);
  };

  const handleViewAll = () => {
    onViewAll?.();
    onOpenChange(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {trigger({ isOpen, controlsId: panelId, toggle: handleToggle })}

      {isOpen ? (
        <section
          id={panelId}
          role="dialog"
          aria-label="알림"
          className="absolute right-0 top-full z-50 mt-2 w-[360px] max-h-[480px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-surface-dark"
        >
          <header className="flex items-center justify-between border-b border-primary/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">알림</h3>
              <Chip variant="count-neutral" size="xs">
                {unreadCountLabel}건
              </Chip>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadTargetIds.length === 0}
              className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:text-slate-400"
            >
              모두 읽음
            </button>
          </header>

          <div className="border-b border-primary/10 px-4 py-2.5">
            <div className="inline-flex rounded-full bg-slate-100 p-1 dark:bg-white/10">
              <button
                type="button"
                onClick={() => setFilter("all")}
                aria-pressed={filter === "all"}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  filter === "all"
                    ? "bg-white text-slate-800 shadow-sm dark:bg-surface-dark dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-300"
                )}
              >
                전체
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                aria-pressed={filter === "unread"}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  filter === "unread"
                    ? "bg-white text-slate-800 shadow-sm dark:bg-surface-dark dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-300"
                )}
              >
                미확인
              </button>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="custom-scrollbar max-h-[360px] overflow-y-auto">
              <ul>
                {filteredItems.map((item) => {
                  const visual = typeVisualMap[item.type];

                  return (
                    <li key={item.id} className="relative border-b border-primary/5 last:border-b-0">
                      {!item.isRead ? (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 top-0 w-[3px] bg-primary"
                        />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex min-h-[68px] w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                          item.isRead
                            ? "bg-white text-slate-500 hover:bg-slate-50/80 dark:bg-surface-dark/60 dark:text-slate-400"
                            : "bg-primary/5 text-slate-800 hover:bg-primary/10 dark:bg-primary/10 dark:text-slate-100"
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                            visual.iconContainerClassName
                          )}
                          aria-hidden="true"
                        >
                          <span className="material-icons text-[18px] leading-none">{visual.icon}</span>
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-2">
                            <span className="block truncate text-sm font-semibold">{item.title}</span>
                            <span className="shrink-0 pt-0.5 text-[10px] font-medium text-slate-400">
                              {item.createdAt}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-300">
                            {item.description}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <span
                className="material-icons mb-2 text-3xl text-slate-300 dark:text-slate-500"
                aria-hidden="true"
              >
                notifications_none
              </span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">새 알림이 없습니다</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                예약/채팅/결제 상태가 업데이트되면 여기에 표시됩니다.
              </p>
            </div>
          )}

          <footer className="border-t border-primary/10 px-4 py-2">
            <button
              type="button"
              onClick={handleViewAll}
              className="w-full rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-primary/5 hover:text-primary dark:text-slate-300"
            >
              모든 알림 보기
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
}
