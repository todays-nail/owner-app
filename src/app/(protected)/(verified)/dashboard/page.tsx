import {DashboardScreen} from "@/features/dashboard/screens/dashboard-screen";
import {getReferencesForCurrentUser} from "@/features/references/server/get-references-for-current-user";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "대시보드",
  description: "오늘 샵의 현황을 확인해보세요."
});

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const references = await getReferencesForCurrentUser();
  const visibleReferences = references.filter((reference) => reference.isVisible);

  return <DashboardScreen initialReferences={visibleReferences} />;
}
