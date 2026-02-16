/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CONVERSATIONS,
  QUOTE_OPTION_PRICES,
  type Conversation,
  type ConversationStatus
} from "@/features/chat/model/chat";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | ConversationStatus;
type RemovalType = "self" | "other";

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "new", label: "새 요청" },
  { key: "quoted", label: "견적 보냄" },
  { key: "selected", label: "선택됨" }
];

function formatKrw(value: number) {
  return `₩${new Intl.NumberFormat("ko-KR").format(value)}`;
}

function statusLabel(status: ConversationStatus) {
  if (status === "new") return "NEW";
  if (status === "quoted") return "견적 보냄";
  return "선택됨";
}

function statusBadgeClass(status: ConversationStatus) {
  if (status === "new") return "bg-primary text-white";
  if (status === "quoted") return "bg-blue-50 text-blue-500";
  return "bg-emerald-50 text-emerald-600";
}

function getHeaderStatusLabel(status: ConversationStatus) {
  if (status === "new") return "견적 요청";
  if (status === "quoted") return "견적 발송";
  return "예약 확정";
}

function getHeaderStatusClass(status: ConversationStatus) {
  if (status === "new") return "bg-primary/10 text-primary";
  if (status === "quoted") return "bg-blue-50 text-blue-600";
  return "bg-emerald-50 text-emerald-600";
}

