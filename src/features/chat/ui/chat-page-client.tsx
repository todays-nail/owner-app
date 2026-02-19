/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";

import type {
  OwnerQuoteRequestItem,
  QuoteRequestStatus,
  QuoteTargetStatus
} from "@/features/chat/model/chat";
import { useQuotePageViewModel } from "@/features/chat/view-model/use-quote-page-view-model";
import { cn } from "@/lib/utils";

function formatKrw(value: number) {
  return `₩${new Intl.NumberFormat("ko-KR").format(value)}`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(parsed);
}

function targetStatusLabel(status: QuoteTargetStatus) {
  if (status === "REQUESTED") return "요청 전송";
  if (status === "RESPONDED") return "응답 완료";
  if (status === "SELECTED") return "선택됨";
  return "종료";
}

function targetStatusClass(status: QuoteTargetStatus) {
  if (status === "REQUESTED") return "bg-amber-50 text-amber-700";
  if (status === "RESPONDED") return "bg-blue-50 text-blue-700";
  if (status === "SELECTED") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-500";
}

function requestStatusLabel(status: QuoteRequestStatus) {
  if (status === "OPEN") return "요청 진행중";
  if (status === "SELECTED") return "샵 선택 완료";
  return "종료";
}

function requestStatusClass(status: QuoteRequestStatus) {
  if (status === "OPEN") return "bg-primary/10 text-primary";
  if (status === "SELECTED") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-500";
}

function modeLabel(mode: OwnerQuoteRequestItem["request"]["target_mode"]) {
  return mode === "REGION_ALL" ? "지역 전체 발송" : "선택 샵 발송";
}

function QuoteListItem({
  item,
  active,
  onSelect
}: {
  item: OwnerQuoteRequestItem;
  active: boolean;
  onSelect: (targetId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.target_id)}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition-colors",
        active
          ? "border-primary/60 bg-white shadow-[0_12px_28px_-14px_rgba(232,92,79,0.4)]"
          : "border-slate-100 bg-white/80 hover:border-primary/20"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">{item.request.user_nickname}</p>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", targetStatusClass(item.target_status))}>
          {targetStatusLabel(item.target_status)}
        </span>
      </div>

      <p className="mb-2 line-clamp-2 text-xs font-medium text-slate-600">{item.request.request_note}</p>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{item.shop.name}</span>
        <span>{formatDateTime(item.sent_at)}</span>
      </div>
    </button>
  );
}

function imageOrFallback(url: string | null, label: string) {
  if (!url) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs font-semibold text-slate-400">
        {label} 없음
      </div>
    );
  }

  return <img src={url} alt={label} className="h-32 w-full rounded-xl border border-slate-100 object-cover" />;
}

