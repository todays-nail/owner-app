import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export interface OwnerNotificationListItem {
  id: string;
  type: "booking" | "quote" | "payment" | "system";
  title: string;
  description: string;
  created_at: string;
  is_read: boolean;
  href?: string;
}

interface OwnerNotificationListResponse {
  items: OwnerNotificationListItem[];
  unread_count: number;
}

function formatSupabaseFunctionError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "알 수 없는 오류";
  }

  const obj = error as Record<string, unknown>;
  const parts: string[] = [];

  if (typeof obj.message === "string" && obj.message.trim().length > 0) {
    parts.push(obj.message.trim());
  }
  if (typeof obj.code === "string" && obj.code.trim().length > 0) {
    parts.push(`code=${obj.code.trim()}`);
  }
  if (typeof obj.details === "string" && obj.details.trim().length > 0) {
    parts.push(`details=${obj.details.trim()}`);
  }
  if (typeof obj.hint === "string" && obj.hint.trim().length > 0) {
    parts.push(`hint=${obj.hint.trim()}`);
  }
  if (typeof obj.status === "number" || typeof obj.status === "string") {
    parts.push(`status=${String(obj.status)}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "알 수 없는 오류";
}

async function invokeEdge<T>(
  functionName: string,
  options: {
    method: "GET" | "POST";
    query?: Record<string, string>;
    body?: Record<string, unknown> | string;
  },
): Promise<T> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("환경변수가 설정되지 않았습니다. (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)");
  }

  const queryString = options.query
    ? `?${new URLSearchParams(options.query).toString()}`
    : "";

  const { data, error } = await supabase.functions.invoke<T>(`${functionName}${queryString}`, {
    method: options.method,
    body: options.body,
    headers: {
      "X-Auth-API-Version": "2",
    },
  });

  if (error) {
    throw new Error(formatSupabaseFunctionError(error));
  }

  if (!data) {
    throw new Error("응답 데이터가 비어 있습니다.");
  }

  return data;
}

export async function listOwnerNotifications(limit = 60): Promise<OwnerNotificationListResponse> {
  return await invokeEdge<OwnerNotificationListResponse>("owner-notification-list", {
    method: "GET",
    query: { limit: String(limit) },
  });
}

export async function markOwnerNotificationRead(notificationId: string): Promise<void> {
  await invokeEdge("owner-notification-mark-read", {
    method: "POST",
    body: {
      notification_id: notificationId,
    },
  });
}

export async function markAllOwnerNotificationsRead(): Promise<void> {
  await invokeEdge("owner-notification-mark-all-read", {
    method: "POST",
    body: {},
  });
}
