"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import type { ShopGalleryImageDto, ShopSettingsDto, Weekday } from "@/features/settings/model/types";
import { cn } from "@/lib/utils";

const BANK_OPTIONS = ["카카오뱅크", "신한은행", "국민은행"] as const;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const DAUM_POSTCODE_SCRIPT_SRC =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const WEEKDAY_OPTIONS: Array<{ key: Weekday; label: string }> = [
  { key: "MON", label: "월" },
  { key: "TUE", label: "화" },
  { key: "WED", label: "수" },
  { key: "THU", label: "목" },
  { key: "FRI", label: "금" },
  { key: "SAT", label: "토" },
  { key: "SUN", label: "일" }
];

type PendingUploadFile = {
  id: string;
  file: File;
  previewUrl: string;
};

type NumberFieldKey =
  | "baseGelPrice"
  | "removalPrice"
  | "extensionPrice"
  | "artUnitPrice"
  | "depositAmount";

type SettingsFormState = {
  addressLine1: string;
  addressLine2: string;
  contactPhone: string;
  openTime: string;
  closeTime: string;
  closedWeekdays: Weekday[];
  intro: string;
  baseGelPrice: string;
  removalPrice: string;
  extensionPrice: string;
  artUnitPrice: string;
  depositAmount: string;
  autoConfirm: boolean;
  allowOnsitePayment: boolean;
  invoiceEmail: string;
  settlementBank: string;
  settlementAccount: string;
  notifyQuoteRequest: boolean;
  notifyBookingCreated: boolean;
  notifyPaymentCompleted: boolean;
};

type DaumPostcodeData = {
  address: string;
  addressType: "R" | "J";
  bname: string;
  buildingName: string;
  apartment: "Y" | "N";
  zonecode: string;
};

type DaumPostcodeConstructor = new (options: {
  oncomplete: (data: DaumPostcodeData) => void;
}) => {
  open: () => void;
};

declare global {
  interface Window {
    daum?: {
      Postcode?: DaumPostcodeConstructor;
    };
  }
}

let daumPostcodeScriptPromise: Promise<void> | null = null;

function ensureDaumPostcodeScriptLoaded() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Browser environment is required."));
  }

  if (window.daum?.Postcode) {
    return Promise.resolve();
  }

  if (daumPostcodeScriptPromise) {
    return daumPostcodeScriptPromise;
  }

  daumPostcodeScriptPromise = new Promise<void>((resolve, reject) => {
    const staleScript = document.querySelector<HTMLScriptElement>(
      'script[data-daum-postcode="true"]'
    );
    if (staleScript) {
      staleScript.remove();
    }

    const script = document.createElement("script");
    script.src = DAUM_POSTCODE_SCRIPT_SRC;
    script.async = true;
    script.dataset.daumPostcode = "true";

    script.onload = () => {
      if (!window.daum?.Postcode) {
        reject(new Error("Daum postcode loader is unavailable."));
        return;
      }
      resolve();
    };

    script.onerror = () => {
      reject(new Error("Failed to load Daum postcode script."));
    };

    document.head.appendChild(script);
  }).catch((error) => {
    daumPostcodeScriptPromise = null;
    throw error;
  });

  return daumPostcodeScriptPromise;
}

function toDisplayNumber(value: number) {
  return Number.isFinite(value) ? String(value) : "0";
}

