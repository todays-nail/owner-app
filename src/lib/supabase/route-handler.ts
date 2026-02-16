import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type NextCookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];
type CookieToSet = { name: string; value: string; options: NextCookieOptions };

export function createSupabaseRouteHandlerClient(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  const cookiesToSet: CookieToSet[] = [];

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookies) {
        cookiesToSet.push(...(cookies as CookieToSet[]));
      }
    }
  });

  function applyCookies(response: NextResponse) {
    for (const c of cookiesToSet) {
      response.cookies.set(c.name, c.value, c.options);
    }
    return response;
  }

  return { supabase, applyCookies };
}
