import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Landmark,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Inicio" },
  { to: "/gastos", icon: CreditCard, label: "Gastos" },
  { to: "/ingresos", icon: TrendingUp, label: "Ingresos" },
  { to: "/deudas", icon: Landmark, label: "Deudas" },
  { to: "/mas", icon: MoreHorizontal, label: "Más" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 safe-area-inset-bottom">
      <div className="flex items-stretch justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-xs transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