function isValidOptionalEmail(value: string) {
  if (value.trim().length === 0) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function parseNonNegativeInteger(rawValue: string, label: string) {
  if (rawValue.trim().length === 0) {
    return { ok: false as const, message: `${label}을(를) 입력해 주세요.` };
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value < 0) {
    return { ok: false as const, message: `${label}은(는) 0 이상의 정수여야 합니다.` };
  }

  return { ok: true as const, value };
}

type ClosedDaySelectValue = Weekday | "NONE";

function getClosedDaySelectValue(days: Weekday[]): ClosedDaySelectValue {
  if (days.length === 0) {
    return "NONE";
  }

  const [first] = WEEKDAY_OPTIONS.filter((option) => days.includes(option.key));
  return first?.key ?? "NONE";
}

function buildNewFormState(initialData: ShopSettingsDto): SettingsFormState {
  return {
    addressLine1: initialData.addressLine1,
    addressLine2: initialData.addressLine2,
    contactPhone: initialData.contactPhone,
    openTime: initialData.openTime,
    closeTime: initialData.closeTime,
    closedWeekdays: [...initialData.closedWeekdays],
    intro: initialData.intro,
    baseGelPrice: toDisplayNumber(initialData.baseGelPrice),
    removalPrice: toDisplayNumber(initialData.removalPrice),
    extensionPrice: toDisplayNumber(initialData.extensionPrice),
    artUnitPrice: toDisplayNumber(initialData.artUnitPrice),
    depositAmount: toDisplayNumber(initialData.depositAmount),
    autoConfirm: initialData.autoConfirm,
    allowOnsitePayment: initialData.allowOnsitePayment,
    invoiceEmail: initialData.invoiceEmail,
    settlementBank: initialData.settlementBank || BANK_OPTIONS[0],
    settlementAccount: initialData.settlementAccount,
    notifyQuoteRequest: initialData.notifyQuoteRequest,
    notifyBookingCreated: initialData.notifyBookingCreated,
    notifyPaymentCompleted: initialData.notifyPaymentCompleted
  };
}

function isLocalMockGalleryImage(image: Pick<ShopGalleryImageDto, "storagePath">) {
  return image.storagePath.startsWith("mock-local://");
}

function revokePreviewIfLocal(image: Pick<ShopGalleryImageDto, "storagePath" | "signedUrl">) {
  if (isLocalMockGalleryImage(image) && image.signedUrl) {
    URL.revokeObjectURL(image.signedUrl);
  }
}

function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
  size = "md"
}: {
  checked: boolean;
  onChange: (nextValue: boolean) => void;
  ariaLabel: string;
  size?: "md" | "sm";
}) {
  const trackSizeClassName = size === "md" ? "h-6 w-11" : "h-5 w-9";
  const thumbSizeClassName = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const thumbPositionClassName = size === "md" ? "left-[20px]" : "left-[16px]";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        trackSizeClassName,
        checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 rounded-full bg-white shadow-sm transition-[left]",
          thumbSizeClassName,
          checked ? thumbPositionClassName : "left-0.5"
        )}
      />
    </button>
  );
}

function ReadonlyInput({ value }: { value: string }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        readOnly
        disabled
        className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-400 dark:border-[#4b3d3c] dark:bg-[#372a29] dark:text-gray-500"
      />
      <span className="material-icons-round pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
        lock
      </span>
    </div>
  );
}

