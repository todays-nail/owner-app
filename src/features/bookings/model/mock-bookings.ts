import type {
  BookingCard,
  BookingColumn,
  BookingRevenueItem
} from "@/features/bookings/model/types";

export const BOOKING_COLUMNS: BookingColumn[] = [
  { id: "deposit_pending", title: "예약금 확인" },
  { id: "in_service", title: "오늘의 시술" },
  { id: "payment_pending", title: "결제 대기" },
  { id: "completed", title: "완료" }
];

export const INITIAL_BOOKING_CARDS: BookingCard[] = [
  {
    id: "booking-1",
    stage: "deposit_pending",
    timeLabel: "5/23 (목) 14:00",
    customerName: "김미영님",
    serviceName: "이달의 아트 (골든 샌드)",
    designerName: "민지 원장",
    designerInitial: "민",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMtvnCLpwiK62QJZEMACoktg6E0V_yzUy9b38JzKROLCoHL1iMcBklikV-MfjI81XokGcxGi4npM0FsL7ZFcixi9zlQ8VtAcyyJfa0k_izT_zEOHie-dpNyYwXJXNyAGJPHAvaQiut6nHg3f7yaLT2R0eHrKwoPfA-NUSJSpwlhrhTYH0ow0BlPsLZh-y0N6KA3ef4P2ZcwyrG6vsnEse27eccxhb-8k-nLg3VeCOSaTTpBadqRqVdKZYjrtSaPs1_UvgtZJDfodg",
    timeTone: "default",
    designerTone: "purple",
    statusLabel: "입금 대기",
    statusTone: "default",
    amountLabel: "₩10,000",
    amountTone: "muted"
  },
  {
    id: "booking-2",
    stage: "deposit_pending",
    timeLabel: "5/24 (금) 11:00",
    customerName: "최유리님",
    serviceName: "기본 젤 + 제거",
    designerName: "지수 디자이너",
    designerInitial: "지",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIil0uqKlP4ba_px3aR3ONLUYkh-j_p6kZyCfhCfnIk5tFhrqgdMX09Z3JfmszOM4BgxSOzAD8TMyv47w8d4Yp8B9rIN8tyQJsPIlDnUrCnahqTaH1vt24pm5v0xg4J3yPy6k5P72p_Sf3afli8DWx6zZn-xGXhqxvc5PvJgGzRg9jDTYVJc46cYGSZCCjMqBW4wIkktKqsw5Uu5Et0Tsi93R5KG-hiBkenorby89ULifzpX-PVRtXnl3oYFnIzmEDwnRiZjpUO-A",
    timeTone: "default",
    designerTone: "blue",
    statusLabel: "입금 대기",
    statusTone: "warning",
    amountLabel: "₩10,000",
    amountTone: "muted"
  },
  {
    id: "booking-3",
    stage: "deposit_pending",
    timeLabel: "5/25 (토) 16:30",
    customerName: "박소연님",
    serviceName: "아우라 핑크 + 파츠",
    designerName: "민지 원장",
    designerInitial: "민",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADJ9s0xYk6wrfsXJE6CHcqWuxxJ-tdNYYVqveG2mplgSQCxgHrsd3nykgz_5rgYsbELmJcguwXG4UkuFyFb3VzIOYTJt0IfTkDRcIllg_E-M9i71BsktFzaCUvo_ktc6KoF2fvYGtwfK8bFMFjassAqGAlvCirE50EvrhjRap6paPugWJSBbYATXn_O6HYgK5kCN5sjYZit0WVqRlN26Pu2tnTu6VS-rP_aptI5VCavj_HdyDc2alLW8sYN6sT8y4Keabl2fGO0-o",
    timeTone: "default",
    designerTone: "purple",
    statusLabel: "입금 확인됨",
    statusTone: "success",
    amountLabel: "₩10,000",
    amountTone: "primary"
  },
  {
    id: "booking-4",
    stage: "in_service",
    timeLabel: "NOW 14:30",
    customerName: "오현지님",
    serviceName: "클래식 프렌치 + 크롬",
    designerName: "수진 실장",
    designerInitial: "수",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARU91bmKufROkKoz257tweQ2rooH5bozrE_CYsK32VKP21s6QBkkswNU2EysCSsEnyvzRQSMNRqWowB_waFfN5UsQUBYvHrPc7YeaRW7yqc7IYQ-2wEcFmXwSAlkXmwi2yDdPPoclBhXCUiiyoMKITR3xSp5z6IfVdwncTX22M_p01Hbw58pVwWcNgDx2ptp7Qv_5wxL39a4AJd3vxZDjB5WyeGqhwCGT1IxTOD70QSkFNwuvZOWFBnlnn4AbdZZvwlfLdsnsErz4",
    timeTone: "now",
    designerTone: "orange",
    statusLabel: "시술 중 (45분)",
    statusTone: "attention"
  },
  {
    id: "booking-5",
    stage: "in_service",
    timeLabel: "NEXT 16:30",
    customerName: "최수빈님",
    serviceName: "전체 연장 + 버터플라이",
    designerName: "지수 디자이너",
    designerInitial: "지",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZBpofl5rPS_t0zN3mDnpTFtoILsMBwvQ-eGT6ej4di_URTW8V30igYidvlt9bScndcvwp2JFS3qWg7i_i1Kf6eG43T7Z420Uegq9slQYPATb0GmrVlQ9QESgk4zlo0U82iqVe4owovnQZasQExDmj8baR6oLAItIiyEO8kSvItRGq-U8gtTMr5V04CEM6Ry12K6KKbRFBq0f7fQFQqgN4dZ1q-pNTxEXO16IGqzQvQd60Y1ii1KMXx-3RE91Q0kIKflfk3kcNAxA",
    timeTone: "next",
    designerTone: "blue",
    statusLabel: "대기 중",
    statusTone: "default",
    secondaryStatusLabel: "첫 방문",
    secondaryStatusTone: "default"
  },
  {
    id: "booking-6",
    stage: "payment_pending",
    timeLabel: "13:30",
    customerName: "박지원님",
    serviceName: "단순 젤 제거",
    designerName: "민지 원장",
    designerInitial: "민",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB59cKEqNi5BnN3mAvSaIBIOjMJIxPjGU5VoxbnfX7eSYOhCjfTN-9cq9ID7hKXVquGHVID74XHO1bNK4sWcTq_KYKtMZWbOsEkgCeVaOFSPS7rV5Zj7vrS5c45nRyMMcPmgzfXSIW7DYS1TEl0G_Vz1J5-YRrUGgAKa7An73R8TlpCW5YYXRpvY0B8K0nHBmolW_PWGogBCDd_t4g39NcZrGX-WuV7YeKcEsVLz5VawA8HgoUgSn1ss7RnlP7ylBeSNeja_Wh_H5o",
    timeTone: "strike",
    designerTone: "purple",
    statusLabel: "잔금 확인 필요",
    statusTone: "warning",
    secondaryStatusLabel: "결제하기",
    secondaryStatusTone: "warning"
  },
  {
    id: "booking-7",
    stage: "payment_pending",
    timeLabel: "15:00",
    customerName: "김하은님",
    serviceName: "화려한 파츠 아트",
    designerName: "수진 실장",
    designerInitial: "수",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARU91bmKufROkKoz257tweQ2rooH5bozrE_CYsK32VKP21s6QBkkswNU2EysCSsEnyvzRQSMNRqWowB_waFfN5UsQUBYvHrPc7YeaRW7yqc7IYQ-2wEcFmXwSAlkXmwi2yDdPPoclBhXCUiiyoMKITR3xSp5z6IfVdwncTX22M_p01Hbw58pVwWcNgDx2ptp7Qv_5wxL39a4AJd3vxZDjB5WyeGqhwCGT1IxTOD70QSkFNwuvZOWFBnlnn4AbdZZvwlfLdsnsErz4",
    timeTone: "default",
    designerTone: "orange",
    statusLabel: "시술 완료",
    statusTone: "default",
    secondaryStatusLabel: "결제 대기",
    secondaryStatusTone: "warning"
  },
  {
    id: "booking-8",
    stage: "completed",
    timeLabel: "11:00 완료",
    customerName: "이민희님",
    serviceName: "그라데이션 + 스톤",
    designerName: "수진 실장",
    designerInitial: "수",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB59cKEqNi5BnN3mAvSaIBIOjMJIxPjGU5VoxbnfX7eSYOhCjfTN-9cq9ID7hKXVquGHVID74XHO1bNK4sWcTq_KYKtMZWbOsEkgCeVaOFSPS7rV5Zj7vrS5c45nRyMMcPmgzfXSIW7DYS1TEl0G_Vz1J5-YRrUGgAKa7An73R8TlpCW5YYXRpvY0B8K0nHBmolW_PWGogBCDd_t4g39NcZrGX-WuV7YeKcEsVLz5VawA8HgoUgSn1ss7RnlP7ylBeSNeja_Wh_H5o",
    timeTone: "success",
    designerTone: "orange",
    statusLabel: "정산 완료",
    statusTone: "success",
    amountLabel: "₩115,000",
    amountTone: "success"
  },
  {
    id: "booking-9",
    stage: "completed",
    timeLabel: "5/22 (수)",
    customerName: "Hanna J.",
    serviceName: "웨딩 네일 (화이트)",
    designerName: "민지 원장",
    designerInitial: "민",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIil0uqKlP4ba_px3aR3ONLUYkh-j_p6kZyCfhCfnIk5tFhrqgdMX09Z3JfmszOM4BgxSOzAD8TMyv47w8d4Yp8B9rIN8tyQJsPIlDnUrCnahqTaH1vt24pm5v0xg4J3yPy6k5P72p_Sf3afli8DWx6zZn-xGXhqxvc5PvJgGzRg9jDTYVJc46cYGSZCCjMqBW4wIkktKqsw5Uu5Et0Tsi93R5KG-hiBkenorby89ULifzpX-PVRtXnl3oYFnIzmEDwnRiZjpUO-A",
    timeTone: "success",
    designerTone: "purple",
    statusLabel: "정산 완료",
    statusTone: "success",
    amountLabel: "₩150,000",
    amountTone: "success"
  }
];

export const BOOKING_REVENUE_ITEMS: BookingRevenueItem[] = [
  {
    key: "today",
    label: "오늘 총 매출",
    amount: "₩840,000",
    icon: "payments",
    tone: "success"
  },
  {
    key: "month",
    label: "이번 달 누적 매출",
    amount: "₩12,450,000",
    icon: "bar_chart",
    tone: "primary"
  }
];
