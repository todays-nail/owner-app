import { createPageMetadata } from "@/lib/metadata";
import { LegalDocumentLayout } from "@/app/(public)/_components/legal-document-layout";
import {
  LEGAL_LAST_UPDATED_DATE,
  TERMS_EFFECTIVE_DATE,
  TERMS_SECTIONS,
  TERMS_SUMMARY
} from "@/app/(public)/_lib/legal-content";

export const metadata = createPageMetadata({
  title: "이용약관",
  description: "오늘네일 서비스 이용약관"
});

export default function TermsPage() {
  return (
    <LegalDocumentLayout
      title="이용약관"
      summary={TERMS_SUMMARY}
      effectiveDate={TERMS_EFFECTIVE_DATE}
      lastUpdatedDate={LEGAL_LAST_UPDATED_DATE}
      sections={TERMS_SECTIONS}
      alternateHref="/privacy"
      alternateLabel="개인정보처리방침 보기"
    />
  );
}
