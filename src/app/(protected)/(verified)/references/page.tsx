import {ReferencesScreen} from "@/features/references/screens/references-screen";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "디자인 라이브러리",
  description: "네일 아트 디자인 포트폴리오를 관리하고 고객에게 보여줄 레퍼런스를 설정하세요."
});

export const dynamic = "force-dynamic";

export default function ReferencesPage() {
  return <ReferencesScreen />;
}
