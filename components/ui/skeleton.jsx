import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-subtle3 dark:bg-foreground animate-pulse rounded-md", className)}
      {...props} />
  );
}

export { Skeleton }
