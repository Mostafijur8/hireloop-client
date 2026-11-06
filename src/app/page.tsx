import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050507] px-[15px]">
      <div className="mx-auto max-w-[1200px] bg-[#050507]">
        <Navbar />
        <Hero />
      </div>
    </main>
  );
}
