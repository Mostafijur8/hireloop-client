import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import logo from "@/images/logo.png";

type AuthShellProps = {
  sideEyebrow: string;
  sideTitle: string;
  sideDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

/** Shared frame for the sign-in and sign-up experiences. */
export function AuthShell({ sideEyebrow, sideTitle, sideDescription, eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070a] px-4 py-10 text-white sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
      <Link href="/" className="absolute left-5 top-5 inline-flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white sm:left-8 sm:top-8"><ArrowLeft className="size-4" />Back to home</Link>
      <div className="relative grid w-full max-w-[920px] overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d11] shadow-[0_30px_100px_rgba(0,0,0,0.5)] md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(98,75,245,0.24),transparent_48%),#0a0a0e] p-9 md:flex lg:p-12">
          <div className="relative z-10"><BrandLogo width={130} height={34} /><div className="mt-20 max-w-xs"><p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">{sideEyebrow}</p><h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em]">{sideTitle}</h1><p className="mt-4 text-sm leading-6 text-zinc-400">{sideDescription}</p></div></div>
          <div className="relative z-10 space-y-4 text-xs text-zinc-400"><p className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-violet-300"><BriefcaseBusiness className="size-4" /></span>Find roles that match your goals</p><p className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-violet-300"><ShieldCheck className="size-4" /></span>Your information stays protected</p></div>
          <div aria-hidden="true" className="absolute -bottom-40 -right-24 size-80 rounded-full border border-violet-400/10 shadow-[0_0_100px_rgba(104,83,255,0.16)]" />
        </aside>
        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 md:hidden"><BrandLogo width={120} height={32} /></div>
          <div className="mb-8"><p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">{eyebrow}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">{title}</h2><p className="mt-2 text-sm text-zinc-400">{description}</p></div>
          {children}{footer}
        </section>
      </div>
    </main>
  );
}

/** Renders the brand mark at desktop and mobile sizes. */
function BrandLogo({ width, height }: { width: number; height: number }) {
  return <Link href="/" aria-label="Hireloop home"><Image src={logo} alt="Hireloop" width={width} height={height} priority /></Link>;
}
