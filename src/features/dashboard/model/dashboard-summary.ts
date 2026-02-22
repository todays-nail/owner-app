export type DashboardPaymentStage = "DEPOSIT" | "BALANCE";

export interface DashboardSummary {
  date: string;
  dateLabel: string;
  timezone: string;
  todayRevenue: number;
  newBookingsCount: number;
}

export interface DashboardScheduleItem {
  reservationId: string;
  slotStartAt: string;
  timeRange: string;
  customerName: string;
  serviceName: string;
  reservationStatus: string;
}

export interface OwnerDashboardSummaryResponse {
  summary: {
    date: string;
    date_label: string;
    timezone: string;
    today_revenue: number;
    new_bookings_count: number;
  };
  schedule_items: Array<{
    reservation_id: string;
    slot_start_at: string;
    time_range: string;
    customer_name: string;
    service_name: string;
    reservation_status: string;
  }>;
}

export interface DashboardSummaryResult {
  summary: DashboardSummary;
  scheduleItems: DashboardScheduleItem[];
}

export interface OwnerPaymentLedgerUpsertInput {
  reservationId: string;
  paymentStage: DashboardPaymentStage;
  amount: number;
  paidAt?: string;
  memo?: string;
}
