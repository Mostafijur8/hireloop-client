import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1d1d1d] px-[15px]">
      <p className="absolute left-[15px] top-[7px] text-[14px] text-[#777]">
        Homepage
      </p>
      <div className="mx-auto mt-[34px] min-h-[110px] max-w-[1200px] bg-[#242424]">
        <Navbar />
      </div>
    </main>
  );
}
