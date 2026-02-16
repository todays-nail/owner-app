"use client";

import {type ReactNode, useId} from "react";

import {BaseModal} from "@/components/ui/base-modal";
import {cn} from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
  maxWidthClassName?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  destructive = false,
  maxWidthClassName = "max-w-md"
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      titleId={titleId}
      descriptionId={descriptionId}
      rootClassName="z-50 p-4 sm:p-4"
      overlayClassName="bg-black/40 backdrop-blur-[1px]"
      contentClassName={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-surface-dark",
        maxWidthClassName
      )}
    >
      <h2 id={titleId} className="text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p id={descriptionId} className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors",
            destructive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </BaseModal>
  );
}
