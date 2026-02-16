import { cn } from "@/lib/utils";

export function PublicAuthCenter({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh w-full max-w-[540px] flex-col justify-center px-4 py-10",
        className
      )}
    >
      {children}
    </div>
  );
}
