import * as React from "react";

import type {
  OwnerQuoteRequestItem,
  QuoteChangeItem,
  QuoteTargetStatus
} from "@/features/chat/model/chat";
import {
  listOwnerQuoteRequests,
  upsertOwnerQuoteResponse
} from "@/features/chat/services/quote-browser-service";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const CHANGE_ITEM_OPTIONS: Array<{ value: QuoteChangeItem; label: string }> = [
  { value: "EXTENSION", label: "네일 연장" },
  { value: "REMOVAL", label: "제거" },
  { value: "ART_CHANGE", label: "아트 변경" },
  { value: "OTHER", label: "기타" }
];

const STATUS_PRIORITY: QuoteTargetStatus[] = ["REQUESTED", "RESPONDED", "SELECTED", "CLOSED"];
const REALTIME_REFRESH_DEBOUNCE_MS = 250;

export interface QuotePageViewModel {
  mounted: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  items: OwnerQuoteRequestItem[];
  selectedItem: OwnerQuoteRequestItem | null;
  selectedTargetId: string | null;
  finalPriceInput: string;
  memoInput: string;
  changeItems: QuoteChangeItem[];
  changeItemOptions: Array<{ value: QuoteChangeItem; label: string }>;
  statusCounts: Record<QuoteTargetStatus, number>;
  onSelectTarget: (targetId: string) => void;
  onFinalPriceChange: (value: string) => void;
  onMemoChange: (value: string) => void;
  onToggleChangeItem: (value: QuoteChangeItem) => void;
  onSubmit: () => Promise<void>;
  refresh: () => Promise<void>;
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "견적 요청서 데이터를 처리하지 못했습니다.";
}

function sortByStatusAndTime(items: OwnerQuoteRequestItem[]): OwnerQuoteRequestItem[] {
  return [...items].sort((a, b) => {
    const aIndex = STATUS_PRIORITY.indexOf(a.target_status);
    const bIndex = STATUS_PRIORITY.indexOf(b.target_status);

    if (aIndex !== bIndex) return aIndex - bIndex;

    const aTime = Date.parse(a.sent_at);
    const bTime = Date.parse(b.sent_at);

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    return bTime - aTime;
  });
}

