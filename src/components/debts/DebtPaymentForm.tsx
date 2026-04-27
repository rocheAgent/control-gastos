import { useState } from "react";
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
import { useDebtStore } from "@/stores/useDebtStore";
import { useToast } from "@/components/ui/toast";
import { format } from "date-fns";
import type { PaymentType } from "@/types";

interface DebtPaymentFormProps {
  debtId: string;
  onClose: () => void;
}

export function DebtPaymentForm({ debtId, onClose }: DebtPaymentFormProps) {
  const { addDebtPayment, debts } = useDebtStore();
  const { toast } = useToast();
  const debt = debts.find((d) => d.id === debtId);

  const [amount, setAmount] = useState(debt?.minimumPayment.toString() ?? "");
  const [type, setType] = useState<PaymentType>("minimum");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed) return;

    addDebtPayment({ debtId, amount: parsed, date, type });
    toast("Pago registrado", "success");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="payment-amount">Monto del pago</Label>
        <Input
          id="payment-amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label>Tipo de pago</Label>
        <Select value={type} onValueChange={(v) => setType(v as PaymentType)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimum">Mínimo</SelectItem>
            <SelectItem value="extra">Extra</SelectItem>
            <SelectItem value="full">Total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="payment-date">Fecha</Label>
        <Input
          id="payment-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Registrar pago
        </Button>
      </div>
    </form>
  );
}
