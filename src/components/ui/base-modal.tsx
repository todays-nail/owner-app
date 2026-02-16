"use client";

import {type ReactNode, useEffect, useState} from "react";
import {createPortal} from "react-dom";

import {cn} from "@/lib/utils";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  titleId?: string;
  descriptionId?: string;
  ariaLabel?: string;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  portal?: boolean;
  rootClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}

export function BaseModal({
  open,
  onClose,
  titleId,
  descriptionId,
  ariaLabel,
  closeOnEscape = true,
  closeOnBackdrop = true,
  portal = true,
  rootClassName,
  overlayClassName,
  contentClassName,
  children
}: BaseModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEscape, onClose, open]);

  if (!open) {
    return null;
  }

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-label={ariaLabel}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
        rootClassName
      )}
    >
      <button
        type="button"
        aria-label="모달 닫기"
        onClick={closeOnBackdrop ? onClose : undefined}
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm",
          !closeOnBackdrop && "cursor-default",
          overlayClassName
        )}
      />
      <div className={cn("relative w-full", contentClassName)}>{children}</div>
    </div>
  );

  if (!portal) {
    return modalContent;
  }

  if (!isMounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
}
