import type {Metadata} from "next";

export const OWNER_APP_SITE_NAME = "오늘 네일 사장님";
export const OWNER_APP_DEFAULT_DESCRIPTION = "오늘 네일 사장님 서비스 관리 화면입니다.";

interface CreatePageMetadataParams {
  title: NonNullable<Metadata["title"]>;
  description?: string;
  noIndex?: boolean;
}

export function resolveMetadataBase(): URL | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) {
    return undefined;
  }

  try {
    return new URL(siteUrl);
  } catch {
    return undefined;
  }
}

export function createPageMetadata({
  title,
  description = OWNER_APP_DEFAULT_DESCRIPTION,
  noIndex = true
}: CreatePageMetadataParams): Metadata {
  const metadata: Metadata = {
    title,
    description
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false
    };
  }

  return metadata;
}
