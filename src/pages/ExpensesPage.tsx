import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseList, currentMonthStr } from "@/components/expenses/ExpenseList";
import { RecurringManager } from "@/components/expenses/RecurringManager";
import { useMonthlyRecurrence } from "@/hooks/useMonthlyRecurrence";

export function ExpensesPage() {
  const [search, setSearch] = useState("");
  const month = currentMonthStr();

  useMonthlyRecurrence();

  return (
    <div className="py-4">
      <div className="flex items-center gap-2 px-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar gastos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link to="/gastos/nuevo">
          <Button size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="expenses" className="px-4">
        <TabsList className="w-full">
          <TabsTrigger value="expenses" className="flex-1">
            Gastos
          </TabsTrigger>
          <TabsTrigger value="recurring" className="flex-1 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Recurrentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <div className="mt-3">
            <ExpenseList month={month} search={search} />
          </div>
        </TabsContent>

        <TabsContent value="recurring">
          <div className="mt-3">
            <RecurringManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
