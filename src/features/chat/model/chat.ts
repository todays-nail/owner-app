export type QuoteRequestStatus = "OPEN" | "SELECTED" | "CLOSED";
export type QuoteTargetStatus = "REQUESTED" | "RESPONDED" | "SELECTED" | "CLOSED";
export type QuoteTargetMode = "REGION_ALL" | "SELECTED_SHOPS";
export type QuoteChangeItem = "EXTENSION" | "REMOVAL" | "ART_CHANGE" | "OTHER";

export interface OwnerQuoteRequestShop {
  id: string;
  name: string;
  address: string;
}

export interface OwnerQuoteRequestSummary {
  id: string;
  user_id: string;
  user_nickname: string;
  ai_generation_job_id: string;
  target_mode: QuoteTargetMode;
  region_id: string;
  preferred_date: string;
  request_note: string;
  status: QuoteRequestStatus;
  selected_target_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OwnerQuoteImageSet {
  user_hand_image: string | null;
  ai_input_hand_image: string | null;
  ai_result_image: string | null;
  ai_reference_image: string | null;
}

export interface OwnerQuoteResponsePayload {
  id: string;
  target_id: string;
  final_price: number;
  change_items: QuoteChangeItem[];
  memo: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerQuoteRequestItem {
  target_id: string;
  target_status: QuoteTargetStatus;
  sent_at: string;
  responded_at: string | null;
  selected_at: string | null;
  shop: OwnerQuoteRequestShop;
  request: OwnerQuoteRequestSummary;
  images: OwnerQuoteImageSet;
  response: OwnerQuoteResponsePayload | null;
}

export interface OwnerQuoteRequestListResponse {
  items: OwnerQuoteRequestItem[];
}

export interface OwnerQuoteResponseUpsertInput {
  targetId: string;
  finalPrice: number;
  changeItems: QuoteChangeItem[];
  memo: string;
}
