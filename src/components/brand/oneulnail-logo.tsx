import Image from "next/image";

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
  const sizeClasses = SIZE_CLASS_MAP[size];

  return (
    <span className={cn("inline-flex items-center whitespace-nowrap", className)}>
      <Image
        src="/brand/oneulnail.svg"
        alt="오늘 네일 로고"
        width={48}
        height={48}
        className={cn("shrink-0", sizeClasses.icon)}
        priority={size === "auth"}
      />

      <span
        className={cn(
          "inline-flex items-center font-semibold leading-none tracking-tight",
          sizeClasses.textGap,
          sizeClasses.text,
          sizeClasses.textOffsetWithIcon
        )}
      >
        <span className="text-foreground">오늘</span>
        <span className="text-primary">네일</span>
      </span>
    </span>
  );
}
