"use client";

import { FormEvent, useState } from "react";

const RECRUIT_RECEIVER_EMAIL = "galaxydh4110@gmail.com";
const RECRUIT_SUBJECT = "[오늘 네일] 사장님 모집 신청";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RecruitOwnerEmailForm() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setErrorMessage("올바른 이메일 주소를 입력해 주세요.");
      return;
    }

    setErrorMessage(null);

    const subject = encodeURIComponent(RECRUIT_SUBJECT);
    const body = encodeURIComponent(`신청 이메일: ${normalizedEmail}`);
    window.location.href = `mailto:${RECRUIT_RECEIVER_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="space-y-3" noValidate onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="owner-recruit-email">
        사장님 모집 신청 이메일
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="owner-recruit-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errorMessage) {
              setErrorMessage(null);
            }
          }}
          placeholder="이메일 주소를 입력해 주세요"
          className="h-11 w-full rounded-full border border-border/70 bg-white/70 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/15 dark:bg-background-dark/70 dark:text-white dark:placeholder:text-slate-400"
          autoComplete="email"
          inputMode="email"
          required
        />
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:opacity-90"
        >
          사장님 모집 신청하기
        </button>
      </div>
      {errorMessage ? (
        <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
