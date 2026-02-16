"use client";

/* eslint-disable @next/next/no-img-element */

import * as React from "react";

import { cn } from "@/lib/utils";

type OneulNailLogoSize = "auth" | "sidebar";

const SIZE_CLASS_MAP: Record<
  OneulNailLogoSize,
  {
    icon: string;
    text: string;
    textGap: string;
    textOffsetWithIcon: string;
  }
> = {
  auth: {
    icon: "h-10 w-auto",
    text: "text-[1.75rem]",
    textGap: "gap-1.5",
    textOffsetWithIcon: "ml-2.5"
  },
  sidebar: {
    icon: "h-8 w-auto",
    text: "text-[1.35rem]",
    textGap: "gap-1",
    textOffsetWithIcon: "ml-2"
  }
};

export interface OneulNailLogoProps {
  className?: string;
  size?: OneulNailLogoSize;
}

export function OneulNailLogo({ className, size = "auth" }: OneulNailLogoProps) {
  const [iconError, setIconError] = React.useState(false);
  const sizeClasses = SIZE_CLASS_MAP[size];

  return (
    <span className={cn("inline-flex items-center whitespace-nowrap", className)}>
      {iconError ? null : (
        <img
          src="/images/logo@1x.png"
          srcSet="/images/logo@1x.png 1x, /images/logo@2x.png 2x, /images/logo@3x.png 3x"
          alt="오늘 네일 로고"
          width={96}
          height={140}
          className={cn("shrink-0", sizeClasses.icon)}
          onError={() => setIconError(true)}
        />
      )}

      <span
        className={cn(
          "inline-flex items-center font-semibold leading-none tracking-tight",
          sizeClasses.textGap,
          sizeClasses.text,
          !iconError && sizeClasses.textOffsetWithIcon
        )}
      >
        <span className="text-foreground">오늘</span>
        <span className="text-primary">네일</span>
      </span>
    </span>
  );
}
