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
        "h-12 w-full rounded-full bg-gradient-to-r from-primary/80 to-primary text-base font-semibold text-white shadow-lg shadow-primary/35 hover:opacity-100 hover:brightness-105",
        className
      )}
      {...props}
    />
  );
}
