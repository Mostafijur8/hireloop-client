import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";

// হোমপেজে মূল নেভিগেশন ও পরিচিতিমূলক Hero অংশ একসাথে দেখায়।
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