export function ChatPageClient() {
  const vm = useQuotePageViewModel();

  const selectedItem = vm.selectedItem;

  const canSubmit = useMemo(() => {
    if (!selectedItem) return false;
    if (vm.isSubmitting) return false;
    if (selectedItem.target_status === "SELECTED" || selectedItem.target_status === "CLOSED") return false;

    const finalPrice = Number(vm.finalPriceInput.trim());
    if (!Number.isInteger(finalPrice) || finalPrice < 0) return false;
    if (vm.memoInput.trim().length === 0) return false;
    return true;
  }, [selectedItem, vm.finalPriceInput, vm.isSubmitting, vm.memoInput]);

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-gradient-to-b from-background via-background to-muted">
      <section className="z-20 flex w-80 shrink-0 flex-col border-r border-primary/10 bg-white/65 backdrop-blur-md lg:w-[370px]">
        <div className="space-y-3 p-6 pb-3">
          <h1 className="text-xl font-extrabold text-slate-800">견적 요청서</h1>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
              신규 {vm.statusCounts.REQUESTED}
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
              응답 {vm.statusCounts.RESPONDED}
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
              선택 {vm.statusCounts.SELECTED}
            </div>
            <div className="rounded-xl border border-slate-100 bg-white px-3 py-2">
              종료 {vm.statusCounts.CLOSED}
            </div>
          </div>
        </div>

        <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-3 pb-6">
          {vm.isLoading && vm.items.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center text-sm font-semibold text-slate-500">
              불러오는 중...
            </div>
          ) : vm.items.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/80 text-sm font-semibold text-slate-500">
              표시할 요청서가 없습니다.
            </div>
          ) : (
            vm.items.map((item) => (
              <QuoteListItem
                key={item.target_id}
                item={item}
                active={item.target_id === vm.selectedTargetId}
                onSelect={vm.onSelectTarget}
              />
            ))
          )}
        </div>
      </section>

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {selectedItem ? (
          <>
            <header className="border-b border-primary/10 bg-white/90 px-8 py-6 backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-slate-900">{selectedItem.request.user_nickname} 견적 요청서</h2>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold",
                    requestStatusClass(selectedItem.request.status)
                  )}
                >
                  {requestStatusLabel(selectedItem.request.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600 xl:grid-cols-4">
                <div className="rounded-lg bg-slate-50 px-3 py-2">모드: {modeLabel(selectedItem.request.target_mode)}</div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">희망일: {selectedItem.request.preferred_date}</div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">샵: {selectedItem.shop.name}</div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">요청시각: {formatDateTime(selectedItem.sent_at)}</div>
              </div>
            </header>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
              <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
                <div className="space-y-5">
                  <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]">
                    <h3 className="mb-3 text-sm font-black text-slate-800">요청 메모</h3>
                    <p className="text-sm leading-relaxed text-slate-700">{selectedItem.request.request_note}</p>
                  </section>

                  <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]">
                    <h3 className="mb-3 text-sm font-black text-slate-800">첨부 이미지 3장</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        {imageOrFallback(selectedItem.images.user_hand_image, "사용자 손")}
                        <p className="mt-1 text-[11px] font-semibold text-slate-500">사용자 손 사진</p>
                      </div>
                      <div>
                        {imageOrFallback(selectedItem.images.ai_input_hand_image, "AI 입력 손")}
                        <p className="mt-1 text-[11px] font-semibold text-slate-500">AI 입력 손 사진</p>
                      </div>
                      <div>
                        {imageOrFallback(selectedItem.images.ai_result_image, "AI 결과")}
                        <p className="mt-1 text-[11px] font-semibold text-slate-500">AI 피팅 결과</p>
                      </div>
                    </div>
                  </section>
                </div>

                <section className="rounded-2xl border border-primary/15 bg-white p-5 shadow-[0_20px_45px_-30px_rgba(232,92,79,0.35)]">
                  <h3 className="mb-4 text-sm font-black text-primary">견적 응답 작성</h3>

                  <div className="mb-4 space-y-3">
                    <label className="block text-xs font-bold text-slate-600">최종 가격</label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={vm.finalPriceInput}
                      onChange={(event) => vm.onFinalPriceChange(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-primary"
                      placeholder="예: 85000"
                    />
                  </div>

                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-bold text-slate-600">변동 항목</p>
                    {vm.changeItemOptions.map((option) => {
                      const checked = vm.changeItems.includes(option.value);
                      return (
                        <label key={option.value} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => vm.onToggleChangeItem(option.value)}
                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>

                  <div className="mb-4 space-y-2">
                    <label className="block text-xs font-bold text-slate-600">메모</label>
                    <textarea
                      value={vm.memoInput}
                      onChange={(event) => vm.onMemoChange(event.target.value)}
                      className="h-28 w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary"
                      placeholder="예: 연장/제거 여부에 따라 금액이 일부 변동될 수 있습니다."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      void vm.onSubmit();
                    }}
                    disabled={!canSubmit}
                    className={cn(
                      "w-full rounded-xl py-3 text-sm font-black text-white transition-opacity",
                      canSubmit ? "bg-primary hover:opacity-90" : "bg-slate-300"
                    )}
                  >
                    {vm.isSubmitting ? "저장 중..." : "견적 응답 저장"}
                  </button>

                  {selectedItem.response ? (
                    <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-700">
                      <p className="mb-1 font-bold">최근 저장된 응답</p>
                      <p>최종가: {formatKrw(selectedItem.response.final_price)}</p>
                      <p>수정시각: {formatDateTime(selectedItem.response.updated_at)}</p>
                    </div>
                  ) : null}
                </section>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
            왼쪽에서 견적 요청서를 선택해 주세요.
          </div>
        )}
      </section>

      {vm.errorMessage ? (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {vm.errorMessage}
        </div>
      ) : null}
    </div>
  );
}
