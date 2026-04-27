import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { CurrencyToggle } from "@/components/shared/CurrencyToggle";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useToast } from "@/components/ui/toast";

export function SettingsPage() {
  const { settings, setExchangeRate, setBudgetAlertThreshold } = useSettingsStore();
  const { categories, addCategory } = useExpenseStore();
  const { toast } = useToast();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📁");
  const [newCatColor, setNewCatColor] = useState("#6366f1");
  const [exchangeRateInput, setExchangeRateInput] = useState(settings.exchangeRate.toString());
  const [thresholdInput, setThresholdInput] = useState(
    (settings.budgetAlertThreshold * 100).toString()
  );

  function handleExchangeRateChange(value: string) {
    setExchangeRateInput(value);
    const rate = parseFloat(value);
    if (rate > 0) {
      setExchangeRate(rate);
    }
  }

  function handleThresholdChange(value: string) {
    setThresholdInput(value);
    const pct = parseFloat(value);
    if (pct > 0 && pct <= 100) {
      setBudgetAlertThreshold(pct / 100);
    }
  }

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor,
      subcategories: [],
      isDefault: false,
    });

    toast("Categoría agregada", "success");
    setShowAddCategory(false);
    setNewCatName("");
    setNewCatIcon("📁");
    setNewCatColor("#6366f1");
  }

  const quickIcons = ["📁", "🏠", "👕", "🎮", "✈️", "📚", "👶", "🐾", "🎁", "💊"];

  return (
    <div className="py-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 px-4 mb-4">
        Configuración
      </h2>

      <div className="flex flex-col gap-4 px-4">
        {/* Tema */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Tema</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Modo claro u oscuro
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Moneda */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Moneda</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  MXN o USD para mostrar montos
                </p>
              </div>
              <CurrencyToggle />
            </div>

            <div>
              <Label htmlFor="exchange-rate">
                Tipo de cambio (MXN por 1 USD)
              </Label>
              <Input
                id="exchange-rate"
                type="number"
                min="0"
                step="0.01"
                value={exchangeRateInput}
                onChange={(e) => handleExchangeRateChange(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Alerta de presupuesto */}
        <Card>
          <CardContent className="p-4">
            <div>
              <Label htmlFor="alert-threshold">
                Umbral de alerta de presupuesto (%)
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Recibir alerta cuando se exceda este porcentaje
              </p>
              <Input
                id="alert-threshold"
                type="number"
                min="1"
                max="100"
                value={thresholdInput}
                onChange={(e) => handleThresholdChange(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Categorías */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Categorías</CardTitle>
              <Button size="sm" onClick={() => setShowAddCategory(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Nueva
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="flex-1 text-sm text-slate-900 dark:text-slate-100">
                    {cat.name}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: cat.color }}
                  />
                  {!cat.isDefault && (
                    <span className="text-xs text-slate-400">custom</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              Acerca de
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control de Gastos v1.0.0
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Datos almacenados localmente en tu dispositivo
            </p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva categoría</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="cat-name">Nombre</Label>
              <Input
                id="cat-name"
                placeholder="Nombre de la categoría"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label>Icono</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {quickIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCatIcon(icon)}
                    className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                      newCatIcon === icon
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="cat-color">Color</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="cat-color"
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="h-10 w-16 p-1 cursor-pointer"
                />
                <Input
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddCategory(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Agregar categoría
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
