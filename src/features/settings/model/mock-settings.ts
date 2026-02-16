import type { ShopSettingsDto } from "@/features/settings/model/types";

export const MOCK_SHOP_SETTINGS: ShopSettingsDto = {
  shopId: "mock-shop-1",
  shopName: "블링블링 네일 강남점",
  ownerName: "김지수",
  businessNumber: "123-45-67890",
  addressLine1: "서울 강남구 테헤란로 123, 2층",
  addressLine2: "",
  contactPhone: "010-1234-5678",
  openTime: "10:00",
  closeTime: "20:00",
  closedWeekdays: ["MON"],
  intro:
    "강남역 3번출구 도보 5분! 1:1 맞춤 꼼꼼 시술 전문샵입니다. 이달의 아트는 매달 1일에 업데이트 됩니다. 편안한 분위기에서 힐링하고 가세요 :)",
  baseGelPrice: 40000,
  removalPrice: 10000,
  extensionPrice: 10000,
  artUnitPrice: 5000,
  depositAmount: 20000,
  autoConfirm: false,
  allowOnsitePayment: true,
  invoiceEmail: "billing@blingnail.com",
  settlementBank: "카카오뱅크",
  settlementAccount: "3333-01-2345678",
  notifyQuoteRequest: true,
  notifyBookingCreated: true,
  notifyPaymentCompleted: true,
  galleryImages: [
    {
      id: "gallery-1",
      storagePath: "mock-seed://gallery-1",
      sortOrder: 1,
      createdAt: "2026-02-16T09:00:00.000Z",
      signedUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDjjlkZstW4GtwM1C8qb0jTOzBdfTIpr1H3O0jSCJKwl-tAoKX8aqOB2HuQIoJUqM6oAgxAAR_OzW-cATnjVd_yisQFSw1ONS07bhZzd8mrEhbUB6bEiPjbJAwfKR4UIEn4PY1n3JZgozF1k8lmE53ZdBIT64B9Fkw0iRKMJ65xjAoassCUJ6nHQblOF9kqRGly-Uq7pOKb79dgFQldaip_dtja6gQ0DW79V6MIAyeqMx7drCD6-rxmDbY3KGhiEwLYT5E5X_qnYQ0"
    },
    {
      id: "gallery-2",
      storagePath: "mock-seed://gallery-2",
      sortOrder: 2,
      createdAt: "2026-02-16T09:01:00.000Z",
      signedUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuACbd7Jnm0iVno-9EJY47PJsDtnG65eDj52tYJdN4QZG6IOhbYJ5hjYwNJi4ZciBMUnF7ZNtHE91hHz-t5rw6vEHC0ciPDDO_kp4PesT0V-uOlrtvsFEg4XDJ5Ni-jJ7jXGHN9CgBYCZliaZeI17YpFYLkPokcPIuRJ3YRenn68II5IFZ6ltgisooOoJb6uc1tBghFfKk1WuAqir4thjrYgZVc5V2VXmQoDE5zGLUgdBMA7Ikc2KM8o-Zl-GzFgoFW8nvjUzvXOZKs"
    },
    {
      id: "gallery-3",
      storagePath: "mock-seed://gallery-3",
      sortOrder: 3,
      createdAt: "2026-02-16T09:02:00.000Z",
      signedUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDC7jH5QxX95tpj-frPMp2RndDs8bK_H1mIUtVbUCxUON4EHBJZj29aLww4-hUXkKyPzd1e_hDPvlCNVjA4UaJEWfKXbzd0-r3pPsuQBa7gVo_NI7tsjt9ZdEVljgZ5ew1t42GHt-eNERUKm2KrYR9D9XPknGLfnYIjZoA-TU4VrguPQDVM_CoWr9EI8I4yUjx9ucnXFrORIlnaWHgLj91hsCVkZ5PMJDJSBEIxVYVbNiidRSVZshJ096uDMFrB_r9oQeX6mfArMSU"
    }
  ]
};
