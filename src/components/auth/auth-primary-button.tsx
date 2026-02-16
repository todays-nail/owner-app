import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AuthPrimaryButtonProps = ButtonProps;

export function AuthPrimaryButton({
  className,
  ...props
}: AuthPrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "h-12 w-full rounded-full bg-gradient-to-r from-[#f26f59] to-[#ea5a47] text-base font-semibold text-white shadow-[0_10px_24px_rgba(233,89,73,0.35)] hover:opacity-100 hover:brightness-105",
        className
      )}
      {...props}
    />
  );
}
