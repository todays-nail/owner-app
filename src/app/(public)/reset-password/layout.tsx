import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "새 비밀번호 설정",
  description: "새 비밀번호를 입력해 주세요."
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
