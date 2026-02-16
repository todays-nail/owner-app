import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "사장님 계정 만들기",
  description: "전문적인 네일샵 관리를 위한 첫 걸음"
});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
