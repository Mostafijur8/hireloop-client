"use client"

import * as React from "react"
import { AlertDialog as Primitive } from "@base-ui/react/alert-dialog"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"

/** Supplies reusable headings, descriptions, and actions for alert dialogs. */
export function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-2", className)} {...props} /> }
export function AlertDialogMedia({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="alert-dialog-media" className={cn("mb-1 flex size-10 items-center justify-center rounded-full", className)} {...props} /> }
export function AlertDialogTitle({ className, ...props }: Primitive.Title.Props) { return <Primitive.Title data-slot="alert-dialog-title" className={cn("text-base font-semibold", className)} {...props} /> }
export function AlertDialogDescription({ className, ...props }: Primitive.Description.Props) { return <Primitive.Description data-slot="alert-dialog-description" className={cn("text-sm text-[#a2a2ab]", className)} {...props} /> }
export function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) { return <div data-slot="alert-dialog-footer" className={cn("mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} /> }
export function AlertDialogCancel({ className, variant = "outline", ...props }: Primitive.Close.Props & { variant?: "outline" | "ghost" }) { return <Primitive.Close data-slot="alert-dialog-cancel" className={cn(buttonVariants({ variant, size: "default" }), className)} {...props} /> }
export function AlertDialogAction({ className, variant = "default", ...props }: Primitive.Close.Props & { variant?: "default" | "destructive" }) { return <Primitive.Close data-slot="alert-dialog-action" className={cn(buttonVariants({ variant, size: "default" }), className)} {...props} /> }
