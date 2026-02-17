import { SettingsPageScreen } from "@/features/settings/screens/settings-page-screen";
import { getShopSettingsForCurrentUser } from "@/features/settings/server/get-shop-settings-for-current-user";
import { createPageMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata({
  title: "설정",
  description: "샵 정보와 계정 설정을 관리합니다."
});

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const result = await getShopSettingsForCurrentUser();

  if (!result.ok) {
    if (result.reason === "NOT_AUTHENTICATED") {
      redirect("/login");
    }

    return (
      <div className="rounded-lg border border-border bg-muted p-4 text-sm">
        설정 정보를 불러오지 못했습니다: {result.reason}
        {result.errorMessage ? ` (${result.errorMessage})` : null}
      </div>
    );
  }

  return <SettingsPageScreen initialData={result.data} />;
}
