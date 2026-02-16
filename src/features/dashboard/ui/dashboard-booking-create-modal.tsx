"use client";

import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";

import {Button} from "@/components/ui/button";
import {BaseModal} from "@/components/ui/base-modal";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

export interface DashboardBookingCreateFormValues {
  customerName: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  memo: string;
}

interface DashboardBookingCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: DashboardBookingCreateFormValues) => void;
}

type RequiredField = "customerName" | "serviceName" | "bookingDate" | "bookingTime";
type FormErrors = Partial<Record<RequiredField, string>>;

const INITIAL_FORM_VALUES: DashboardBookingCreateFormValues = {
  customerName: "",
  serviceName: "",
  bookingDate: "",
  bookingTime: "",
  memo: ""
};

export function DashboardBookingCreateModal({
  open,
  onClose,
  onSubmit
}: DashboardBookingCreateModalProps) {
  const [formValues, setFormValues] = useState<DashboardBookingCreateFormValues>(
    INITIAL_FORM_VALUES
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormValues(INITIAL_FORM_VALUES);
    setErrors({});
  }, [open]);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = event.target;
    const fieldName = name as keyof DashboardBookingCreateFormValues;

    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value
    }));

    if (fieldName in errors && value.trim().length > 0) {
      setErrors((prevErrors) => {
        const nextErrors = {...prevErrors};
        delete nextErrors[fieldName as RequiredField];
        return nextErrors;
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!formValues.customerName.trim()) {
      nextErrors.customerName = "고객명을 입력해주세요.";
    }
    if (!formValues.serviceName.trim()) {
      nextErrors.serviceName = "시술명을 입력해주세요.";
    }
    if (!formValues.bookingDate) {
      nextErrors.bookingDate = "예약일을 선택해주세요.";
    }
    if (!formValues.bookingTime) {
      nextErrors.bookingTime = "예약 시간을 선택해주세요.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      customerName: formValues.customerName.trim(),
      serviceName: formValues.serviceName.trim(),
      bookingDate: formValues.bookingDate,
      bookingTime: formValues.bookingTime,
      memo: formValues.memo.trim()
    });
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      titleId="booking-create-modal-title"
      descriptionId="booking-create-modal-description"
      rootClassName="z-[60]"
      overlayClassName="bg-black/40 backdrop-blur-[1px]"
      contentClassName="max-w-xl rounded-2xl border border-primary/10 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-background-dark sm:p-6"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3
              id="booking-create-modal-title"
              className="text-xl font-bold text-slate-900 dark:text-white"
            >
              새 예약 등록
            </h3>
            <p
              id="booking-create-modal-description"
              className="mt-1 text-sm text-slate-500 dark:text-slate-300"
            >
              예시 입력 폼입니다. 저장 시 데모 처리 후 모달이 닫힙니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
          >
            <span className="material-icons text-[20px]" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="고객명"
              required
              htmlFor="booking-customer-name"
              error={errors.customerName}
            >
              <Input
                id="booking-customer-name"
                name="customerName"
                value={formValues.customerName}
                onChange={handleFieldChange}
                placeholder="예: 김민지"
                className={cn(
                  "bg-white dark:bg-white/5",
                  errors.customerName && "border-red-400 focus-visible:ring-red-400"
                )}
              />
            </FormField>

            <FormField
              label="시술명"
              required
              htmlFor="booking-service-name"
              error={errors.serviceName}
            >
              <Input
                id="booking-service-name"
                name="serviceName"
                value={formValues.serviceName}
                onChange={handleFieldChange}
                placeholder="예: 그라데이션 젤"
                className={cn(
                  "bg-white dark:bg-white/5",
                  errors.serviceName && "border-red-400 focus-visible:ring-red-400"
                )}
              />
            </FormField>

            <FormField
              label="예약일"
              required
              htmlFor="booking-date"
              error={errors.bookingDate}
            >
              <Input
                id="booking-date"
                name="bookingDate"
                type="date"
                value={formValues.bookingDate}
                onChange={handleFieldChange}
                className={cn(
                  "bg-white dark:bg-white/5",
                  errors.bookingDate && "border-red-400 focus-visible:ring-red-400"
                )}
              />
            </FormField>

            <FormField
              label="예약 시간"
              required
              htmlFor="booking-time"
              error={errors.bookingTime}
            >
              <Input
                id="booking-time"
                name="bookingTime"
                type="time"
                value={formValues.bookingTime}
                onChange={handleFieldChange}
                className={cn(
                  "bg-white dark:bg-white/5",
                  errors.bookingTime && "border-red-400 focus-visible:ring-red-400"
                )}
              />
            </FormField>
          </div>

          <FormField label="메모" htmlFor="booking-memo">
            <textarea
              id="booking-memo"
              name="memo"
              value={formValues.memo}
              onChange={handleFieldChange}
              placeholder="요청 사항이나 참고 메모를 입력하세요."
              rows={4}
              className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-white/5"
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children
}: FormFieldProps) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
        {required ? (
          <span className="ml-1 text-primary" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-red-500">{error}</span>
      ) : null}
    </label>
  );
}
