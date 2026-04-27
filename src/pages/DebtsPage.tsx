import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DebtList } from "@/components/debts/DebtList";
import { PayoffCalculator } from "@/components/debts/PayoffCalculator";
import { useDebtStore } from "@/stores/useDebtStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { useToast } from "@/components/ui/toast";
import type { Currency, DebtType } from "@/types";

export function DebtsPage() {
  const [showAddDebt, setShowAddDebt] = useState(false);
  const { addDebt } = useDebtStore();
  const { settings } = useSettingsStore();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [type, setType] = useState<DebtType>("credit_card");
  const [totalAmount, setTotalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [dueDate, setDueDate] = useState("1");
  const [currency, setCurrency] = useState<Currency>(settings.currency);

  function handleAddDebt(e: React.FormEvent) {
    e.preventDefault();
    const total = parseFloat(totalAmount);
    const rate = parseFloat(interestRate);
    const minPay = parseFloat(minimumPayment);
    if (!total || !minPay || !name) return;

    addDebt({
      type,
      name,
      totalAmount: total,
      currency,
      interestRate: rate || 0,
      minimumPayment: minPay,
      dueDate,
      status: "active",
    });

    toast("Deuda agregada", "success");
    setShowAddDebt(false);
    setName("");
    setTotalAmount("");
    setInterestRate("");
    setMinimumPayment("");
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Deudas
        </h2>
        <Button size="sm" onClick={() => setShowAddDebt(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nueva deuda
        </Button>
      </div>

      <DebtList />
      <PayoffCalculator />

      <Dialog open={showAddDebt} onOpenChange={setShowAddDebt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar deuda</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDebt} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="debt-name">Nombre</Label>
              <Input
                id="debt-name"
                placeholder="Ej: Tarjeta BBVA"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label>Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as DebtType)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Tarjeta de crédito</SelectItem>
                    <SelectItem value="loan">Préstamo</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
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
              <Label htmlFor="debt-total">Monto total</Label>
              <Input
                id="debt-total"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="debt-rate">Tasa de interés (%)</Label>
                <Input
                  id="debt-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="debt-min">Pago mínimo</Label>
                <Input
                  id="debt-min"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={minimumPayment}
                  onChange={(e) => setMinimumPayment(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="debt-due">Día de vencimiento</Label>
              <Select value={dueDate} onValueChange={setDueDate}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => (i + 1).toString()).map((d) => (
                    <SelectItem key={d} value={d}>
                      Día {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddDebt(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Agregar deuda
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
