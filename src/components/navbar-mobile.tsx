import { Button } from "@/components/ui/button";
import { navbarLinks } from "./navbar-links";

type NavbarMobileProps = {
  isOpen: boolean;
  isPending: boolean;
  isSignedIn: boolean;
  userName?: string;
  onClose: () => void;
  onSignOut: () => void;
};

/** Renders the collapsible navigation links and session actions on mobile. */
export function NavbarMobile({
  isOpen,
  isPending,
  isSignedIn,
  userName,
  onClose,
  onSignOut,
}: NavbarMobileProps) {
  if (!isOpen) return null;
  return (
    <div
      id="mobile-navigation"
      className="border-t border-white/10 pb-4 pt-3 md:hidden"
    >
      <div className="flex flex-col gap-1">
        {navbarLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm text-white hover:bg-white/5"
          >
            {link.label}
          </a>
        ))}
        {!isPending &&
          (isSignedIn ? (
            <>
              <span className="px-3 py-2 text-sm text-white">
                Welcome, {userName || "there"}
              </span>
              <Button
                type="button"
                variant="ghost"
                className="justify-start px-3 text-sm font-medium text-[#9182ff] hover:bg-white/5 hover:text-violet-200"
                onClick={() => {
                  onClose();
                  onSignOut();
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <a
                href="/sign-in"
                onClick={onClose}
                className="rounded-md px-3 py-2 text-sm font-medium text-[#9182ff] hover:bg-white/5"
              >
                Sign In
              </a>
              <a
                href="/sign-up"
                onClick={onClose}
                className="rounded-md px-3 py-2 text-sm font-medium text-[#9182ff] hover:bg-white/5"
              >
                Sign Up
              </a>
              <Button
                nativeButton={false}
                render={<a href="/sign-up" />}
                className="mt-2 w-full rounded-[9px] bg-[#6650f5] text-white hover:bg-[#7663ff]"
                onClick={onClose}
              >
                Get Started
              </Button>
            </>
          ))}
      </div>
    </div>
  );
}
