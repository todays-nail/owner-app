"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export function OneulNailLogo({ className }: { className?: string }) {
  const [fallback, setFallback] = React.useState(false);

  if (fallback) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <span aria-hidden className="text-primary">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.6c1.2 2 1.8 3.9 1.8 5.5 0 2.5-1.3 4.2-3.8 5.2A7 7 0 0 1 8.6 8c0-1.7 1.1-3.5 3.4-5.4ZM18.3 7.8c2.2 1.2 3.3 2.8 3.3 4.8 0 3.7-3.6 7-9.6 9.8C6 19.6 2.4 16.3 2.4 12.6c0-2 1.1-3.6 3.3-4.8a9.2 9.2 0 0 0-.5 3c0 2 1.3 3.8 3.8 5.3 2.5-1.5 3.8-3.3 3.8-5.3 0-1-.2-2-.5-3Z" />
          </svg>
        </span>
        <span className="text-[2rem] font-semibold leading-none tracking-tight text-foreground">
          ONEUL
        </span>
        <span className="text-[2rem] font-medium leading-none tracking-tight text-primary">nail</span>
      </div>
    );
  }

  return (
    <Image
      priority
      alt="ONEUL nail"
      className={cn("h-10 w-auto dark:invert dark:hue-rotate-180 dark:brightness-125", className)}
      height={40}
      src="/brand/oneulnail.svg"
      width={220}
      onError={() => setFallback(true)}
    />
  );
}
