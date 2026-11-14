"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

/** Root, trigger, backdrop, and semantic wrappers for the sheet dialog. */
export function Sheet({ ...props }: SheetPrimitive.Root.Props) { return <SheetPrimitive.Root data-slot="sheet" {...props} /> }
export function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) { return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} /> }
export function SheetClose({ ...props }: SheetPrimitive.Close.Props) { return <SheetPrimitive.Close data-slot="sheet-close" {...props} /> }
export function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) { return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} /> }

/** Provides the dimmed backdrop behind an open sheet. */
export function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return <SheetPrimitive.Backdrop data-slot="sheet-overlay" className={cn("fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs", className)} {...props} />
}

/** Shared header and footer layout wrappers for sheet contents. */
export function SheetHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="sheet-header" className={cn("flex flex-col gap-0.5 p-4", className)} {...props} /> }
export function SheetFooter({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} /> }
export function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) { return <SheetPrimitive.Title data-slot="sheet-title" className={cn("font-heading text-base font-medium text-foreground", className)} {...props} /> }
export function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) { return <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} /> }
