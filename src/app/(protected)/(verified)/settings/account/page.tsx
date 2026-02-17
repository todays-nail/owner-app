import { MOCK_ACCOUNT_SETTINGS } from "@/features/settings/model/mock-account-settings";
import { AccountSettingsPageScreen } from "@/features/settings/screens/account-settings-page-screen";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "계정 정보",
  description: "이름, 닉네임, 비밀번호, 알림 등 계정 정보를 관리합니다."
});

export default function AccountSettingsPage() {
  return <AccountSettingsPageScreen initialData={MOCK_ACCOUNT_SETTINGS} />;
}
