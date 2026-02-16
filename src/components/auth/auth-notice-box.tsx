import { cn } from "@/lib/utils";

export interface AuthNoticeBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthNoticeBox({ children, className }: AuthNoticeBoxProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-muted/70 px-4 py-3 text-sm text-foreground/90",
        className
      )}
    >
      {children}
    </div>
  );
}
