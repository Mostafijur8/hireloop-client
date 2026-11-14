"use client"
import * as React from "react"
/** Shared sidebar settings and context for the compound UI components. */
export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"
// Provider à¦¥à§‡à¦•à§‡ sidebar-à¦à¦° state à¦“ toggle function child component-à¦ à¦¦à§‡à§Ÿà¥¤
export type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
export const SidebarContext = React.createContext<SidebarContextProps | null>(null)
// Sidebar provider-à¦à¦° context à¦ªà§œà¦¾à¦° hook; provider à¦›à¦¾à§œà¦¾ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦¹à¦²à§‡ error à¦¦à§‡à§Ÿà¥¤
export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

