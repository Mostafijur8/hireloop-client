"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";

/** Responsive public navigation and sign-in state actions. */
export function Navbar() {
  const { toast } = useToast();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast(error.message ?? "Could not sign out.", "error");
        return;
      }
      toast("Signed out successfully.", "success");
      router.replace("/");
    } catch {
      toast("Could not sign out. Please try again.", "error");
    }
  }

  return (
    <nav aria-label="Main navigation" className="mx-auto max-w-[1200px] px-4 py-5 sm:px-[42px]">
      <div className="rounded-[14px] bg-[#202020] px-4 sm:px-[18px]">
        <div className="flex min-h-[68px] items-center justify-between">
          <Link href="/" aria-label="Hireloop home" className="shrink-0 text-[27px] font-extrabold leading-none tracking-[-1.8px]"><span className="text-[#168bff]">hire</span><span className="text-[#ff7b18]">l<span className="text-[#168bff]">o</span>op</span></Link>
          <NavbarDesktop isPending={isPending} isSignedIn={Boolean(session)} userName={session?.user?.name || undefined} onSignOut={handleSignOut} />
          <Button type="button" variant="ghost" size="icon" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" className="text-white hover:bg-white/10 hover:text-white md:hidden" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        <NavbarMobile isOpen={menuOpen} isPending={isPending} isSignedIn={Boolean(session)} userName={session?.user?.name || undefined} onClose={() => setMenuOpen(false)} onSignOut={handleSignOut} />
      </div>
    </nav>
  );
}
