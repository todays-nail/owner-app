import {Suspense} from "react";

import {AuthSuspenseFallback} from "@/components/auth/auth-suspense-fallback";
import {createPageMetadata} from "@/lib/metadata";

import {LoginForm} from "./ui";

export const metadata = createPageMetadata({
  title: "사장님 로그인",
  description: "이메일과 비밀번호로 로그인하세요."
});

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <LoginForm />
    </Suspense>
  );
}
