import { SettingsPageScreen } from "@/features/settings/screens/settings-page-screen";
import { MOCK_SHOP_SETTINGS } from "@/features/settings/model/mock-settings";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "샵 정보 관리",
  description: "매장의 기본 정보와 운영 정책을 설정합니다."
});

export default function SettingsPage() {
  return <SettingsPageScreen initialData={MOCK_SHOP_SETTINGS} />;
}
