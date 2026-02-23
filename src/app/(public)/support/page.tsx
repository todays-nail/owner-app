import Link from "next/link";

import { createPageMetadata } from "@/lib/metadata";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_OPERATOR_NAME,
  LEGAL_SUPPORT_RESPONSE_TIME
} from "@/app/(public)/_lib/legal-content";

export const metadata = createPageMetadata({
  title: "고객지원",
  description: "오늘네일 고객지원 및 문의 안내"
});

const supportMailtoHref = `mailto:${LEGAL_CONTACT_EMAIL}?subject=${encodeURIComponent("[오늘 네일] 고객지원 문의")}&body=${encodeURIComponent("아래 정보를 함께 보내주시면 더 빠르게 도와드릴 수 있어요.\\n\\n- 앱 버전:\\n- 기기/OS:\\n- 문제 발생 시점:\\n- 문제 내용:\\n- 재현 방법:")}`;

export default function SupportPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="border-b border-border/70 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Today&apos;s Nail Support
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          고객지원
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          서비스 이용 중 문의, 오류 신고, 개인정보 관련 요청은 아래 채널로 접수해 주세요.
        </p>
      </header>

      <section className="mt-8 rounded-2xl border border-border/70 bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">문의 접수 채널</h2>
        <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="min-w-24 font-medium text-foreground">운영 주체</dt>
            <dd>{LEGAL_OPERATOR_NAME}</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="min-w-24 font-medium text-foreground">문의 이메일</dt>
            <dd>
              <a className="underline underline-offset-4" href={supportMailtoHref}>
                {LEGAL_CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
            <dt className="min-w-24 font-medium text-foreground">응답 기준</dt>
            <dd>{LEGAL_SUPPORT_RESPONSE_TIME}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-border/70 bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">빠른 처리를 위한 안내</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground sm:text-base">
          <li>사용 중인 앱 버전, 기기 모델, iOS 버전을 함께 알려주세요.</li>
          <li>문제 화면 캡처와 재현 단계를 포함해 주시면 확인 속도가 빨라집니다.</li>
          <li>개인정보 관련 요청(열람/정정/삭제/처리정지)은 제목에 &quot;개인정보 요청&quot;을 명시해 주세요.</li>
        </ul>
      </section>

      <footer className="mt-8 flex flex-wrap gap-4 border-t border-border/70 pt-6 text-sm">
        <Link className="font-medium underline underline-offset-4" href="/privacy">
          개인정보처리방침
        </Link>
        <Link className="font-medium underline underline-offset-4" href="/terms">
          이용약관
        </Link>
      </footer>
    </main>
  );
}
