"use client"

import { AlertDialog as Primitive } from "@base-ui/react/alert-dialog"
import { cn } from "cn"
import { AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "./alert-dialog-elements"

/** Root, trigger, and modal panel primitives for confirmation dialogs. */
export function AlertDialog({ ...props }: Primitive.Root.Props) { return <Primitive.Root data-slot="alert-dialog" {...props} /> }
export function AlertDialogTrigger({ ...props }: Primitive.Trigger.Props) { return <Primitive.Trigger data-slot="alert-dialog-trigger" {...props} /> }
function AlertDialogPortal({ ...props }: Primitive.Portal.Props) { return <Primitive.Portal data-slot="alert-dialog-portal" {...props} /> }
function AlertDialogOverlay({ className, ...props }: Primitive.Backdrop.Props) { return <Primitive.Backdrop data-slot="alert-dialog-overlay" className={cn("fixed inset-0 z-50 bg-black/60 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0", className)} {...props} /> }

/** Centers dialog content above a dimmed page backdrop. */
export function AlertDialogContent({ className, children, size = "default", ...props }: Primitive.Popup.Props & { size?: "default" | "sm" }) {
  return <AlertDialogPortal><AlertDialogOverlay /><Primitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4"><Primitive.Popup data-slot="alert-dialog-content" className={cn("relative w-full rounded-xl border border-[#303036] bg-[#18181b] p-5 text-white shadow-xl outline-none transition data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0", size === "sm" ? "max-w-sm" : "max-w-lg", className)} {...props}>{children}</Primitive.Popup></Primitive.Viewport></AlertDialogPortal>
}

export { AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle }
