import { useState, useMemo } from "react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
} from "date-fns";

export type DatePreset = "today" | "week" | "month" | "last30" | "last90" | "year" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

export function useDateRange() {
  const [preset, setPreset] = useState<DatePreset>("month");
  const [customRange, setCustomRange] = useState<DateRange>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  const range = useMemo<DateRange>(() => {
    const now = new Date();
    switch (preset) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "week":
        return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "last30":
        return { start: startOfDay(subDays(now, 30)), end: endOfDay(now) };
      case "last90":
        return { start: startOfDay(subDays(now, 90)), end: endOfDay(now) };
      case "year":
        return { start: startOfYear(now), end: endOfYear(now) };
      case "custom":
        return customRange;
    }
  }, [preset, customRange]);

  return { range, preset, setPreset, customRange, setCustomRange };
}
