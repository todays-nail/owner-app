import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { PublicAuthCenter } from "@/components/auth/public-auth-center";
import { OneulNailLogo } from "@/components/brand/oneulnail-logo";

export default function PrivacyPage() {
  return (
    <PublicAuthCenter>
      <AuthCard>
        <div className="text-center">
          <OneulNailLogo className="mx-auto" />
          <h1 className="mt-7 text-[1.95rem] font-semibold leading-tight text-foreground">
            개인정보 처리방침
          </h1>
          <p className="mt-2 text-base text-muted-foreground">처리방침 상세 문서는 준비 중입니다.</p>
        </div>

        <div className="mt-8 rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
          추후 정식 처리방침이 등록되면 이 페이지에서 확인할 수 있습니다.
        </div>
      </AuthCard>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        <Link className="font-semibold text-primary hover:underline" href="/signup">
          회원가입으로 돌아가기
        </Link>
      </p>
    </PublicAuthCenter>
  );
}
