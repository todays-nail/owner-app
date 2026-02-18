"use client";

import * as React from "react";

import type { NotificationItem } from "@/features/notifications/model/types";
import {
  listOwnerNotifications,
  markAllOwnerNotificationsRead,
  markOwnerNotificationRead,
  type OwnerNotificationListItem,
} from "@/features/notifications/services/notification-browser-service";

function formatRelativeDateLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "방금 전";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (60 * 1000));

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function toNotificationItem(item: OwnerNotificationListItem): NotificationItem {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    createdAt: formatRelativeDateLabel(item.created_at),
    isRead: item.is_read,
    href: item.href,
  };
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "알림 데이터를 처리하지 못했습니다.";
}

export interface UseOwnerNotificationsResult {
  items: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useOwnerNotifications(limit = 60): UseOwnerNotificationsResult {
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await listOwnerNotifications(limit);
      const nextItems = (response.items ?? []).map(toNotificationItem);
      setItems(nextItems);
      setUnreadCount(response.unread_count ?? nextItems.filter((item) => !item.isRead).length);
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const markRead = React.useCallback(async (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
    setUnreadCount((prevCount) => Math.max(0, prevCount - 1));

    try {
      await markOwnerNotificationRead(id);
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
      await refresh();
    }
  }, [refresh]);

  const markAllRead = React.useCallback(async () => {
    const unreadExists = items.some((item) => !item.isRead);
    if (!unreadExists) return;

    setItems((prevItems) => prevItems.map((item) => ({ ...item, isRead: true })));
    setUnreadCount(0);

    try {
      await markAllOwnerNotificationsRead();
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
      await refresh();
    }
  }, [items, refresh]);

  return {
    items,
    unreadCount,
    isLoading,
    errorMessage,
    markRead,
    markAllRead,
    refresh,
  };
}
