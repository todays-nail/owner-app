export const OWNER_VERIFICATION_STATUSES = [
  "UNSUBMITTED",
  "PENDING",
  "APPROVED",
  "REJECTED"
] as const;

export type OwnerVerificationStatus = (typeof OWNER_VERIFICATION_STATUSES)[number];

export type OwnerVerificationRow = {
  user_id: string;
  status: OwnerVerificationStatus;
  business_number: string | null;
  shop_name: string | null;
  owner_name: string | null;
  contact_phone: string | null;
  shop_address1: string | null;
  shop_address2: string | null;
  shop_postcode: string | null;
  shop_photo_path: string | null;
  business_license_path: string | null;
  rejected_reason: string | null;
  submitted_at: string | null;
};
