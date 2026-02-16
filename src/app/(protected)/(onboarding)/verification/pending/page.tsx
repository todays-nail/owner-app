import Link from "next/link";
import Image from "next/image";
import {redirect} from "next/navigation";
import {Check, FileSearch, Hourglass, Mail, Sparkles} from "lucide-react";

import {createPageMetadata} from "@/lib/metadata";
import {getOwnerVerificationForCurrentUser} from "@/lib/owner/verification";

export const metadata = createPageMetadata({
  title: "사업자 인증 검토 중",
  description: "제출하신 서류를 확인하고 있습니다."
});

export const dynamic = "force-dynamic";

export default async function OwnerVerificationPendingPage() {
  const res = await getOwnerVerificationForCurrentUser();

  if (!res.ok) {
    if (res.reason === "NOT_AUTHENTICATED") {
      redirect("/login");
    }

    return (
      <div className="rounded-lg border border-border bg-muted p-4 text-sm">
        인증 상태를 불러오지 못했습니다: {res.reason}
        {res.errorMessage ? ` (${res.errorMessage})` : null}
      </div>
    );
  }

  if (res.status === "APPROVED") {
    redirect("/");
  }

  if (res.status !== "PENDING") {
    redirect("/verification/submit");
  }

  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL || "";

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_26px_70px_-35px_hsl(var(--foreground)/0.25)]">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <aside className="relative lg:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-b from-[#fff3ef] via-[#fff7f5] to-[#fff3f1]" />
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative flex h-full flex-col p-8 lg:p-10">
              <h1 className="mt-10 text-3xl font-semibold leading-tight tracking-tight">
                파트너님,
                <br />
                곧 만나요!
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                제출해주신 서류를 꼼꼼히 검토하고 있습니다.
                <br />
                조금만 기다려주시면 승인 결과를 알려드리겠습니다.
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-card/80 shadow-sm">
                    <Hourglass className="h-4 w-4 text-primary" aria-hidden />
                  </span>
                  <span className="font-medium text-foreground/80">서류 검토 진행 중</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-card/80 shadow-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </span>
                  <span className="font-medium text-foreground/80">결과 알림 발송 예정</span>
                </li>
              </ul>

              <div className="mt-auto pt-10">
                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src="/images/onboarding-shop.svg"
                      alt="매장 이미지"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="flex h-full flex-col justify-center px-8 py-12 lg:px-14">
              <div className="mx-auto w-full max-w-xl text-center">
                <div className="relative mx-auto grid h-36 w-36 place-items-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10" />
                  <div className="absolute inset-4 rounded-full bg-primary/5" />
                  <div className="absolute -right-1 top-6 h-3 w-3 rounded-full bg-primary/15" />
                  <div className="absolute left-2 top-10 h-2.5 w-2.5 rounded-full bg-primary/10" />
                  <div className="absolute right-6 bottom-3 h-2 w-2 rounded-full bg-primary/10" />
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-card shadow-sm">
                    <FileSearch className="h-9 w-9 text-primary" aria-hidden />
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  검토 중 (Under Review)
                </div>

                <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                  제출하신 서류를 확인하고 있습니다
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  영업일 기준 1-2일 이내에 검토가 완료됩니다.
                  <br />
                  승인이 완료되면 가입하신 이메일과 알림톡으로 안내해 드립니다.
                  <br />
                  추가 서류가 필요한 경우 별도 연락을 드릴 수 있습니다.
                </p>

                <div className="mt-10 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_20px_-14px_hsl(var(--primary)/0.9)]">
                      <Check className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="text-xs font-semibold text-primary">인증 요청</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-primary bg-card text-primary shadow-sm">
                      <Hourglass className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="text-xs font-semibold">검토 중</div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
                      <Check className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground">승인 완료</div>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  {marketingUrl ? (
                    <a
                      className="inline-flex h-14 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_16px_34px_-18px_hsl(var(--primary)/0.9)] hover:opacity-90"
                      href={marketingUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      홍보용 페이지 둘러보기
                    </a>
                  ) : null}
                  <Link
                    className="inline-flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground"
                    href="/verification/submit"
                  >
                    문의하기
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
