import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />
      <main className="pb-24 min-h-[calc(100vh-56px)]">{children}</main>
      <BottomNav />
    </div>
  );
}
