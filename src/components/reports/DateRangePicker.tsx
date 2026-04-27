import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type DatePreset, type DateRange } from "@/hooks/useDateRange";
import { format } from "date-fns";

interface DateRangePickerProps {
  preset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
  customRange: DateRange;
  onCustomRangeChange: (range: DateRange) => void;
}

const presets: { value: DatePreset; label: string }[] = [
  { value: "month", label: "Este mes" },
  { value: "last30", label: "Últimos 30 días" },
  { value: "last90", label: "Últimos 90 días" },
  { value: "year", label: "Este año" },
  { value: "custom", label: "Personalizado" },
];

export function DateRangePicker({
  preset,
  onPresetChange,
  customRange,
  onCustomRangeChange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={preset === p.value ? "default" : "outline"}
            onClick={() => onPresetChange(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="date-from">Desde</Label>
            <Input
              id="date-from"
              type="date"
              value={format(customRange.start, "yyyy-MM-dd")}
              onChange={(e) =>
                onCustomRangeChange({
                  ...customRange,
                  start: new Date(e.target.value + "T00:00:00"),
                })
              }
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="date-to">Hasta</Label>
            <Input
              id="date-to"
              type="date"
              value={format(customRange.end, "yyyy-MM-dd")}
              onChange={(e) =>
                onCustomRangeChange({
                  ...customRange,
                  end: new Date(e.target.value + "T00:00:00"),
                })
              }
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
