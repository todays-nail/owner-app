import { AccountSettingsPageScreen } from "@/features/settings/screens/account-settings-page-screen";
import { getAccountSettingsForCurrentUser } from "@/features/settings/server/get-account-settings-for-current-user";
import { createPageMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata({
  title: "계정 정보",
  description: "이름, 닉네임, 비밀번호, 알림 등 계정 정보를 관리합니다."
});

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const result = await getAccountSettingsForCurrentUser();

  if (!result.ok) {
    if (result.reason === "NOT_AUTHENTICATED") {
      redirect("/login");
    }

    return (
      <div className="rounded-lg border border-border bg-muted p-4 text-sm">
        계정 설정 정보를 불러오지 못했습니다: {result.reason}
        {result.errorMessage ? ` (${result.errorMessage})` : null}
      </div>
    );
  }

  return <AccountSettingsPageScreen initialData={result.data} />;
}
