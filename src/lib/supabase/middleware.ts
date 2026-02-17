import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ENTRY_PATHS = new Set(["/login", "/signup", "/signup/check-email"]);

const PUBLIC_PATHS = new Set(["/", "/owner", "/user", "/terms", "/privacy"]);

function isPublicPath(pathname: string) {
  if (AUTH_ENTRY_PATHS.has(pathname)) return true;
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname === "/forgot-password") return true;
  if (pathname === "/reset-password") return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/auth")) return true;
  return false;
}

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env is missing, skip auth enforcement so builds can succeed.
  if (!url || !anonKey) {
    return NextResponse.next({
      request
    });
  }

  const response = NextResponse.next({
    request
  });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const publicPath = isPublicPath(pathname);

  if (!user && !publicPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    const nextPath = request.nextUrl.pathname + request.nextUrl.search;
    redirectUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && AUTH_ENTRY_PATHS.has(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