export function useQuotePageViewModel(): QuotePageViewModel {
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [items, setItems] = React.useState<OwnerQuoteRequestItem[]>([]);
  const [selectedTargetId, setSelectedTargetId] = React.useState<string | null>(null);

  const [finalPriceInput, setFinalPriceInput] = React.useState("");
  const [memoInput, setMemoInput] = React.useState("");
  const [changeItemSet, setChangeItemSet] = React.useState<Set<QuoteChangeItem>>(new Set());
  const refreshDebounceTimerRef = React.useRef<number | null>(null);

  const selectedItem = React.useMemo(() => {
    if (items.length === 0) return null;
    if (!selectedTargetId) return items[0] ?? null;
    return items.find((item) => item.target_id === selectedTargetId) ?? items[0] ?? null;
  }, [items, selectedTargetId]);

  const statusCounts = React.useMemo(() => {
    const initial: Record<QuoteTargetStatus, number> = {
      REQUESTED: 0,
      RESPONDED: 0,
      SELECTED: 0,
      CLOSED: 0
    };

    for (const item of items) {
      initial[item.target_status] += 1;
    }

    return initial;
  }, [items]);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextItems = await listOwnerQuoteRequests(80);
      const sorted = sortByStatusAndTime(nextItems);
      setItems(sorted);
      if (sorted.length > 0) {
        setSelectedTargetId((prev) => {
          if (!prev) return sorted[0]?.target_id ?? null;
          return sorted.some((item) => item.target_id === prev) ? prev : sorted[0]?.target_id ?? null;
        });
      } else {
        setSelectedTargetId(null);
      }
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleDebouncedRefresh = React.useCallback(() => {
    if (typeof window === "undefined") {
      void refresh();
      return;
    }

    if (refreshDebounceTimerRef.current !== null) {
      window.clearTimeout(refreshDebounceTimerRef.current);
    }

    refreshDebounceTimerRef.current = window.setTimeout(() => {
      refreshDebounceTimerRef.current = null;
      void refresh();
    }, REALTIME_REFRESH_DEBOUNCE_MS);
  }, [refresh]);

  React.useEffect(() => {
    let active = true;

    const run = async () => {
      setMounted(true);
      await refresh();
      if (!active) return;
    };

    run();

    return () => {
      active = false;
    };
  }, [refresh]);

  React.useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }

    const realtimeChannel = supabase
      .channel(`owner-quote-realtime-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quote_request_targets" },
        () => {
          scheduleDebouncedRefresh();
        }
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "quote_responses" }, () => {
        scheduleDebouncedRefresh();
      });

    realtimeChannel.subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        setErrorMessage((prev) => prev ?? "실시간 동기화 연결에 실패했습니다. 수동 새로고침을 사용해 주세요.");
      }
    });

    return () => {
      if (refreshDebounceTimerRef.current !== null) {
        window.clearTimeout(refreshDebounceTimerRef.current);
        refreshDebounceTimerRef.current = null;
      }

      void supabase.removeChannel(realtimeChannel);
    };
  }, [scheduleDebouncedRefresh]);

  React.useEffect(() => {
    if (!selectedItem) {
      setFinalPriceInput("");
      setMemoInput("");
      setChangeItemSet(new Set());
      return;
    }

    if (selectedItem.response) {
      setFinalPriceInput(String(selectedItem.response.final_price));
      setMemoInput(selectedItem.response.memo);
      setChangeItemSet(new Set(selectedItem.response.change_items));
      return;
    }

    setFinalPriceInput("");
    setMemoInput("");
    setChangeItemSet(new Set());
  }, [selectedItem]);

  const onSelectTarget = React.useCallback((targetId: string) => {
    setSelectedTargetId(targetId);
    setErrorMessage(null);
  }, []);

  const onFinalPriceChange = React.useCallback((value: string) => {
    setFinalPriceInput(value);
  }, []);

  const onMemoChange = React.useCallback((value: string) => {
    setMemoInput(value);
  }, []);

  const onToggleChangeItem = React.useCallback((value: QuoteChangeItem) => {
    setChangeItemSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }, []);

  const onSubmit = React.useCallback(async () => {
    if (!selectedItem) {
      setErrorMessage("선택된 견적 요청서가 없습니다.");
      return;
    }

    if (selectedItem.target_status === "SELECTED" || selectedItem.target_status === "CLOSED") {
      setErrorMessage("이미 종료된 요청입니다. 다른 요청서를 선택해 주세요.");
      return;
    }

    const finalPrice = Number(finalPriceInput.trim());
    if (!Number.isInteger(finalPrice) || finalPrice < 0) {
      setErrorMessage("최종 가격은 0 이상의 정수로 입력해 주세요.");
      return;
    }

    const memo = memoInput.trim();
    if (!memo) {
      setErrorMessage("변동사항/메모를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await upsertOwnerQuoteResponse({
        targetId: selectedItem.target_id,
        finalPrice,
        changeItems: Array.from(changeItemSet),
        memo
      });
      await refresh();
      setSelectedTargetId(selectedItem.target_id);
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [changeItemSet, finalPriceInput, memoInput, refresh, selectedItem]);

  return {
    mounted,
    isLoading,
    isSubmitting,
    errorMessage,
    items,
    selectedItem,
    selectedTargetId,
    finalPriceInput,
    memoInput,
    changeItems: Array.from(changeItemSet),
    changeItemOptions: CHANGE_ITEM_OPTIONS,
    statusCounts,
    onSelectTarget,
    onFinalPriceChange,
    onMemoChange,
    onToggleChangeItem,
    onSubmit,
    refresh
  };
}
