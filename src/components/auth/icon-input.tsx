import type { LucideIcon } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IconInputProps = InputProps & {
  id: string;
  label: string;
  icon: LucideIcon;
  wrapperClassName?: string;
  inputClassName?: string;
  helperText?: string;
};

export function IconInput({
  id,
  label,
  icon: Icon,
  wrapperClassName,
  inputClassName,
  helperText,
  className,
  ...props
}: IconInputProps) {
  return (
    <div className={cn("space-y-2", wrapperClassName)}>
      <label className="text-base font-medium text-foreground/90" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className={cn(
            "h-12 rounded-full border-border/60 bg-muted/60 pl-11 pr-4 text-base",
            "placeholder:text-muted-foreground/90 focus-visible:ring-primary/60 focus-visible:ring-offset-0",
            className,
            inputClassName
          )}
          id={id}
          {...props}
        />
      </div>
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
