/** Shows the platform metrics beneath the globe illustration. */
const stats = [
  { value: "10K+", label: "Active jobs" },
  { value: "8K+", label: "Companies" },
  { value: "95%", label: "Success rate" },
  { value: "24/7", label: "Career support" },
];

export function HeroStats() {
  return <div className="absolute inset-x-0 bottom-2 z-10 grid grid-cols-2 gap-2 sm:bottom-4 sm:grid-cols-4 sm:gap-3">{stats.map((stat) => <div key={stat.label} className="rounded-xl border border-white/10 bg-[#09090de8] p-3 text-left shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-4"><p className="text-lg font-semibold tracking-tight sm:text-2xl">{stat.value}</p><p className="mt-1 text-[10px] text-zinc-400 sm:text-xs">{stat.label}</p></div>)}</div>;
}
