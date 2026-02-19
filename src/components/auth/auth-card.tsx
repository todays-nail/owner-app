import { cn } from "@/lib/utils";

export function AuthCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-border/70 bg-card/95 shadow-[0_18px_45px_rgba(233,89,73,0.14)] backdrop-blur-sm">
      <div className="h-2 w-full bg-gradient-to-r from-primary/45 via-primary/75 to-primary" />
      <div className={cn("p-6 sm:p-8", className)}>{children}</div>
    </section>
  );
}
