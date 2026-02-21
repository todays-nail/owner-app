import { createPageMetadata } from "@/lib/metadata";
import { LegalDocumentLayout } from "@/app/(public)/_components/legal-document-layout";
import {
  LEGAL_LAST_UPDATED_DATE,
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_SECTIONS,
  PRIVACY_SUMMARY
} from "@/app/(public)/_lib/legal-content";

export const metadata = createPageMetadata({
  title: "개인정보 처리방침",
  description: "오늘네일 개인정보처리방침"
});

export default function PrivacyPage() {
  return (
    <LegalDocumentLayout
      title="개인정보처리방침"
      summary={PRIVACY_SUMMARY}
      effectiveDate={PRIVACY_EFFECTIVE_DATE}
      lastUpdatedDate={LEGAL_LAST_UPDATED_DATE}
      sections={PRIVACY_SECTIONS}
      alternateHref="/terms"
      alternateLabel="이용약관 보기"
    />
  );
}
