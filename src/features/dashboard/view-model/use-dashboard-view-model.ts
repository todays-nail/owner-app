"use client";

import * as React from "react";

import type {
  DashboardScheduleItem,
  DashboardSummary,
  OwnerPaymentLedgerUpsertInput,
} from "@/features/dashboard/model/dashboard-summary";
import {
  fetchOwnerDashboardSummary,
  upsertOwnerPaymentLedger,
} from "@/features/dashboard/services/dashboard-browser-service";

const INITIAL_SUMMARY: DashboardSummary = {
  date: "",
  dateLabel: "",
  timezone: "Asia/Seoul",
  todayRevenue: 0,
  newBookingsCount: 0,
};

export interface DashboardViewModel {
  mounted: boolean;
  isLoading: boolean;
  isSubmittingPayment: boolean;
  errorMessage: string | null;
  summary: DashboardSummary;
  scheduleItems: DashboardScheduleItem[];
  refresh: () => Promise<void>;
  submitPayment: (input: OwnerPaymentLedgerUpsertInput) => Promise<void>;
}

function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return "대시보드 데이터를 불러오지 못했습니다.";
}

export function useDashboardViewModel(): DashboardViewModel {
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmittingPayment, setIsSubmittingPayment] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<DashboardSummary>(INITIAL_SUMMARY);
  const [scheduleItems, setScheduleItems] = React.useState<DashboardScheduleItem[]>([]);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchOwnerDashboardSummary();
      setSummary(result.summary);
      setScheduleItems(result.scheduleItems);
    } catch (error) {
      setSummary(INITIAL_SUMMARY);
      setScheduleItems([]);
      setErrorMessage(normalizeErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let active = true;

    const run = async () => {
      setMounted(true);
      await refresh();
      if (!active) return;
    };

    void run();

    return () => {
      active = false;
    };
  }, [refresh]);

  const submitPayment = React.useCallback(async (input: OwnerPaymentLedgerUpsertInput) => {
    setIsSubmittingPayment(true);
    setErrorMessage(null);

    try {
      await upsertOwnerPaymentLedger(input);
      await refresh();
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error));
      throw error;
    } finally {
      setIsSubmittingPayment(false);
    }
  }, [refresh]);

  return {
    mounted,
    isLoading,
    isSubmittingPayment,
    errorMessage,
    summary,
    scheduleItems,
    refresh,
    submitPayment,
  };
}
