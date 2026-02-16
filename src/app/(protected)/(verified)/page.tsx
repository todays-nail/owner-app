import {DashboardScreen} from "@/features/dashboard/screens/dashboard-screen";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "대시보드",
  description: "오늘 샵의 현황을 확인해보세요."
});

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <DashboardScreen />;
}
