import type {NotificationItem} from "@/features/notifications/model/types";

export const MOCK_NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: "notification-booking-1",
    type: "booking",
    title: "새 예약 요청",
    description: "김하늘 고객님이 젤네일 예약을 요청했어요.",
    createdAt: "방금 전",
    isRead: false,
    href: "/bookings"
  },
  {
    id: "notification-chat-1",
    type: "chat",
    title: "채팅 문의 도착",
    description: "박서윤 고객님이 디자인 상담 메시지를 보냈어요.",
    createdAt: "5분 전",
    isRead: false,
    href: "/chat"
  },
  {
    id: "notification-payment-1",
    type: "payment",
    title: "결제 완료",
    description: "이정민 고객님의 예약금 결제가 완료됐어요.",
    createdAt: "12분 전",
    isRead: false,
    href: "/bookings"
  },
  {
    id: "notification-system-1",
    type: "system",
    title: "시스템 점검 안내",
    description: "내일 오전 3시에 서비스 점검이 예정되어 있어요.",
    createdAt: "1시간 전",
    isRead: true
  }
];
