"use client";

import { type FormEvent, useEffect, useState } from "react";

import type { AccountSettingsDto } from "@/features/settings/model/types";
import {
  updateAccountSettingsForCurrentUser,
  updateCurrentUserPassword
} from "@/features/settings/services/update-account-settings-browser-service";
import { SettingsSectionTabs } from "@/features/settings/ui/settings-section-tabs";
import { cn } from "@/lib/utils";

type AccountSettingsFormState = {
  name: string;
  nickname: string;
  email: string;
  profileImageUrl: string | null;
  notifySystemNotice: boolean;
  notifySecurityNotice: boolean;
  notifyMarketing: boolean;
};

function buildNewFormState(initialData: AccountSettingsDto): AccountSettingsFormState {
  return {
    name: initialData.name,
    nickname: initialData.nickname,
    email: initialData.email,
    profileImageUrl: initialData.profileImageUrl,
    notifySystemNotice: initialData.notifySystemNotice,
    notifySecurityNotice: initialData.notifySecurityNotice,
    notifyMarketing: initialData.notifyMarketing
  };
}

function normalizeErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}

function ToggleSwitch({
  checked,
  onChange,
  ariaLabel
}: {
  checked: boolean;
  onChange: (nextValue: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left]",
          checked ? "left-[20px]" : "left-0.5"
        )}
      />
    </button>
  );
}

function ReadonlyInput({ value }: { value: string }) {
  return (
    <div className="relative">
      <input
        type="email"
        value={value}
        readOnly
        disabled
        className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:border-stone-700 dark:bg-stone-800/80 dark:text-gray-400"
      />
      <span className="material-icons-round pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
        lock
      </span>
    </div>
  );
}

