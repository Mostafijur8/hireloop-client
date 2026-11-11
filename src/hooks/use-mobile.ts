import * as React from "react"

// এই pixel width-এর নিচের viewport-কে mobile হিসেবে ধরা হয়।
const MOBILE_BREAKPOINT = 768

// Screen resize হলে mobile breakpoint অনুযায়ী boolean state দেয়।
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
