export type NotificationType = "booking" | "chat" | "payment" | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  href?: string;
}
