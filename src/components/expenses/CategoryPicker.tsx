import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryPickerProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-colors",
            selected === cat.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          )}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs text-slate-600 dark:text-slate-300 leading-tight text-center">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}
