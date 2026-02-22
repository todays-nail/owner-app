import { AppLaunchLogo } from "@/components/brand/app-launch-logo";
import { cn } from "@/lib/utils";

export interface AuthPageHeaderProps {
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

export function AuthPageHeader({
  title,
  description,
  titleClassName,
  descriptionClassName,
  className
}: AuthPageHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      <AppLaunchLogo className="mx-auto" />
      <h1
        className={cn(
          "mt-7 text-[1.95rem] font-semibold leading-tight text-foreground",
          titleClassName
        )}
      >
        {title}
      </h1>
      <p className={cn("mt-2 text-base text-muted-foreground", descriptionClassName)}>
        {description}
      </p>
    </div>
  );
}
