import { Button } from "@/components/ui/button";
import Image from "next/image";
import { navbarLinks } from "./navbar-links";

type NavbarMobileProps = {
  isOpen: boolean;
  isPending: boolean;
  isSignedIn: boolean;
  dashboardHref: string;
  userName?: string;
  userImage?: string;
  onClose: () => void;
  onSignOut: () => void;
};

/** Renders the collapsible navigation links and session actions on mobile. */
export function NavbarMobile({
  isOpen,
  isPending,
  isSignedIn,
  dashboardHref,
  userName,
  userImage,
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
              <a
                href={dashboardHref}
                onClick={onClose}
                className="rounded-md px-3 py-2 text-sm text-white hover:bg-white/5"
              >
                Dashboard
              </a>
              <span className="flex items-center gap-2 px-3 py-2 text-sm text-white">
                {userImage ? (
                  <Image src={userImage} alt="" width={28} height={28} unoptimized className="size-7 rounded-full border border-white/15 object-cover" />
                ) : null}
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
