import {AuthCard} from "@/components/auth/auth-card";
import {AuthFooterLink} from "@/components/auth/auth-footer-link";
import {AuthNoticeBox} from "@/components/auth/auth-notice-box";
import {AuthPageHeader} from "@/components/auth/auth-page-header";
import {PublicAuthCenter} from "@/components/auth/public-auth-center";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "이용약관",
  description: "약관 상세 문서는 준비 중입니다."
});

export default function TermsPage() {
  return (
    <PublicAuthCenter>
      <AuthCard>
        <AuthPageHeader title="이용약관" description="약관 상세 문서는 준비 중입니다." />

        <AuthNoticeBox className="mt-8 text-muted-foreground">
          추후 정식 약관이 등록되면 이 페이지에서 확인할 수 있습니다.
        </AuthNoticeBox>
      </AuthCard>

      <AuthFooterLink prefixText="" linkText="회원가입으로 돌아가기" href="/signup" />
    </PublicAuthCenter>
  );
}
