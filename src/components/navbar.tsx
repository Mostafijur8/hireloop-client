'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authClient, useSession } from '@/lib/auth-client';
import { useToast } from '@/components/toast-provider';
import { NavbarDesktop } from './navbar-desktop';
import { NavbarMobile } from './navbar-mobile';
import { dashboardByRole, isUserRole } from '@/features/dashboard/components/sidebar/app-sidebar-config';

/** Responsive public navigation and sign-in state actions. */
export function Navbar() {
  const { toast } = useToast();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const role = session?.user?.role === 'recruiter' || session?.user?.role === 'admin'
    ? session.user.role
    : session?.user?.signupRole === 'recruiter'
      ? 'recruiter'
      : session?.user?.role;
  const dashboardHref = isUserRole(role) ? dashboardByRole[role].url : '/dashboard/seeker';

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast(error.message ?? 'Could not sign out.', 'error');
        return;
      }
      toast('Signed out successfully.', 'success');
      router.replace('/');
    } catch {
      toast('Could not sign out. Please try again.', 'error');
    }
  }

  return (
    <nav aria-label="Main navigation" className="w-full bg-black px-4 py-3 sm:px-8">
      <div className="mx-auto w-full max-w-[1200px] rounded-xl border  border-white/[0.30] bg-black px-3 sm:px-4">
        <div className="flex min-h-12 items-center justify-between ">
          <Link
            href="/"
            aria-label="Hireloop home"
            className="shrink-0 text-[22px] font-extrabold leading-none tracking-[-1.4px]"
          >
            <span className="text-[#168bff]">hire</span>
            <span className="text-[#ff7b18]">
              l<span className="text-[#168bff]">o</span>op
            </span>
          </Link>
          <NavbarDesktop
            isPending={isPending}
            isSignedIn={Boolean(session)}
            dashboardHref={dashboardHref}
            userName={session?.user?.name || undefined}
            userImage={session?.user?.image || undefined}
            onSignOut={handleSignOut}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="text-white hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        <NavbarMobile
          isOpen={menuOpen}
          isPending={isPending}
          isSignedIn={Boolean(session)}
          dashboardHref={dashboardHref}
          userName={session?.user?.name || undefined}
          userImage={session?.user?.image || undefined}
          onClose={() => setMenuOpen(false)}
          onSignOut={handleSignOut}
        />
      </div>
    </nav>
  );
}
