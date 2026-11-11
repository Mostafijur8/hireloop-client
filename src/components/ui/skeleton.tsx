import { cn } from "cn"

// কনটেন্ট লোড হওয়ার সময় pulse animation-সহ placeholder দেখায়।
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
