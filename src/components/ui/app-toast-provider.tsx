"use client";

import * as React from "react";
import {createPortal} from "react-dom";

import {cn} from "@/lib/utils";

export type AppToastVariant = "success" | "error" | "info";

export interface ShowAppToastInput {
  message: string;
  variant?: AppToastVariant;
  durationMs?: number;
}

export interface AppToastContextValue {
  showToast: (input: ShowAppToastInput | string) => void;
  clearToast: () => void;
}

interface AppToastState {
  id: number;
  message: string;
  variant: AppToastVariant;
  durationMs: number;
  isExiting: boolean;
}

interface AppToastProviderProps {
  children: React.ReactNode;
}

const APP_TOAST_DURATION_MS = 2600;
const APP_TOAST_EXIT_MS = 140;

const AppToastContext = React.createContext<AppToastContextValue | null>(null);

const VARIANT_STYLE_MAP: Record<
  AppToastVariant,
  { icon: string; iconClassName: string }
> = {
  success: {
    icon: "check_circle",
    iconClassName: "bg-primary/15 text-primary dark:bg-primary/25 dark:text-[#ffaea6]"
  },
  error: {
    icon: "error",
    iconClassName: "bg-red-100 text-red-600 dark:bg-red-500/25 dark:text-red-200"
  },
  info: {
    icon: "info",
    iconClassName: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-200"
  }
};

function normalizeToastInput(input: ShowAppToastInput | string): ShowAppToastInput {
  if (typeof input === "string") {
    return {
      message: input,
      variant: "success",
      durationMs: APP_TOAST_DURATION_MS
    };
  }

  const durationMs =
    typeof input.durationMs === "number" && Number.isFinite(input.durationMs) && input.durationMs > 0
      ? input.durationMs
      : APP_TOAST_DURATION_MS;

  return {
    message: input.message,
    variant: input.variant ?? "success",
    durationMs
  };
}

export function AppToastProvider({children}: AppToastProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const [toast, setToast] = React.useState<AppToastState | null>(null);

  const closeStartTimerRef = React.useRef<number | null>(null);
  const closeEndTimerRef = React.useRef<number | null>(null);
  const nextIdRef = React.useRef(0);

  const clearTimers = React.useCallback(() => {
    if (closeStartTimerRef.current !== null) {
      window.clearTimeout(closeStartTimerRef.current);
      closeStartTimerRef.current = null;
    }

    if (closeEndTimerRef.current !== null) {
      window.clearTimeout(closeEndTimerRef.current);
      closeEndTimerRef.current = null;
    }
  }, []);

  const clearToast = React.useCallback(() => {
    clearTimers();
    setToast(null);
  }, [clearTimers]);

  const showToast = React.useCallback(
    (input: ShowAppToastInput | string) => {
      const normalized = normalizeToastInput(input);
      const id = nextIdRef.current + 1;
      nextIdRef.current = id;

      clearTimers();

      setToast({
        id,
        message: normalized.message,
        variant: normalized.variant ?? "success",
        durationMs: normalized.durationMs ?? APP_TOAST_DURATION_MS,
        isExiting: false
      });

      const startExitAfterMs = Math.max(
        (normalized.durationMs ?? APP_TOAST_DURATION_MS) - APP_TOAST_EXIT_MS,
        80
      );

      closeStartTimerRef.current = window.setTimeout(() => {
        setToast((prevToast) =>
          prevToast && prevToast.id === id
            ? { ...prevToast, isExiting: true }
            : prevToast
        );
      }, startExitAfterMs);

      closeEndTimerRef.current = window.setTimeout(() => {
        setToast((prevToast) => (prevToast && prevToast.id === id ? null : prevToast));
      }, normalized.durationMs ?? APP_TOAST_DURATION_MS);
    },
    [clearTimers]
  );

  React.useEffect(() => {
    setIsMounted(true);

    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const contextValue = React.useMemo<AppToastContextValue>(
    () => ({
      showToast,
      clearToast
    }),
    [clearToast, showToast]
  );

  const variantStyle = toast ? VARIANT_STYLE_MAP[toast.variant] : null;

  return (
    <AppToastContext.Provider value={contextValue}>
      {children}
      {isMounted && toast
        ? createPortal(
          <div className="pointer-events-none fixed right-4 top-4 z-[110] sm:right-6 sm:top-6">
            <div
              role="status"
              aria-live="polite"
              className={cn(
                "inline-flex max-w-[min(92vw,440px)] items-center gap-3 rounded-2xl border border-primary/20 bg-[#fff7f5] px-4 py-3 text-slate-800 shadow-[0_18px_32px_-18px_rgba(131,55,45,0.55)] dark:border-white/10 dark:bg-[#332524] dark:text-slate-100 dark:shadow-[0_20px_36px_-20px_rgba(0,0,0,0.75)]",
                toast.isExiting ? "app-toast-exit" : "app-toast-enter"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  variantStyle?.iconClassName
                )}
                aria-hidden="true"
              >
                <span className="material-icons text-[18px] leading-none">{variantStyle?.icon}</span>
              </span>

              <span className="min-w-0 break-words text-sm font-semibold leading-5">{toast.message}</span>
            </div>
          </div>,
          document.body
        )
        : null}
    </AppToastContext.Provider>
  );
}

export function useAppToast() {
  const context = React.useContext(AppToastContext);

  if (!context) {
    throw new Error("useAppToast must be used within AppToastProvider.");
  }

  return context;
}
