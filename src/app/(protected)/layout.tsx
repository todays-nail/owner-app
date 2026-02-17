import {redirect} from "next/navigation";
import type {User} from "@supabase/supabase-js";

import {
  type ProtectedUserProfile,
  ProtectedUserProfileProvider
} from "@/components/auth/protected-user-profile-context";
import {AppToastProvider} from "@/components/ui/app-toast-provider";
import {createPageMetadata} from "@/lib/metadata";
import {createSupabaseServerClient} from "@/lib/supabase/server";

export const metadata = createPageMetadata({
  title: "사장님 관리자"
});

export const dynamic = "force-dynamic";

function readString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function mapRoleLabel(rawRole: string | null) {
  if (!rawRole) {
    return "원장";
  }

  const normalized = rawRole.toLowerCase();

  if (normalized === "owner") {
    return "원장";
  }
  if (normalized === "manager") {
    return "매니저";
  }
  if (normalized === "staff") {
    return "스태프";
  }

  return /[가-힣]/.test(rawRole) ? rawRole : "원장";
}

function buildProtectedUserProfile(user: User | null): ProtectedUserProfile {
  if (!user) {
    return {
      displayName: "사장님",
      roleLabel: "원장"
    };
  }

  const userMetadata = user.user_metadata ?? {};
  const appMetadata = user.app_metadata ?? {};

  const displayName =
    readString(userMetadata.contact_name) ??
    readString(userMetadata.full_name) ??
    readString(userMetadata.name) ??
    (user.email ? user.email.split("@")[0] : null) ??
    "사장님";

  const roleSource =
    readString(userMetadata.role_label) ??
    readString(userMetadata.role) ??
    readString(appMetadata.role);

  return {
    displayName,
    roleLabel: mapRoleLabel(roleSource)
  };
}

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  // If env is missing, keep the app reachable for build/dev scaffolding.
  if (!supabase) {
    return (
      <ProtectedUserProfileProvider profile={buildProtectedUserProfile(null)}>
        <AppToastProvider>{children}</AppToastProvider>
      </ProtectedUserProfileProvider>
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ProtectedUserProfileProvider profile={buildProtectedUserProfile(user)}>
      <AppToastProvider>{children}</AppToastProvider>
    </ProtectedUserProfileProvider>
  );
}
