import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

export function CategoryFilter({
  categories,
  selectedIds,
  onToggle,
  onClear,
}: CategoryFilterProps) {
  const allSelected = selectedIds.length === 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Categorías
        </span>
        {selectedIds.length > 0 && (
          <Button size="sm" variant="ghost" onClick={onClear}>
            Todas
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = allSelected || selectedIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggle(cat.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors",
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
