"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="mx-auto max-w-[1200px] px-4 py-5 sm:px-[42px]"
    >
      <div className="rounded-[14px] bg-[#202020] px-4 sm:px-[18px]">
        <div className="flex min-h-[68px] items-center justify-between">
          <a
            href="/"
            aria-label="Hireloop home"
            className="shrink-0 text-[27px] font-extrabold leading-none tracking-[-1.8px]"
          >
            <span className="text-[#168bff]">hire</span>
            <span className="text-[#ff7b18]">
              l<span className="text-[#168bff]">o</span>op
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[11px] text-white transition-colors hover:text-[#9b8cff]"
              >
                {link.label}
              </a>
            ))}
            <span aria-hidden="true" className="h-[18px] w-px bg-white/15" />
            <Button
              render={<a href="/sign-in" />}
              variant="ghost"
              className="h-auto px-0 text-[12px] font-medium text-[#7864ff] hover:bg-transparent hover:text-[#a093ff]"
            >
              Sign In
            </Button>
            <Button
              render={<a href="/sign-up" />}
              className="h-auto rounded-[9px] bg-[#6650f5] px-[17px] py-[10px] text-[12px] font-medium text-white shadow-[0_3px_12px_rgba(102,80,245,0.28)] hover:bg-[#7663ff]"
            >
              Get Started
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="text-white hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {menuOpen && (
          <div id="mobile-navigation" className="border-t border-white/10 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-white hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-[#9182ff] hover:bg-white/5"
              >
                Sign In
              </a>
              <Button
                render={<a href="/sign-up" />}
                className="mt-2 w-full rounded-[9px] bg-[#6650f5] text-white hover:bg-[#7663ff]"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
