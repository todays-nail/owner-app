import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "비밀번호 재설정",
  description: "가입한 이메일로 비밀번호 재설정 링크를 보내드릴게요."
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
