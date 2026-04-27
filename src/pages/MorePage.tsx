import { Link } from "react-router-dom";
import { BarChart3, PiggyBank, Settings, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    to: "/reportes",
    icon: BarChart3,
    label: "Reportes",
    description: "Análisis y exportación de datos",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    to: "/presupuesto",
    icon: PiggyBank,
    label: "Presupuesto y Metas",
    description: "Límites y objetivos de ahorro",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    to: "/configuracion",
    icon: Settings,
    label: "Configuración",
    description: "Tema, moneda y preferencias",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
];

export function MorePage() {
  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 px-4 mb-4">
        Más opciones
      </h2>
      <div className="flex flex-col gap-3 px-4">
        {items.map(({ to, icon: Icon, label, description, color, bg }) => (
          <Link key={to} to={to}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
