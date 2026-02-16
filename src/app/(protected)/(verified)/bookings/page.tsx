import {BookingsPageScreen} from "@/features/bookings/screens/bookings-page-screen";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "예약 관리",
  description: "예약 현황과 파이프라인을 관리하세요."
});

export const dynamic = "force-dynamic";

export default function BookingsPage() {
  return <BookingsPageScreen />;
}
