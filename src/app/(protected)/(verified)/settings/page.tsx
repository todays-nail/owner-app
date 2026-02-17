import { SettingsPageScreen } from "@/features/settings/screens/settings-page-screen";
import { MOCK_SHOP_SETTINGS } from "@/features/settings/model/mock-settings";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "설정",
  description: "샵 정보와 계정 설정을 관리합니다."
});

export default function SettingsPage() {
  return <SettingsPageScreen initialData={MOCK_SHOP_SETTINGS} />;
}
