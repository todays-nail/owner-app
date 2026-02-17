import {ReferencesScreen} from "@/features/references/screens/references-screen";
import {getReferencesForCurrentUser} from "@/features/references/server/get-references-for-current-user";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "디자인 관리",
  description: "네일 아트 디자인 포트폴리오를 관리하고 고객에게 보여줄 레퍼런스를 설정하세요."
});

export const dynamic = "force-dynamic";

export default async function ReferencesPage() {
  const initialReferences = await getReferencesForCurrentUser();

  return <ReferencesScreen initialReferences={initialReferences} />;
}
