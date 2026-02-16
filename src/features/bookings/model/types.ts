export type BookingStage =
  | "deposit_pending"
  | "in_service"
  | "payment_pending"
  | "completed";

export type BookingTimeTone = "default" | "strike" | "now" | "next" | "success";

export type BookingStatusTone = "default" | "warning" | "success" | "attention";

export type BookingDesignerTone = "purple" | "blue" | "orange";

export type BookingAmountTone = "muted" | "primary" | "success";

export interface BookingCard {
  id: string;
  stage: BookingStage;
  timeLabel: string;
  customerName: string;
  serviceName: string;
  designerName: string;
  designerInitial: string;
  imageUrl: string;
  timeTone: BookingTimeTone;
  designerTone: BookingDesignerTone;
  statusLabel: string;
  statusTone: BookingStatusTone;
  amountLabel?: string;
  amountTone?: BookingAmountTone;
  secondaryStatusLabel?: string;
  secondaryStatusTone?: BookingStatusTone;
}

export interface BookingColumn {
  id: BookingStage;
  title: string;
}

export interface BookingRevenueItem {
  key: "today" | "month";
  label: string;
  amount: string;
  icon: string;
  tone: "success" | "primary";
}
