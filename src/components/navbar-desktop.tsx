import { Button } from "@/components/ui/button";
import { navbarLinks } from "./navbar-links";

type NavbarDesktopProps = {
  isPending: boolean;
  isSignedIn: boolean;
  userName?: string;
  onSignOut: () => void;
};

/** Renders the authenticated and guest actions in the desktop navigation. */
export function NavbarDesktop({ isPending, isSignedIn, userName, onSignOut }: NavbarDesktopProps) {
  return (
    <div className="hidden items-center gap-7 md:flex">
      {navbarLinks.map((link) => <a key={link.label} href={link.href} className="text-[11px] text-white transition-colors hover:text-[#9b8cff]">{link.label}</a>)}
      <span aria-hidden="true" className="h-[18px] w-px bg-white/15" />
      {!isPending && (isSignedIn ? <><span className="text-[12px] text-white">Welcome, {userName || "there"}</span><Button type="button" variant="ghost" onClick={onSignOut} className="h-auto px-0 text-[12px] font-medium text-[#7864ff] hover:bg-transparent hover:text-[#a093ff]">Sign Out</Button></> : <>
        <Button nativeButton={false} render={<a href="/sign-in" />} variant="ghost" className="h-auto px-0 text-[12px] font-medium text-[#7864ff] hover:bg-transparent hover:text-[#a093ff]">Sign In</Button>
        <Button nativeButton={false} render={<a href="/sign-up" />} variant="ghost" className="h-auto px-0 text-[12px] font-medium text-[#7864ff] hover:bg-transparent hover:text-[#a093ff]">Sign Up</Button>
        <Button nativeButton={false} render={<a href="/sign-up" />} className="h-auto rounded-[9px] bg-[#6650f5] px-[17px] py-[10px] text-[12px] font-medium text-white shadow-[0_3px_12px_rgba(102,80,245,0.28)] hover:bg-[#7663ff]">Get Started</Button>
      </>)}
    </div>
  );
}
