export interface DashboardDesignItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface DashboardScheduleItem {
  time: string;
  customer: string;
  service: string;
  variant: "current" | "faded" | "active" | "upcoming";
  tag?: string;
}

export const DASHBOARD_DESIGN_ITEMS: DashboardDesignItem[] = [
  {
    id: "design-1",
    name: "골든 샌드",
    price: "₩75,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMtvnCLpwiK62QJZEMACoktg6E0V_yzUy9b38JzKROLCoHL1iMcBklikV-MfjI81XokGcxGi4npM0FsL7ZFcixi9zlQ8VtAcyyJfa0k_izT_zEOHie-dpNyYwXJXNyAGJPHAvaQiut6nHg3f7yaLT2R0eHrKwoPfA-NUSJSpwlhrhTYH0ow0BlPsLZh-y0N6KA3ef4P2ZcwyrG6vsnEse27eccxhb-8k-nLg3VeCOSaTTpBadqRqVdKZYjrtSaPs1_UvgtZJDfodg"
  },
  {
    id: "design-2",
    name: "아우라 핑크",
    price: "₩85,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADJ9s0xYk6wrfsXJE6CHcqWuxxJ-tdNYYVqveG2mplgSQCxgHrsd3nykgz_5rgYsbELmJcguwXG4UkuFyFb3VzIOYTJt0IfTkDRcIllg_E-M9i71BsktFzaCUvo_ktc6KoF2fvYGtwfK8bFMFjassAqGAlvCirE50EvrhjRap6paPugWJSBbYATXn_O6HYgK5kCN5sjYZit0WVqRlN26Pu2tnTu6VS-rP_aptI5VCavj_HdyDc2alLW8sYN6sT8y4Keabl2fGO0-o"
  },
  {
    id: "design-3",
    name: "딥 씨 마블",
    price: "₩95,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARU91bmKufROkKoz257tweQ2rooH5bozrE_CYsK32VKP21s6QBkkswNU2EysCSsEnyvzRQSMNRqWowB_waFfN5UsQUBYvHrPc7YeaRW7yqc7IYQ-2wEcFmXwSAlkXmwi2yDdPPoclBhXCUiiyoMKITR3xSp5z6IfVdwncTX22M_p01Hbw58pVwWcNgDx2ptp7Qv_5wxL39a4AJd3vxZDjB5WyeGqhwCGT1IxTOD70QSkFNwuvZOWFBnlnn4AbdZZvwlfLdsnsErz4"
  },
  {
    id: "design-4",
    name: "매트 스프링",
    price: "₩70,000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZBpofl5rPS_t0zN3mDnpTFtoILsMBwvQ-eGT6ej4di_URTW8V30igYidvlt9bScndcvwp2JFS3qWg7i_i1Kf6eG43T7Z420Uegq9slQYPATb0GmrVlQ9QESgk4zlo0U82iqVe4owovnQZasQExDmj8baR6oLAItIiyEO8kSvItRGq-U8gtTMr5V04CEM6Ry12K6KKbRFBq0f7fQFQqgN4dZ1q-pNTxEXO16IGqzQvQd60Y1ii1KMXx-3RE91Q0kIKflfk3kcNAxA"
  }
];

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
