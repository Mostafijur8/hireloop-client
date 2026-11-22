import * as React from "react"

// এই pixel width-এর নিচের viewport-কে mobile হিসেবে ধরা হয়।
const MOBILE_BREAKPOINT = 768

// Screen resize হলে mobile breakpoint অনুযায়ী boolean state দেয়।
export function useIsMobile() {
  const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
  const subscribe = React.useCallback((onChange: () => void) => {
    const mql = window.matchMedia(query)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])
  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query])
  const getServerSnapshot = React.useCallback(() => false, [])
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
