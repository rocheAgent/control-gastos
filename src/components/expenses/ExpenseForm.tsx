import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryPicker } from "./CategoryPicker";
import { useExpenseStore } from "@/stores/useExpenseStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useToast } from "@/components/ui/toast";
import { format } from "date-fns";
import type { Currency } from "@/types";

interface ExpenseFormProps {
  onClose: () => void;
}

export function ExpenseForm({ onClose }: ExpenseFormProps) {
  const { categories, addExpense } = useExpenseStore();
  const { settings } = useSettingsStore();
  const { toast } = useToast();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [currency, setCurrency] = useState<Currency>(settings.currency);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || !categoryId) return;

    addExpense({
      amount: parsed,
      currency,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      date,
      description: description || undefined,
      isRecurring,
    });

    toast("Gasto agregado", "success");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div className="w-28">
          <Label>Moneda</Label>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MXN">MXN</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Categoría</Label>
        <div className="mt-2">
          <CategoryPicker
            categories={categories}
            selected={categoryId}
            onSelect={(id) => {
              setCategoryId(id);
              setSubcategoryId("");
            }}
          />
        </div>
      </div>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div>
          <Label>Subcategoría</Label>
          <Select value={subcategoryId} onValueChange={setSubcategoryId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {selectedCategory.subcategories.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="date">Fecha</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input
          id="description"
          placeholder="¿En qué gastaste?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="recurring">Gasto recurrente</Label>
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Agregar
        </Button>
      </div>
    </form>
  );
}
