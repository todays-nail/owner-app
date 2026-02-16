export function getOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      return new URL(siteUrl).origin;
    } catch {
      // ignore malformed site url
    }
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return undefined;
}

export function getSignupEmailRedirectTo() {
  const origin = getOrigin();
  return origin ? `${origin}/auth/callback?next=/verification/submit` : undefined;
}
