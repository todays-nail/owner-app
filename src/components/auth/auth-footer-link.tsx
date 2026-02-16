import Link, { type LinkProps } from "next/link";

import { cn } from "@/lib/utils";

export interface AuthFooterLinkProps {
  prefixText: string;
  linkText: string;
  href: LinkProps["href"];
  className?: string;
}

export function AuthFooterLink({
  prefixText,
  linkText,
  href,
  className
}: AuthFooterLinkProps) {
  return (
    <p className={cn("mt-7 text-center text-sm text-muted-foreground", className)}>
      {prefixText ? `${prefixText} ` : null}
      <Link className="font-semibold text-primary hover:underline" href={href}>
        {linkText}
      </Link>
    </p>
  );
}
