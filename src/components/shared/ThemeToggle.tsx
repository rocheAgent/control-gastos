import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function ThemeToggle() {
  const { settings, toggleTheme } = useSettingsStore();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {settings.theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
