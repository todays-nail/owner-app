export const SHOP_SETTINGS_DEFAULTS = {
  baseGelPrice: 40000,
  removalPrice: 10000,
  extensionPrice: 10000,
  artUnitPrice: 5000,
  depositAmount: 20000,
  autoConfirm: false,
  allowOnsitePayment: true,
  notifyQuoteRequest: true,
  notifyBookingCreated: true,
  notifyPaymentCompleted: true
} as const;

export interface ShopGalleryImageDto {
  id: string;
  storagePath: string;
  sortOrder: number;
  createdAt: string;
  signedUrl: string | null;
}

export type Weekday = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export interface ShopSettingsDto {
  shopId: string;
  shopName: string;
  ownerName: string;
  businessNumber: string;
  addressLine1: string;
  addressLine2: string;
  contactPhone: string;
  openTime: string;
  closeTime: string;
  closedWeekdays: Weekday[];
  intro: string;
  baseGelPrice: number;
  removalPrice: number;
  extensionPrice: number;
  artUnitPrice: number;
  depositAmount: number;
  autoConfirm: boolean;
  allowOnsitePayment: boolean;
  invoiceEmail: string;
  settlementBank: string;
  settlementAccount: string;
  notifyQuoteRequest: boolean;
  notifyBookingCreated: boolean;
  notifyPaymentCompleted: boolean;
  galleryImages: ShopGalleryImageDto[];
}
