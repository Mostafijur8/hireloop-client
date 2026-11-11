"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; message: string; kind: ToastKind };
type ToastContextValue = { toast: (message: string, kind?: ToastKind) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

// যেকোনো client component থেকে toast পাঠানোর hook।
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");
  return context;
}

// Toast stack-এর state, auto-dismiss এবং global visual container পরিচালনা করে।
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random();
    setItems((current) => [...current, { id, message, kind }]);
    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const contextValue = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(calc(100vw-2rem),360px)] flex-col gap-2" aria-live="polite" aria-atomic="false">
        {items.map((item) => {
          const Icon = item.kind === "success" ? CheckCircle2 : item.kind === "error" ? CircleAlert : Info;
          const color = item.kind === "success" ? "text-emerald-400" : item.kind === "error" ? "text-red-400" : "text-sky-400";
          return (
            <div key={item.id} role={item.kind === "error" ? "alert" : "status"} className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-[#1c1c20] px-4 py-3 text-sm text-white shadow-[0_12px_40px_rgba(0,0,0,.45)] animate-in fade-in slide-in-from-top-2">
              <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
              <p className="min-w-0 flex-1 leading-5">{item.message}</p>
              <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification" className="-mr-1 -mt-1 rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white"><X className="size-3.5" /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
