import Image from "next/image";
import globe from "@/images/globe.png";
import { ArrowUpRight, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroStats } from "./hero-stats";

// Hero অংশের নিচে দেখানো platform-এর marketing statistics।
/** Landing-page introduction, job search form, and platform artwork. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050507] px-5 pb-20 pt-10 text-white sm:px-8 sm:pt-14">
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] text-zinc-300 sm:text-xs">
          <Sparkles className="size-3.5 text-violet-400" />
          YOUR NEXT CHAPTER STARTS HERE
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-[72px]">
          Find your dream
          <br className="hidden sm:block" /> job <span className="bg-gradient-to-r from-[#8b7bff] via-[#b0a5ff] to-[#6479ff] bg-clip-text text-transparent">today.</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
          Discover opportunities that match your ambition. Connect with teams
          building what comes next.
        </p>

        <form
          action="/jobs"
          className="mt-8 flex w-full max-w-[700px] flex-col gap-2 rounded-2xl border border-white/10 bg-[#111114] p-2 shadow-[0_12px_55px_rgba(73,57,203,0.12)] sm:flex-row sm:items-center sm:rounded-full sm:pl-5"
        >
          <label className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-0">
            <Search className="size-4 shrink-0 text-zinc-500" />
            <input
              name="q"
              type="search"
              placeholder="Job title, skill, or company"
              aria-label="Job title, skill, or company"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </label>
          <span aria-hidden="true" className="hidden h-7 w-px bg-white/10 sm:block" />
          <label className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-0">
            <MapPin className="size-4 shrink-0 text-zinc-500" />
            <input
              name="location"
              type="text"
              placeholder="City or remote"
              aria-label="City or remote"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </label>
          <Button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-[#6955f5] px-5 text-sm text-white hover:bg-[#7968ff] sm:rounded-full"
          >
            Find jobs <ArrowUpRight className="ml-1 size-4" />
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-500">
          <span className="mr-1">Popular:</span>
          {["Product Designer", "Frontend Developer", "Remote", "Marketing"].map((tag) => (
            <a
              key={tag}
              href={`/jobs?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-white/[0.08] px-2.5 py-1 text-zinc-400 transition-colors hover:border-violet-400/40 hover:text-white"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>

      <div className="relative mx-auto mt-8 h-[390px] max-w-[1000px] sm:mt-2 sm:h-[470px]">
        <Image
          src={globe}
          alt="Glowing globe representing opportunities around the world"
          fill
          priority
          sizes="(max-width: 1000px) 100vw, 1000px"
          className="pointer-events-none object-cover object-[center_66%] opacity-90"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050507] via-transparent via-25% to-[#050507]" />

        <HeroStats />
      </div>
    </section>
  );
}