function ConversationCard({
  conversation,
  active,
  onSelect
}: {
  conversation: Conversation;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const { preview } = conversation;

  return (
    <button
      type="button"
      onClick={() => onSelect(preview.id)}
      className={cn(
        "w-full cursor-pointer rounded-2xl p-4 text-left transition-all",
        active
          ? "relative border-2 border-primary/80 bg-white shadow-[0_16px_32px_-14px_rgba(232,92,79,0.35)]"
          : "border border-slate-100/80 bg-white/75 hover:border-primary/20 hover:bg-white hover:shadow-sm"
      )}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img src={preview.avatarUrl} alt="Customer" className="h-12 w-12 rounded-xl object-cover" />
          {preview.isOnline ? (
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between">
            <span className="truncate text-sm font-bold text-slate-900">{preview.customerName}</span>
            <span className={cn("text-[10px] font-bold", active ? "text-primary" : "text-slate-400")}>
              {preview.timeLabel}
            </span>
          </div>

          <div className="mb-2 flex items-center gap-2 overflow-hidden">
            <img
              src={preview.referenceImageUrl}
              alt="ref"
              className="h-6 w-6 shrink-0 rounded-md border border-slate-100 object-cover"
            />
            <div className="flex flex-wrap gap-1">
              {preview.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-bold text-slate-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="mr-2 truncate text-xs font-medium text-slate-500">{preview.lastMessage}</p>
            <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold", statusBadgeClass(preview.status))}>
              {statusLabel(preview.status)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function RequestCard({ conversation }: { conversation: Conversation }) {
  const { detail, preview } = conversation;

  return (
    <div className="flex items-start gap-4">
      <img src={preview.avatarUrl} alt="Customer" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
      <div className="max-w-[340px] space-y-2">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <span className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-tight text-slate-600">
              <span className="material-icons-round text-xs">assignment</span>
              견적 요청서
            </span>
            <span className="text-[10px] font-medium text-slate-400">오후 2:15</span>
          </div>

          <img src={preview.referenceImageUrl} alt="Ref" className="h-48 w-full object-cover" />

          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between rounded-lg border border-primary/5 bg-[#fdecea]/30 p-2.5">
              <span className="text-[11px] font-semibold text-slate-500">희망 금액대</span>
              <span className="text-base font-black text-primary">{detail.requestPriceRange}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-md bg-slate-50 p-2">
                <p className="mb-0.5 text-[9px] text-slate-400">요청일</p>
                <p className="font-bold text-slate-700">{detail.requestDate}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-2">
                <p className="mb-0.5 text-[9px] text-slate-400">제거여부</p>
                <p className="font-bold text-primary">{detail.removalPolicy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRemovalOption(removalType: RemovalType) {
  if (removalType === "self") {
    return {
      label: "자샵 제거",
      price: QUOTE_OPTION_PRICES.selfRemoval
    };
  }

  return {
    label: "타샵 제거",
    price: QUOTE_OPTION_PRICES.otherShopRemoval
  };
}

export function ChatPageClient() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedConversationId, setSelectedConversationId] = useState(conversations[0]?.preview.id ?? "");
  const [isQuoteComposerOpen, setIsQuoteComposerOpen] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [basePrice, setBasePrice] = useState(55000);
  const [removalType, setRemovalType] = useState<RemovalType>("self");
  const [includeExtension, setIncludeExtension] = useState(false);
  const [artCount, setArtCount] = useState(2);

  const filteredConversations = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return conversations.filter(({ preview }) => {
      const matchesStatus = statusFilter === "all" || preview.status === statusFilter;
      if (!matchesStatus) return false;
      if (normalized.length === 0) return true;

      return `${preview.customerName} ${preview.tags.join(" ")}`.toLowerCase().includes(normalized);
    });
  }, [conversations, query, statusFilter]);

  useEffect(() => {
    if (filteredConversations.length === 0) return;
    if (!filteredConversations.some((item) => item.preview.id === selectedConversationId)) {
      setSelectedConversationId(filteredConversations[0].preview.id);
    }
  }, [filteredConversations, selectedConversationId]);

  const selectedConversation =
    conversations.find((item) => item.preview.id === selectedConversationId) ?? filteredConversations[0];

  const selectedRemoval = getRemovalOption(removalType);
  const extensionPrice = includeExtension ? QUOTE_OPTION_PRICES.extension : 0;
  const quoteTotal =
    basePrice +
    selectedRemoval.price +
    extensionPrice +
    artCount * QUOTE_OPTION_PRICES.artPerUnit;
  const procedureSummary = [
    "기본 시술",
    selectedRemoval.label,
    includeExtension ? "연장" : null,
    `아트 ${artCount}개`
  ].filter(Boolean) as string[];

  const handleQuoteSendConfirm = () => {
    if (!selectedConversation) return;

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.preview.id !== selectedConversation.preview.id) return conversation;

        const nextStatus = conversation.preview.status === "selected" ? "selected" : "quoted";

        return {
          ...conversation,
          preview: {
            ...conversation.preview,
            status: nextStatus,
            timeLabel: "방금",
            lastMessage: "견적서 전송 완료"
          }
        };
      })
    );

    setIsConfirmModalOpen(false);
    setStatusFilter("all");
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-[radial-gradient(circle_at_16%_0%,rgba(232,92,79,0.08),transparent_36%),linear-gradient(to_bottom,#fdfbf9,#f7f3f1)]">
      <section className="z-20 flex w-80 shrink-0 flex-col border-r border-primary/10 bg-white/65 backdrop-blur-md lg:w-[380px]">
        <div className="p-6 pb-2">
          <h1 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
            견적 및 채팅
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">12</span>
          </h1>

          <div className="relative mb-4">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="고객명, 스타일 검색"
              className="w-full rounded-xl border-none bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="no-scrollbar flex gap-1 overflow-x-auto pb-2">
            {STATUS_FILTERS.map((item) => {
              const active = item.key === statusFilter;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setStatusFilter(item.key)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-bold",
                    active
                      ? "bg-primary text-white"
                      : "border border-slate-100 bg-white text-slate-500 shadow-sm"
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-3 pb-6 pt-2">
          {filteredConversations.map((conversation) => (
            <ConversationCard
              key={conversation.preview.id}
              conversation={conversation}
              active={selectedConversation?.preview.id === conversation.preview.id}
              onSelect={setSelectedConversationId}
            />
          ))}
        </div>
      </section>

      {selectedConversation ? (
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
          <header className="h-32 shrink-0 border-b border-primary/10 bg-white/90 px-8 backdrop-blur-xl">
            <div className="flex h-full flex-col justify-center">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-extrabold text-slate-900">{selectedConversation.preview.customerName}</h2>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      getHeaderStatusClass(selectedConversation.preview.status)
                    )}
                  >
                    {getHeaderStatusLabel(selectedConversation.preview.status)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:bg-primary/5 hover:text-primary">
                    <span className="material-icons-round text-xl">more_vert</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">디자인 분위기</span>
                  <span className="text-[11px] font-bold text-slate-700">{selectedConversation.detail.styleMood}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">제거여부</span>
                  <span className="text-[11px] font-bold text-primary">{selectedConversation.detail.removalPolicy}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">길이/모양</span>
                  <span className="text-[11px] font-bold text-slate-700">{selectedConversation.detail.lengthShape}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">아트 정보</span>
                  <span className="text-[11px] font-bold text-slate-700">{selectedConversation.detail.artInfo}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto bg-transparent p-8">
            <RequestCard conversation={selectedConversation} />

            <div className="flex items-center">
              <div className="h-px flex-1 bg-slate-200" />
              <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">견적이 전송되었습니다</p>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="flex flex-row-reverse items-start gap-3">
              <div className="w-[330px] overflow-hidden rounded-2xl border border-primary/25 bg-white shadow-[0_16px_36px_-14px_rgba(232,92,79,0.28)]">
                <div className="bg-primary p-5 text-center text-white">
                  <p className="mb-1 text-[10px] font-bold opacity-80">ONEUL 네일샵 확정 견적서</p>
                  <h3 className="text-4xl font-black">{formatKrw(quoteTotal)}</h3>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                    <span className="text-slate-400">기본 케어 + 시럽</span>
                    <span className="font-bold">{formatKrw(basePrice)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                    <span className="text-slate-400">{selectedRemoval.label}</span>
                    <span className="font-bold">{formatKrw(selectedRemoval.price)}</span>
                  </div>
                  {includeExtension ? (
                    <div className="flex justify-between border-b border-slate-50 pb-2 text-xs">
                      <span className="text-slate-400">연장</span>
                      <span className="font-bold">{formatKrw(QUOTE_OPTION_PRICES.extension)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">디자인 아트 추가 ({artCount}개)</span>
                    <span className="font-bold">{formatKrw(artCount * QUOTE_OPTION_PRICES.artPerUnit)}</span>
                  </div>

                  <div className="pt-4">
                    <p className="mb-3 text-center text-[10px] font-bold text-primary">오늘 23:59까지 유효한 견적입니다</p>
                    <button
                      type="button"
                      className="w-full cursor-default rounded-lg border border-slate-200/50 bg-slate-100 py-2.5 text-[11px] font-bold text-slate-400"
                    >
                      전송 완료된 견적
                    </button>
                  </div>
                </div>
              </div>
              <span className="mt-auto text-[10px] text-slate-400">오후 2:25</span>
            </div>
          </div>

          <footer className="relative shrink-0 border-t border-slate-100 bg-white/95 p-6 backdrop-blur-md">
            {isQuoteComposerOpen ? (
              <div className="mb-6 rounded-2xl border-2 border-primary/15 bg-[#fdf1ee] p-6 shadow-[0_12px_28px_-14px_rgba(232,92,79,0.35)]">
                <div className="mb-5 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-sm font-extrabold text-primary">
                    <span className="material-icons-round text-lg">payments</span>
                    견적 상세 작성
                  </h4>
                  <div className="flex items-center gap-2">
                    {selectedConversation.preview.status === "quoted" ? (
                      <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">전송 완료</span>
                    ) : null}
                    <button
                      type="button"
                      aria-label="견적 상세 작성 닫기"
                      onClick={() => {
                        setIsQuoteComposerOpen(false);
                        setIsConfirmModalOpen(false);
                      }}
                      className="text-slate-300 transition-colors hover:text-slate-600"
                    >
                      <span className="material-icons-round text-lg">close</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">기본 시술 금액</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₩</span>
                        <input
                          type="number"
                          value={basePrice}
                          min={0}
                          onChange={(event) => setBasePrice(Number(event.target.value) || 0)}
                          className="w-full rounded-xl border-slate-100 bg-white p-2.5 pl-7 text-sm font-black focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end gap-2.5 pb-1">
                      <label className="group flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="removalType"
                          checked={removalType === "self"}
                          onChange={() => setRemovalType("self")}
                          className="h-4 w-4 rounded-full border-slate-200 text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-primary">
                          자샵 제거 ({formatKrw(QUOTE_OPTION_PRICES.selfRemoval)})
                        </span>
                      </label>

                      <label className="group flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="removalType"
                          checked={removalType === "other"}
                          onChange={() => setRemovalType("other")}
                          className="h-4 w-4 rounded-full border-slate-200 text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-primary">
                          타샵 제거 ({formatKrw(QUOTE_OPTION_PRICES.otherShopRemoval)})
                        </span>
                      </label>

                      <label className="group flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={includeExtension}
                          onChange={(event) => setIncludeExtension(event.target.checked)}
                          className="peer sr-only"
                        />
                        <span
                          className={cn(
                            "relative h-4 w-4 rounded-full border transition-colors",
                            includeExtension ? "border-primary bg-primary" : "border-slate-300 bg-white"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors",
                              includeExtension ? "bg-white" : "bg-transparent"
                            )}
                          />
                        </span>
                        <span className="text-xs font-bold text-slate-600 group-hover:text-primary">
                          연장 ({formatKrw(QUOTE_OPTION_PRICES.extension)})
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/80 p-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                        디자인 아트 추가 (개당 {formatKrw(QUOTE_OPTION_PRICES.artPerUnit)})
                      </span>
                      <span className="text-xs font-extrabold text-slate-700">아트 디자인 개수</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setArtCount((prev) => Math.max(prev - 1, 0))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-primary/30 hover:text-primary"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-base font-black text-slate-800">{artCount}</span>
                      <button
                        type="button"
                        onClick={() => setArtCount((prev) => prev + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-primary/30 hover:text-primary"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-primary/10 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <span className="material-icons-round text-sm">equalizer</span>
                      총 합계 견적
                    </div>
                    <div className="text-4xl font-black tracking-tight text-primary">{formatKrw(quoteTotal)}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsConfirmModalOpen(true)}
                    className="w-full rounded-xl bg-gradient-to-r from-[#eb5547] to-[#df4b3d] py-4 text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95"
                  >
                    이 금액으로 견적서 전송하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 flex items-center justify-between rounded-2xl border border-primary/20 bg-[#fdf1ee]/70 px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-slate-700">견적 상세 작성이 닫혀 있습니다.</p>
                  <p className="text-xs text-slate-500">필요할 때 다시 열어 견적을 작성할 수 있어요.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuoteComposerOpen(true)}
                  className="rounded-lg border border-primary/20 bg-white px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/5"
                >
                  견적 작성 열기
                </button>
              </div>
            )}

            {isConfirmModalOpen ? (
              <div className="absolute inset-0 z-40 flex items-center justify-center rounded-t-2xl bg-white/65 p-2 backdrop-blur-[2px]">
                <div className="w-full max-w-[370px] rounded-[15px] border border-primary/20 bg-[#fff8f6] p-[14px] shadow-[0_30px_60px_-30px_rgba(31,41,55,0.45)]">
                  <h5 className="mb-3 flex items-center gap-1.5 text-[31px] font-black text-slate-900">
                    <span className="h-[5px] w-[5px] rounded-full bg-primary" />
                    견적 전송 확인
                  </h5>

                  <div className="mb-4 flex flex-col gap-2.5">
                    <div>
                      <p className="text-[26px] font-bold text-slate-400">총 견적 금액</p>
                      <p className="text-[24px] font-black tracking-tight text-slate-900">{formatKrw(quoteTotal)}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-[26px] font-bold text-slate-400">시술 요약</p>
                      <div className="flex flex-wrap gap-1">
                        {procedureSummary.map((item) => (
                          <span
                            key={item}
                            className="rounded-xl border border-slate-200 bg-white px-1.5 py-[3px] text-[27px] font-bold text-slate-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsConfirmModalOpen(false)}
                      className="rounded-full border border-slate-200 bg-white py-2 text-[32px] font-black text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleQuoteSendConfirm}
                      className="rounded-full bg-primary py-2 text-[32px] font-black text-white shadow-lg shadow-primary/25 transition-opacity hover:opacity-95"
                    >
                      전송하기
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-400 transition-colors hover:text-primary"
              >
                <span className="material-icons-round">add_circle_outline</span>
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요..."
                  className="w-full rounded-xl border-slate-100 bg-slate-50 py-3.5 pl-6 pr-14 text-sm font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-primary/10"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary transition-transform hover:scale-110">
                  <span className="material-icons-round">send</span>
                </button>
              </div>
            </div>
          </footer>
        </section>
      ) : null}
    </div>
  );
}
