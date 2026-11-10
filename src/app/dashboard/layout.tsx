import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      className="min-h-svh bg-[#050507]"
      style={
        {
          "--sidebar-width": "12rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <main className="flex min-h-svh min-w-0 flex-1 flex-col bg-[#050507]">
        <div className="border-b border-white/[0.07] px-5 py-2">
          <SidebarTrigger className="text-zinc-300 hover:bg-white/10 hover:text-white" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
