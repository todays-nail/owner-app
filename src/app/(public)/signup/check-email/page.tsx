import {Suspense} from "react";

import {AuthSuspenseFallback} from "@/components/auth/auth-suspense-fallback";
import {createPageMetadata} from "@/lib/metadata";

import {SignupCheckEmail} from "./ui";

export const metadata = createPageMetadata({
  title: "이메일을 확인해 주세요",
  description: "인증 메일을 보냈습니다. 메일 인증 후 사업자 인증을 진행할 수 있어요."
});

export const dynamic = "force-dynamic";

export default function SignupCheckEmailPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <SignupCheckEmail />
    </Suspense>
  );
}
