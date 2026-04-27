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
import { useIncomeStore } from "@/stores/useIncomeStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useToast } from "@/components/ui/toast";
import { format } from "date-fns";
import type { Currency } from "@/types";

interface IncomeFormProps {
  onClose: () => void;
}

const SOURCES = ["Salario", "Freelance", "Inversiones", "Negocio", "Regalos", "Otro"];

export function IncomeForm({ onClose }: IncomeFormProps) {
  const { addIncome } = useIncomeStore();
  const { settings } = useSettingsStore();
  const { toast } = useToast();

  const [amount, setAmount] = useState("");
  const [source, setSource] = useState(SOURCES[0]);
  const [currency, setCurrency] = useState<Currency>(settings.currency);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed) return;

    addIncome({
      amount: parsed,
      currency,
      source,
      date,
      description: description || undefined,
      isRecurring,
    });

    toast("Ingreso agregado", "success");
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
        <Label>Fuente</Label>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SOURCES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
          placeholder="Detalles del ingreso"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="recurring-income">Ingreso recurrente</Label>
        <Switch
          id="recurring-income"
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
