import { useState } from "react";
import { useDebtStore } from "@/stores/useDebtStore";
import { DebtCard } from "./DebtCard";
import { DebtPaymentForm } from "./DebtPaymentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DebtList() {
  const { debts } = useDebtStore();
  const [payingDebtId, setPayingDebtId] = useState<string | null>(null);

  const active = debts.filter((d) => d.status === "active");
  const paid = debts.filter((d) => d.status === "paid");

  return (
    <>
      <Tabs defaultValue="active">
        <TabsList className="mx-4">
          <TabsTrigger value="active">Activas ({active.length})</TabsTrigger>
          <TabsTrigger value="paid">Pagadas ({paid.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {active.length === 0 ? (
            <EmptyState message="Sin deudas activas" icon="🎉" />
          ) : (
            <div className="flex flex-col gap-3 px-4">
              {active.map((d) => (
                <DebtCard key={d.id} debt={d} onAddPayment={setPayingDebtId} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="paid">
          {paid.length === 0 ? (
            <EmptyState message="Sin deudas pagadas" icon="📋" />
          ) : (
            <div className="flex flex-col gap-3 px-4">
              {paid.map((d) => (
                <DebtCard key={d.id} debt={d} onAddPayment={setPayingDebtId} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!payingDebtId} onOpenChange={(o) => !o && setPayingDebtId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar pago</DialogTitle>
          </DialogHeader>
          {payingDebtId && (
            <DebtPaymentForm
              debtId={payingDebtId}
              onClose={() => setPayingDebtId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