export function AccountSettingsPageClient({ initialData }: { initialData: AccountSettingsDto }) {
  const [form, setForm] = useState<AccountSettingsFormState>(() => buildNewFormState(initialData));

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setForm(buildNewFormState(initialData));
  }, [initialData]);

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

  const handleStringChange = (
    key: "name" | "nickname",
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleChange = (
    key: "notifySystemNotice" | "notifySecurityNotice" | "notifyMarketing",
    value: boolean
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleProfilePhotoClick = () => {
    setToastMessage("프로필 사진 변경 기능은 준비 중입니다.");
  };

  const closePasswordForm = () => {
    setShowPasswordForm(false);
    setPasswordErrorMessage(null);
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  const handleSave = async () => {
    setPageErrorMessage(null);
    setToastMessage(null);

    if (form.name.trim().length === 0) {
      setPageErrorMessage("이름을 입력해 주세요.");
      return;
    }

    if (form.nickname.trim().length === 0) {
      setPageErrorMessage("닉네임을 입력해 주세요.");
      return;
    }

    setIsSaving(true);

    try {
      const nextName = form.name.trim();
      const nextNickname = form.nickname.trim();

      await updateAccountSettingsForCurrentUser({
        name: nextName,
        nickname: nextNickname,
        notifySystemNotice: form.notifySystemNotice,
        notifySecurityNotice: form.notifySecurityNotice,
        notifyMarketing: form.notifyMarketing
      });

      setForm((prev) => ({
        ...prev,
        name: nextName,
        nickname: nextNickname
      }));
      setToastMessage("계정 정보를 저장했습니다.");
    } catch (error) {
      setPageErrorMessage(normalizeErrorMessage(error, "계정 정보를 저장하지 못했습니다."));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordErrorMessage(null);
    setToastMessage(null);

    if (currentPassword.trim().length === 0) {
      setPasswordErrorMessage("현재 비밀번호를 입력해 주세요.");
      return;
    }

    if (newPassword.trim().length < 8) {
      setPasswordErrorMessage("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordErrorMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsChangingPassword(true);

    try {
      await updateCurrentUserPassword(newPassword);
      closePasswordForm();
      setToastMessage("비밀번호가 변경되었습니다.");
    } catch (error) {
      setPasswordErrorMessage(
        normalizeErrorMessage(error, "비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.")
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">
      <header className="mb-8 space-y-6 md:mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">설정</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            계정 정보와 보안 알림을 관리하세요.
          </p>
        </div>

        <SettingsSectionTabs />
      </header>

      {pageErrorMessage ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          {pageErrorMessage}
        </div>
      ) : null}

      <div className="space-y-8">
        <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark md:p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="group relative">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md dark:border-stone-700">
                {form.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.profileImageUrl}
                    alt="프로필 사진"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-300">
                    <span className="material-icons-round text-4xl" aria-hidden="true">
                      person
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleProfilePhotoClick}
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary-hover"
                aria-label="프로필 사진 변경 (준비중)"
              >
                <span className="material-icons-round text-lg" aria-hidden="true">
                  photo_camera
                </span>
              </button>
            </div>
            <p className="mt-3 text-sm font-medium text-stone-500">프로필 사진 변경</p>
          </div>

          <div className="mx-auto max-w-2xl space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="account-name" className="ml-1 text-sm font-bold text-stone-700 dark:text-stone-300">
                이름
              </label>
              <input
                id="account-name"
                type="text"
                value={form.name}
                onChange={(event) => handleStringChange("name", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3.5 text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="account-nickname"
                className="ml-1 text-sm font-bold text-stone-700 dark:text-stone-300"
              >
                닉네임
              </label>
              <input
                id="account-nickname"
                type="text"
                value={form.nickname}
                onChange={(event) => handleStringChange("nickname", event.target.value)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3.5 text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800/50 dark:text-stone-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-sm font-bold text-stone-700 dark:text-stone-300">이메일 (아이디)</label>
              <ReadonlyInput value={form.email} />
            </div>

            {!showPasswordForm ? (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordErrorMessage(null);
                    setShowPasswordForm(true);
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-100 px-6 py-4 font-bold text-stone-700 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                >
                  <span className="material-icons-round text-xl" aria-hidden="true">
                    lock_reset
                  </span>
                  비밀번호 변경
                </button>
              </div>
            ) : (
              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-5 rounded-2xl border border-stone-100 bg-stone-50/70 p-6 dark:border-stone-800/50 dark:bg-stone-800/20"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="current-password"
                    className="ml-1 text-sm font-bold text-stone-700 dark:text-stone-300"
                  >
                    현재 비밀번호
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="현재 비밀번호를 입력하세요"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="new-password" className="ml-1 text-sm font-bold text-stone-700 dark:text-stone-300">
                    새 비밀번호
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="새 비밀번호를 입력하세요"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="new-password-confirm"
                    className="ml-1 text-sm font-bold text-stone-700 dark:text-stone-300"
                  >
                    새 비밀번호 확인
                  </label>
                  <input
                    id="new-password-confirm"
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(event) => setNewPasswordConfirm(event.target.value)}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-stone-800 transition-all placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                  />
                </div>

                {passwordErrorMessage ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                    {passwordErrorMessage}
                  </div>
                ) : null}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closePasswordForm}
                    className="flex-1 rounded-xl border border-stone-300 px-6 py-3.5 font-bold text-stone-600 transition-colors hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 rounded-xl bg-primary px-6 py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isChangingPassword ? "변경 중..." : "변경하기"}
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="material-icons-round text-xl" aria-hidden="true">
                  check
                </span>
                {isSaving ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-surface-dark md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <span className="material-icons-round" aria-hidden="true">
                notifications_active
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 dark:text-white">계정 및 보안 알림</h2>
              <p className="text-sm text-stone-500">계정 활동에 대한 중요한 알림 방식을 설정합니다.</p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 p-5 dark:border-stone-800/50 dark:bg-stone-800/30">
              <div>
                <span className="block font-bold text-stone-800 dark:text-stone-200">시스템 공지 알림</span>
                <span className="text-sm text-stone-500">서비스 점검 및 중요한 업데이트 소식을 받습니다.</span>
              </div>
              <ToggleSwitch
                checked={form.notifySystemNotice}
                onChange={(nextValue) => handleToggleChange("notifySystemNotice", nextValue)}
                ariaLabel="시스템 공지 알림"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 p-5 dark:border-stone-800/50 dark:bg-stone-800/30">
              <div>
                <span className="block font-bold text-stone-800 dark:text-stone-200">계정 보안 알림</span>
                <span className="text-sm text-stone-500">새 로그인 및 비밀번호 변경 시 알림을 받습니다.</span>
              </div>
              <ToggleSwitch
                checked={form.notifySecurityNotice}
                onChange={(nextValue) => handleToggleChange("notifySecurityNotice", nextValue)}
                ariaLabel="계정 보안 알림"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 p-5 dark:border-stone-800/50 dark:bg-stone-800/30">
              <div>
                <span className="block font-bold text-stone-800 dark:text-stone-200">마케팅 정보 수신</span>
                <span className="text-sm text-stone-500">이벤트 및 프로모션 혜택 정보를 받습니다.</span>
              </div>
              <ToggleSwitch
                checked={form.notifyMarketing}
                onChange={(nextValue) => handleToggleChange("notifyMarketing", nextValue)}
                ariaLabel="마케팅 정보 수신"
              />
            </div>
          </div>
        </section>

        <div className="text-center pt-2">
          <button
            type="button"
            className="text-sm font-medium text-stone-400 underline underline-offset-4 transition-colors hover:text-red-500"
          >
            서비스 탈퇴하기
          </button>
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
