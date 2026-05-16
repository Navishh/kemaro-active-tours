import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "kemaro-theme";
type Theme = "light" | "dark";

const apply = (t: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
};

export const initTheme = () => {
  const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "light";
  apply(stored);
};

const ThemeToggle = ({ className }: { className?: string }) => {
  const [theme, setTheme] = useState<Theme>(() =>
    (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as Theme | null)) || "light",
  );

  useEffect(() => {
    apply(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground/80 transition-colors hover:text-primary hover:border-primary/50",
        className,
      )}
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
};

export default ThemeToggle;
