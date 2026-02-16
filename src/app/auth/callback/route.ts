import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase/route-handler";

function safeNextPath(value: string | null) {
  if (!value) return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  const redirectUrl = new URL(next, url);

  if (!code) {
    return NextResponse.redirect(redirectUrl);
  }

  const client = createSupabaseRouteHandlerClient(request);
  if (!client) {
    return NextResponse.redirect(redirectUrl);
  }

  const { supabase, applyCookies } = client;

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const fallback = new URL("/login", url);
    fallback.searchParams.set("error", "auth_callback_failed");
    return NextResponse.redirect(fallback);
  }

  return applyCookies(NextResponse.redirect(redirectUrl));
}

