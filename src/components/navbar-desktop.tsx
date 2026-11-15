import { Button } from '@/components/ui/button';
import { navbarLinks } from './navbar-links';

type NavbarDesktopProps = {
  isPending: boolean;
  isSignedIn: boolean;
  dashboardHref: string;
  userName?: string;
  onSignOut: () => void;
};

/** Renders the authenticated and guest actions in the desktop navigation. */
export function NavbarDesktop({
  isPending,
  isSignedIn,
  dashboardHref,
  userName,
  onSignOut,
}: NavbarDesktopProps) {
  return (
    <div className="hidden items-center gap-4 rounded-lg border border-white/[0.05] bg-[#19191c] px-3 py-2 md:flex">
      {navbarLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-[10px] text-zinc-300 transition-colors hover:text-[#9b8cff]"
        >
          {link.label}
        </a>
      ))}
      <span aria-hidden="true" className="h-[18px] w-px bg-white/15" />
      {!isPending &&
        (isSignedIn ? (
          <>
            <a
              href={dashboardHref}
              className="text-[10px] text-zinc-300 transition-colors hover:text-[#9b8cff]"
            >
              Dashboard
            </a>
            <span className="text-[12px] text-white">Welcome, {userName || 'there'}</span>
            <Button
              type="button"
              variant="ghost"
              onClick={onSignOut}
              className="h-auto px-0 text-[10px] font-medium text-[#9b8cff] hover:bg-transparent hover:text-[#a093ff]"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button
              nativeButton={false}
              render={<a href="/sign-in" />}
              variant="ghost"
              className="h-auto px-0 text-[10px] font-medium text-[#9b8cff] hover:bg-transparent hover:text-[#a093ff]"
            >
              Sign In
            </Button>
            <Button
              nativeButton={false}
              render={<a href="/sign-up" />}
              className="h-auto rounded-md bg-[#6650f5] px-3 py-2 text-[10px] font-semibold text-white shadow-[0_3px_12px_rgba(102,80,245,0.28)] hover:bg-[#7663ff]"
            >
              Get Started
            </Button>
          </>
        ))}
    </div>
  );
}
