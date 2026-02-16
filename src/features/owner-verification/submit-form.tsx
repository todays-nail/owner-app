"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  ImagePlus,
  MapPin,
  Phone,
  Search,
  UploadCloud
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type InitialValues = {
  status: "UNSUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  business_number: string;
  shop_name: string;
  owner_name: string;
  contact_phone: string;
  shop_address1: string;
  shop_address2: string;
  shop_postcode: string;
  shop_photo_path: string | null;
  rejected_reason: string | null;
};

type Draft = {
  business_number: string;
  shop_name: string;
  owner_name: string;
  contact_phone: string;
  shop_address1: string;
  shop_address2: string;
  shop_postcode: string;
  updated_at: string;
};

const LICENSE_BUCKET = "owner-licenses";
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function RequiredMark() {
  return <span className="ml-1 text-primary">*</span>;
}

function safeFileExt(filename: string) {
  const lastDot = filename.lastIndexOf(".");
  const ext = lastDot >= 0 ? filename.slice(lastDot + 1) : "";
  const cleaned = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned || "bin";
}

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)}MB`;
}

export function OwnerVerificationSubmitForm({ initial }: { initial: InitialValues }) {
  const router = useRouter();
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  const [businessNumber, setBusinessNumber] = React.useState(initial.business_number);
  const [shopName, setShopName] = React.useState(initial.shop_name);
  const [ownerName, setOwnerName] = React.useState(initial.owner_name);
  const [contactPhone, setContactPhone] = React.useState(initial.contact_phone);
  const [shopAddress1, setShopAddress1] = React.useState(initial.shop_address1);
  const [shopAddress2, setShopAddress2] = React.useState(initial.shop_address2);
  const [shopPostcode, setShopPostcode] = React.useState(initial.shop_postcode);

  const [shopPhotoFile, setShopPhotoFile] = React.useState<File | null>(null);
  const [licenseFile, setLicenseFile] = React.useState<File | null>(null);
  const [licenseDragging, setLicenseDragging] = React.useState(false);

  const [uid, setUid] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [showDraftBanner, setShowDraftBanner] = React.useState(false);

  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const draftKey = uid ? `owner_verification_draft:v1:${uid}` : null;

  const currentTextSnapshot: Draft = React.useMemo(
    () => ({
      business_number: businessNumber,
      shop_name: shopName,
      owner_name: ownerName,
      contact_phone: contactPhone,
      shop_address1: shopAddress1,
      shop_address2: shopAddress2,
      shop_postcode: shopPostcode,
      updated_at: new Date().toISOString()
    }),
    [
      businessNumber,
      shopName,
      ownerName,
      contactPhone,
      shopAddress1,
      shopAddress2,
      shopPostcode
    ]
  );

  const applyDraft = React.useCallback((d: Draft) => {
    setBusinessNumber(d.business_number);
    setShopName(d.shop_name);
    setOwnerName(d.owner_name);
    setContactPhone(d.contact_phone);
    setShopAddress1(d.shop_address1);
    setShopAddress2(d.shop_address2);
    setShopPostcode(d.shop_postcode);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) return;
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setUid(user?.id ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  React.useEffect(() => {
    if (!draftKey) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Draft;
      if (!parsed || typeof parsed !== "object") return;
      setDraft(parsed);

      const isInitialBlank =
        !initial.business_number &&
        !initial.shop_name &&
        !initial.owner_name &&
        !initial.contact_phone &&
        !initial.shop_address1 &&
        !initial.shop_address2 &&
        !initial.shop_postcode;

      if (isInitialBlank) {
        applyDraft(parsed);
      } else {
        setShowDraftBanner(true);
      }
    } catch {
      // ignore broken draft
    }
  }, [applyDraft, draftKey, initial]);

  function validateAll() {
    if (!shopName.trim()) return "상호명을 입력해 주세요.";
    if (!ownerName.trim()) return "대표자명을 입력해 주세요.";
    if (!businessNumber.trim()) return "사업자등록번호를 입력해 주세요.";
    if (!contactPhone.trim()) return "연락처를 입력해 주세요.";
    if (!shopAddress1.trim()) return "주소를 입력해 주세요.";
    if (!licenseFile) return "사업자등록증 파일을 업로드해 주세요.";
    return null;
  }

  async function saveDraft() {
    setError(null);
    if (!draftKey) {
      setError("임시 저장을 위해 로그인 정보를 확인 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    try {
      localStorage.setItem(draftKey, JSON.stringify(currentTextSnapshot));
      setDraft(currentTextSnapshot);
      setShowDraftBanner(false);
    } catch {
      setError("임시 저장에 실패했습니다. 브라우저 설정을 확인해 주세요.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_26px_70px_-35px_hsl(var(--foreground)/0.25)]">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <aside className="relative lg:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-b from-[#fff3ef] via-[#fff7f5] to-[#fff3f1]" />
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex h-full flex-col p-8 lg:p-10">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary">
                  <BadgeCheck className="h-4 w-4" aria-hidden />
                </div>
                <div className="text-sm font-semibold tracking-tight">Nail Partner</div>
              </div>

              <h1 className="mt-10 text-3xl font-semibold leading-tight tracking-tight">
                파트너님,
                <br />
                환영합니다!
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                안전하고 신뢰할 수 있는 서비스 제공을 위해 사업자 인증을 진행해 주세요.
                <br />
                인증은 영업일 기준 1-2일 소요됩니다.
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "매장 홍보 및 예약 관리",
                  "고객 리뷰 및 정산 시스템",
                  "전용 마케팅 도구 지원"
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-card/80 shadow-sm">
                      <Check className="h-4 w-4 text-primary" aria-hidden />
                    </span>
                    <span className="font-medium text-foreground/80">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-10">
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src="/images/onboarding-shop.svg"
                      alt="매장 이미지"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="p-8 lg:p-10">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <BadgeCheck className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <div className="text-base font-semibold tracking-tight">사업자 정보 인증</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      필수 항목을 모두 입력하고 서류를 업로드해 주세요.
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-sm">
                  <span className="font-semibold text-primary">Step 1</span>
                  <span className="px-2 text-muted-foreground">/</span>
                  <span className="text-muted-foreground">Step 2</span>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-border/70" />

              {initial.status === "REJECTED" && initial.rejected_reason ? (
                <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
                  <div className="font-semibold text-foreground">반려 사유</div>
                  <div className="mt-1 text-muted-foreground">{initial.rejected_reason}</div>
                  <div className="mt-2 text-muted-foreground">
                    내용을 수정한 뒤 사업자등록증을 다시 업로드해 제출해 주세요.
                  </div>
                </div>
              ) : null}

              {showDraftBanner && draft ? (
                <div className="mt-6 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm">
                  <div className="font-semibold">임시 저장된 내용이 있습니다</div>
                  <div className="mt-1 text-muted-foreground">
                    {new Date(draft.updated_at).toLocaleString()} 저장
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        applyDraft(draft);
                        setShowDraftBanner(false);
                      }}
                    >
                      불러오기
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setShowDraftBanner(false)}
                    >
                      닫기
                    </Button>
                  </div>
                </div>
              ) : null}

              <form
                className="mt-8 space-y-7"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);

                  const v = validateAll();
                  if (v) {
                    setError(v);
                    return;
                  }

                  setPending(true);
                  try {
                    if (!supabase) {
                      setError("Missing env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
                      return;
                    }

                    const {
                      data: { user },
                      error: userError
                    } = await supabase.auth.getUser();

                    if (userError || !user) {
                      setError("로그인이 필요합니다. 다시 로그인해 주세요.");
                      return;
                    }

                    const licenseExt = safeFileExt(licenseFile!.name);
                    const licensePath = `licenses/${user.id}/${crypto.randomUUID()}.${licenseExt}`;

                    const { error: licenseUploadError } = await supabase.storage
                      .from(LICENSE_BUCKET)
                      .upload(licensePath, licenseFile!, { upsert: false });

                    if (licenseUploadError) {
                      setError(licenseUploadError.message);
                      return;
                    }

                    let shopPhotoPath: string | null = initial.shop_photo_path;
                    if (shopPhotoFile) {
                      const photoExt = safeFileExt(shopPhotoFile.name);
                      const photoPath = `shops/${user.id}/${crypto.randomUUID()}.${photoExt}`;
                      const { error: photoUploadError } = await supabase.storage
                        .from(LICENSE_BUCKET)
                        .upload(photoPath, shopPhotoFile, { upsert: false });
                      if (photoUploadError) {
                        setError(photoUploadError.message);
                        return;
                      }
                      shopPhotoPath = photoPath;
                    }

                    const { error: upsertError } = await supabase.from("owner_verifications").upsert(
                      {
                        user_id: user.id,
                        status: "PENDING",
                        business_number: businessNumber.trim(),
                        shop_name: shopName.trim(),
                        owner_name: ownerName.trim(),
                        contact_phone: contactPhone.trim(),
                        shop_address1: shopAddress1.trim(),
                        shop_address2: shopAddress2.trim() || null,
                        shop_postcode: shopPostcode.trim() || null,
                        shop_photo_path: shopPhotoPath,
                        business_license_path: licensePath,
                        rejected_reason: null,
                        submitted_at: new Date().toISOString()
                      },
                      { onConflict: "user_id" }
                    );

                    if (upsertError) {
                      setError(upsertError.message);
                      return;
                    }

                    if (draftKey) {
                      try {
                        localStorage.removeItem(draftKey);
                      } catch {
                        // ignore
                      }
                    }

                    router.refresh();
                    router.push("/verification/pending");
                  } finally {
                    setPending(false);
                  }
                }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="shop-name" className="text-sm font-semibold">
                      상호명 <RequiredMark />
                    </label>
                    <div className="relative">
                      <Input
                        id="shop-name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="예: 뷰티 네일 강남점"
                        className="h-12 rounded-full pl-11"
                        required
                      />
                      <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="owner-name" className="text-sm font-semibold">
                      대표자명 <RequiredMark />
                    </label>
                    <Input
                      id="owner-name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="대표자 성함"
                      className="h-12 rounded-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="business-number" className="text-sm font-semibold">
                      사업자등록번호 <RequiredMark />
                    </label>
                    <div className="relative">
                      <Input
                        id="business-number"
                        value={businessNumber}
                        onChange={(e) => setBusinessNumber(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="0000000000"
                        className="h-12 rounded-full pr-11"
                        required
                        inputMode="numeric"
                      />
                      <BadgeCheck className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      하이픈(-) 없이 숫자만 입력해주세요.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-phone" className="text-sm font-semibold">
                      연락처 <RequiredMark />
                    </label>
                    <div className="relative">
                      <Input
                        id="contact-phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="010-0000-0000"
                        className="h-12 rounded-full pr-11"
                        required
                        inputMode="tel"
                      />
                      <Phone className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="shop-address1" className="text-sm font-semibold">
                    매장 주소 <RequiredMark />
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full">
                      <Input
                        id="shop-address1"
                        value={shopAddress1}
                        onChange={(e) => setShopAddress1(e.target.value)}
                        placeholder="주소를 검색해주세요"
                        className="h-12 rounded-full pl-11"
                        required
                      />
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 rounded-full bg-muted/60 px-6"
                      disabled
                      aria-disabled
                      title="주소 검색 기능은 준비 중입니다."
                    >
                      <Search className="mr-2 h-4 w-4" aria-hidden />
                      검색
                    </Button>
                  </div>
                  <Input
                    value={shopAddress2}
                    onChange={(e) => setShopAddress2(e.target.value)}
                    placeholder="상세 주소를 입력해주세요"
                    className="h-12 rounded-full"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="hidden sm:block" />
                    <div className="space-y-2">
                      <label htmlFor="shop-postcode" className="sr-only">
                        우편번호 (선택)
                      </label>
                      <Input
                        id="shop-postcode"
                        value={shopPostcode}
                        onChange={(e) => setShopPostcode(e.target.value)}
                        placeholder="우편번호 (선택)"
                        className="h-12 rounded-full"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-border/70" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">
                      사업자등록증 업로드
                      <RequiredMark />
                    </label>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      필수
                    </span>
                  </div>

                  <label
                    className={cn(
                      "group block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
                      "bg-primary/5 hover:bg-primary/10",
                      licenseDragging ? "border-primary" : "border-primary/40"
                    )}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLicenseDragging(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLicenseDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLicenseDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLicenseDragging(false);
                      const f = e.dataTransfer.files?.[0] ?? null;
                      if (!f) return;
                      if (f.size > MAX_FILE_BYTES) {
                        setError(`사업자등록증은 ${formatBytes(MAX_FILE_BYTES)} 이하로 업로드해 주세요.`);
                        setLicenseFile(null);
                        return;
                      }
                      setError(null);
                      setLicenseFile(f);
                    }}
                  >
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/*,application/pdf"
                      required
                      onChange={(e) => {
                        setError(null);
                        const f = e.target.files?.[0] ?? null;
                        if (f && f.size > MAX_FILE_BYTES) {
                          setError(`사업자등록증은 ${formatBytes(MAX_FILE_BYTES)} 이하로 업로드해 주세요.`);
                          e.currentTarget.value = "";
                          setLicenseFile(null);
                          return;
                        }
                        setLicenseFile(f);
                      }}
                    />

                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-card shadow-sm">
                      <UploadCloud className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <div className="mt-4 text-sm font-semibold">
                      파일을 드래그하거나{" "}
                      <span className="text-primary underline underline-offset-4">
                        클릭하여 업로드
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      JPG, PNG, PDF (최대 {formatBytes(MAX_FILE_BYTES)})
                    </div>
                    {licenseFile ? (
                      <div className="mt-4 text-xs text-foreground/80">
                        선택됨: <span className="font-medium">{licenseFile.name}</span>
                      </div>
                    ) : null}
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold">매장 외관 사진 (선택)</label>
                  <div className="flex items-start gap-4">
                    <label className="group grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-2xl border border-border bg-muted/40 transition-colors hover:bg-muted/60">
                      <input
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setError(null);
                          const f = e.target.files?.[0] ?? null;
                          if (f && f.size > MAX_FILE_BYTES) {
                            setError(`매장 사진은 ${formatBytes(MAX_FILE_BYTES)} 이하로 업로드해 주세요.`);
                            e.currentTarget.value = "";
                            setShopPhotoFile(null);
                            return;
                          }
                          setShopPhotoFile(f);
                        }}
                      />
                      <ImagePlus className="h-5 w-5 text-muted-foreground group-hover:text-foreground/70" aria-hidden />
                      <div className="mt-1 text-[11px] text-muted-foreground">추가</div>
                    </label>
                    <div className="pt-1">
                      <div className="text-sm text-muted-foreground">
                        매장 분위기를 알 수 있는 사진을 등록하면 승인 확률이 높아집니다.
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {shopPhotoFile ? (
                          <>
                            선택됨: <span className="font-medium text-foreground/80">{shopPhotoFile.name}</span>
                          </>
                        ) : initial.shop_photo_path ? (
                          "기존에 제출된 매장 사진이 있습니다. 새 파일을 선택하면 교체됩니다."
                        ) : (
                          <>JPG/PNG, 최대 {formatBytes(MAX_FILE_BYTES)}</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-full px-6"
                    onClick={saveDraft}
                  >
                    임시 저장
                  </Button>

                  <Button
                    disabled={pending}
                    type="submit"
                    className="h-12 rounded-full px-7 shadow-[0_14px_30px_-18px_hsl(var(--primary)/0.9)]"
                  >
                    {pending ? "요청 중..." : "인증 요청하기"}
                    <ChevronRight className="ml-2 h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