export function SettingsPageClient({ initialData }: { initialData: ShopSettingsDto }) {
  const [form, setForm] = useState<SettingsFormState>(() => buildNewFormState(initialData));
  const [galleryImages, setGalleryImages] = useState<ShopGalleryImageDto[]>(
    initialData.galleryImages
  );
  const [removedImageIds, setRemovedImageIds] = useState<Set<string>>(new Set());
  const [pendingFiles, setPendingFiles] = useState<PendingUploadFile[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const detailAddressInputRef = useRef<HTMLInputElement | null>(null);
  const pendingFilesRef = useRef<PendingUploadFile[]>([]);
  const galleryImagesRef = useRef<ShopGalleryImageDto[]>(initialData.galleryImages);

  useEffect(() => {
    pendingFilesRef.current = pendingFiles;
  }, [pendingFiles]);

  useEffect(() => {
    galleryImagesRef.current = galleryImages;
  }, [galleryImages]);

  useEffect(() => {
    return () => {
      pendingFilesRef.current.forEach((pendingFile) => {
        URL.revokeObjectURL(pendingFile.previewUrl);
      });
      galleryImagesRef.current.forEach((image) => {
        revokePreviewIfLocal(image);
      });
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  const visibleGalleryImages = useMemo(
    () => galleryImages.filter((image) => !removedImageIds.has(image.id)),
    [galleryImages, removedImageIds]
  );

  const handleStringChange = (key: keyof SettingsFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (key: NumberFieldKey, value: string) => {
    const normalized = value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, [key]: normalized }));
  };

  const handleToggleChange = (
    key:
      | "autoConfirm"
      | "allowOnsitePayment"
      | "notifyQuoteRequest"
      | "notifyBookingCreated"
      | "notifyPaymentCompleted",
    value: boolean
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClosedWeekdaySelectChange = (value: string) => {
    if (value === "NONE") {
      setForm((prev) => ({ ...prev, closedWeekdays: [] }));
      return;
    }

    if (!WEEKDAY_OPTIONS.some((option) => option.key === value)) {
      return;
    }

    setForm((prev) => ({ ...prev, closedWeekdays: [value as Weekday] }));
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFindAddress = async () => {
    setErrorMessage(null);

    try {
      await ensureDaumPostcodeScriptLoaded();

      if (!window.daum?.Postcode) {
        setErrorMessage("주소 검색 서비스를 사용할 수 없습니다.");
        return;
      }

      const postcode = new window.daum.Postcode({
        oncomplete: (data) => {
          const baseAddress = data.address;
          let extraAddress = "";

          if (data.addressType === "R") {
            const extras: string[] = [];

            if (data.bname) {
              extras.push(data.bname);
            }

            if (data.buildingName && data.apartment === "Y") {
              extras.push(data.buildingName);
            }

            if (extras.length > 0) {
              extraAddress = ` (${extras.join(", ")})`;
            }
          }

          const composedAddress = `${baseAddress}${extraAddress}`;
          const nextAddress = data.zonecode
            ? `(${data.zonecode}) ${composedAddress}`
            : composedAddress;

          setForm((prev) => ({ ...prev, addressLine1: nextAddress }));
          window.setTimeout(() => {
            detailAddressInputRef.current?.focus();
          }, 0);
        }
      });

      postcode.open();
    } catch {
      setErrorMessage("주소 검색 팝업을 열지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleAddFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = event.target.files;
    if (!nextFiles || nextFiles.length === 0) {
      return;
    }

    const accepted: PendingUploadFile[] = [];

    for (const file of Array.from(nextFiles)) {
      if (!file.type.startsWith("image/")) {
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setErrorMessage(
          `이미지 파일은 최대 ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))}MB까지 업로드할 수 있습니다.`
        );
        continue;
      }

      accepted.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }

    if (accepted.length > 0) {
      setPendingFiles((prev) => [...prev, ...accepted]);
      setErrorMessage(null);
    }

    event.target.value = "";
  };

  const handleRemovePendingFile = (id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleMarkImageRemoved = (id: string) => {
    setRemovedImageIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleUndoAllRemoved = () => {
    setRemovedImageIds(new Set());
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setToastMessage(null);

    if (form.contactPhone.trim().length === 0) {
      setErrorMessage("연락처를 입력해 주세요.");
      return;
    }

    if (form.addressLine1.trim().length === 0) {
      setErrorMessage("매장 주소를 입력해 주세요.");
      return;
    }

    if (form.openTime.trim().length === 0 || form.closeTime.trim().length === 0) {
      setErrorMessage("영업 시작 시간과 종료 시간을 입력해 주세요.");
      return;
    }

    if (!isValidOptionalEmail(form.invoiceEmail)) {
      setErrorMessage("세금계산서 발행 이메일 형식을 확인해 주세요.");
      return;
    }

    const baseGelPrice = parseNonNegativeInteger(form.baseGelPrice, "기본 젤 가격");
    const removalPrice = parseNonNegativeInteger(form.removalPrice, "타샵 제거 가격");
    const extensionPrice = parseNonNegativeInteger(form.extensionPrice, "연장 가격");
    const artUnitPrice = parseNonNegativeInteger(form.artUnitPrice, "아트 추가 단가");
    const depositAmount = parseNonNegativeInteger(form.depositAmount, "예약금");

    if (!baseGelPrice.ok) {
      setErrorMessage(baseGelPrice.message);
      return;
    }
    if (!removalPrice.ok) {
      setErrorMessage(removalPrice.message);
      return;
    }
    if (!extensionPrice.ok) {
      setErrorMessage(extensionPrice.message);
      return;
    }
    if (!artUnitPrice.ok) {
      setErrorMessage(artUnitPrice.message);
      return;
    }
    if (!depositAmount.ok) {
      setErrorMessage(depositAmount.message);
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 260);
      });

      const removedSet = removedImageIds;
      const keptImages = galleryImages.filter((image) => !removedSet.has(image.id));
      const removedImages = galleryImages.filter((image) => removedSet.has(image.id));

      removedImages.forEach((image) => {
        revokePreviewIfLocal(image);
      });

      const nextSortOrder =
        keptImages.reduce((max, image) => Math.max(max, image.sortOrder), 0) + 1;

      const now = new Date().toISOString();
      const addedImages: ShopGalleryImageDto[] = pendingFiles.map((pendingFile, index) => ({
        id: `mock-image-${crypto.randomUUID()}`,
        storagePath: `mock-local://${pendingFile.id}`,
        sortOrder: nextSortOrder + index,
        createdAt: now,
        signedUrl: pendingFile.previewUrl
      }));

      const nextGalleryImages = [...keptImages, ...addedImages].sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.createdAt.localeCompare(b.createdAt);
      });

      setGalleryImages(nextGalleryImages);
      setPendingFiles([]);
      setRemovedImageIds(new Set());
      setToastMessage("목업 데이터 기준으로 변경사항을 저장했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">
      <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">샵 정보 관리</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            매장의 기본 정보와 운영 정책을 설정하세요.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-icons-round text-sm" aria-hidden="true">
            save
          </span>
          {isSaving ? "저장 중..." : "변경사항 저장"}
        </button>
      </header>

      {errorMessage ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <span className="material-icons-round" aria-hidden="true">
                  store
                </span>
              </div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-white">기본 정보</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">상호명</label>
                  <ReadonlyInput value={initialData.shopName} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">대표자명</label>
                  <ReadonlyInput value={initialData.ownerName} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">매장 주소</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.addressLine1}
                    onChange={(event) => handleStringChange("addressLine1", event.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                    placeholder="주소를 입력해주세요"
                  />
                  <button
                    type="button"
                    onClick={handleFindAddress}
                    className="whitespace-nowrap rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                  >
                    주소 찾기
                  </button>
                </div>
                <input
                  ref={detailAddressInputRef}
                  type="text"
                  value={form.addressLine2}
                  onChange={(event) => handleStringChange("addressLine2", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                  placeholder="상세 주소를 입력해주세요"
                />
                <p className="mt-2 text-xs text-stone-500">매장 이전에 따른 주소 변경 시 수동 입력 후 저장해 주세요.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">연락처</label>
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(event) =>
                      handleStringChange("contactPhone", event.target.value.replace(/[^0-9-]/g, ""))
                    }
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">휴무 요일</label>
                  <select
                    value={getClosedDaySelectValue(form.closedWeekdays)}
                    onChange={(event) => handleClosedWeekdaySelectChange(event.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                  >
                    <option value="NONE">휴무 없음</option>
                    {WEEKDAY_OPTIONS.map((weekday) => (
                      <option key={weekday.key} value={weekday.key}>
                        {weekday.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">영업시간</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <input
                    type="time"
                    value={form.openTime}
                    onChange={(event) => handleStringChange("openTime", event.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                  />
                  <span className="text-center text-sm font-semibold text-stone-500">~</span>
                  <input
                    type="time"
                    value={form.closeTime}
                    onChange={(event) => handleStringChange("closeTime", event.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">샵 소개</label>
                <textarea
                  rows={4}
                  value={form.intro}
                  onChange={(event) => handleStringChange("intro", event.target.value)}
                  className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                  placeholder="샵 소개를 입력해주세요"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">매장 사진</label>
                  {removedImageIds.size > 0 ? (
                    <button
                      type="button"
                      onClick={handleUndoAllRemoved}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      삭제 예정 {removedImageIds.size}장 취소
                    </button>
                  ) : null}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAddFiles}
                />

                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handleOpenFilePicker}
                    className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 transition-all hover:border-primary hover:bg-primary/5 dark:border-stone-600"
                  >
                    <span className="material-icons-round mb-1 text-stone-400" aria-hidden="true">
                      add_a_photo
                    </span>
                    <span className="text-[10px] font-medium text-stone-400">사진 추가</span>
                  </button>

                  {visibleGalleryImages.map((image) => (
                    <div key={image.id} className="group relative h-24 w-24 overflow-hidden rounded-xl">
                      {image.signedUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.signedUrl}
                          alt="샵 사진"
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-stone-200 text-xs text-stone-500 dark:bg-stone-700 dark:text-stone-300">
                          미리보기 없음
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleMarkImageRemoved(image.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                        aria-label="이미지 삭제"
                      >
                        <span className="material-icons-round text-sm" aria-hidden="true">
                          close
                        </span>
                      </button>
                    </div>
                  ))}

                  {pendingFiles.map((pendingFile) => (
                    <div key={pendingFile.id} className="group relative h-24 w-24 overflow-hidden rounded-xl ring-2 ring-primary/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pendingFile.previewUrl}
                        alt="신규 업로드 미리보기"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        신규
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingFile(pendingFile.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                        aria-label="신규 이미지 제거"
                      >
                        <span className="material-icons-round text-sm" aria-hidden="true">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark md:p-8">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <span className="material-icons-round" aria-hidden="true">
                    payments
                  </span>
                </div>
                <h2 className="text-xl font-bold text-stone-800 dark:text-white">가격 정책</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { label: "기본 젤 (Base Gel)", key: "baseGelPrice" as const },
                { label: "타샵 제거 (Removal)", key: "removalPrice" as const },
                { label: "연장 개당 (Extension)", key: "extensionPrice" as const },
                { label: "아트 추가 단위 (Art Unit)", key: "artUnitPrice" as const }
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">{field.label}</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form[field.key]}
                      onChange={(event) => handleNumberChange(field.key, event.target.value)}
                      className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 pr-10 text-right text-sm text-stone-800 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">원</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <span className="material-icons-round" aria-hidden="true">
                  event_available
                </span>
              </div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-white">예약 운영 정책</h2>
            </div>

            <div className="space-y-6">
              <div className="w-full">
                <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">예약금 설정</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.depositAmount}
                    onChange={(event) => handleNumberChange("depositAmount", event.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 pr-10 text-right text-sm font-semibold text-stone-800 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-stone-500">원</span>
                </div>
                <p className="mt-2 text-xs text-stone-500">노쇼 방지를 위한 기본 예약금 수준을 설정합니다.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 border-t border-stone-100 pt-4 dark:border-stone-800/50 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl bg-stone-50 p-4 dark:bg-stone-800/30">
                  <div>
                    <span className="block text-sm font-semibold text-stone-800 dark:text-stone-200">예약 자동 확정</span>
                    <span className="text-xs text-stone-500">신청 시 별도 승인 없이 즉시 확정</span>
                  </div>
                  <ToggleSwitch
                    checked={form.autoConfirm}
                    onChange={(nextValue) => handleToggleChange("autoConfirm", nextValue)}
                    ariaLabel="예약 자동 확정"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-stone-50 p-4 dark:bg-stone-800/30">
                  <div>
                    <span className="block text-sm font-semibold text-stone-800 dark:text-stone-200">현장 결제 허용</span>
                    <span className="text-xs text-stone-500">예약금 제외 잔금 현장 결제</span>
                  </div>
                  <ToggleSwitch
                    checked={form.allowOnsitePayment}
                    onChange={(nextValue) => handleToggleChange("allowOnsitePayment", nextValue)}
                    ariaLabel="현장 결제 허용"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <span className="material-icons-round" aria-hidden="true">
                  account_balance
                </span>
              </div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-white">정산 및 사업자 정보</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">사업자 등록번호</label>
                  <ReadonlyInput value={initialData.businessNumber} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">세금계산서 발행 이메일</label>
                  <input
                    type="email"
                    value={form.invoiceEmail}
                    onChange={(event) => handleStringChange("invoiceEmail", event.target.value)}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                    placeholder="billing@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700 dark:text-stone-300">정산 계좌</label>
                <div className="flex gap-2">
                  <select
                    value={form.settlementBank}
                    onChange={(event) => handleStringChange("settlementBank", event.target.value)}
                    className="w-1/3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                  >
                    {BANK_OPTIONS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={form.settlementAccount}
                    onChange={(event) => handleStringChange("settlementAccount", event.target.value)}
                    className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
                    placeholder="계좌번호 입력"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8 lg:col-span-1">
          <section className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark">
            <div className="mb-6 flex items-center gap-2">
              <span className="material-icons-round text-primary" aria-hidden="true">
                notifications_active
              </span>
              <h2 className="text-lg font-bold text-stone-800 dark:text-white">알림 설정</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">견적 요청 알림</span>
                <ToggleSwitch
                  checked={form.notifyQuoteRequest}
                  onChange={(nextValue) => handleToggleChange("notifyQuoteRequest", nextValue)}
                  ariaLabel="견적 요청 알림"
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">예약 생성 알림</span>
                <ToggleSwitch
                  checked={form.notifyBookingCreated}
                  onChange={(nextValue) => handleToggleChange("notifyBookingCreated", nextValue)}
                  ariaLabel="예약 생성 알림"
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">결제 완료 알림</span>
                <ToggleSwitch
                  checked={form.notifyPaymentCompleted}
                  onChange={(nextValue) => handleToggleChange("notifyPaymentCompleted", nextValue)}
                  ariaLabel="결제 완료 알림"
                  size="sm"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-4 z-[70] inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl dark:bg-gray-100 dark:text-gray-900 sm:right-6 sm:top-6"
        >
          <span className="material-icons text-base" aria-hidden="true">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
