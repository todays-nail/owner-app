export interface DashboardScheduleItem {
  time: string;
  customer: string;
  service: string;
  variant: "current" | "faded" | "active" | "upcoming";
  tag?: string;
}

export const DASHBOARD_SCHEDULE_ITEMS: DashboardScheduleItem[] = [
  {
    time: "11:00 AM — 12:30 PM",
    customer: "이민희 고객님",
    service: "그라데이션 + 스톤 아트",
    variant: "current",
    tag: "특별 관리"
  },
  {
    time: "01:30 PM — 02:00 PM",
    customer: "박지원 고객님",
    service: "단순 젤 제거",
    variant: "faded"
  },
  {
    time: "02:30 PM — 04:00 PM",
    customer: "오현지 고객님",
    service: "클래식 프렌치 + 크롬 파우더",
    variant: "active"
  },
  {
    time: "04:30 PM — 06:00 PM",
    customer: "최수빈 고객님",
    service: "전체 연장 + 버터플라이 아트",
    variant: "active"
  },
  {
    time: "06:30 PM — 07:30 PM",
    customer: "강유진 고객님",
    service: "원톤 젤 + 케어",
    variant: "upcoming"
  },
  {
    time: "08:00 PM — 09:30 PM",
    customer: "정다은 고객님",
    service: "이달의 아트 (5월)",
    variant: "upcoming"
  }
];
