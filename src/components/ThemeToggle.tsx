import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Droplet } from "lucide-react";

const THEMES = ["light", "dark", "blue"] as const;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("bv_theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
  });

  useEffect(() => {
    // remove any theme classes we might have set
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("blue-theme");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "blue") {
      document.documentElement.classList.add("blue-theme");
    }

    try {
      localStorage.setItem("bv_theme", theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const handleClick = () => {
    const currentIndex = THEMES.indexOf(theme as any);
    const next = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(next);
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      {theme === "dark" ? (
        <Sun className="mr-2 h-4 w-4" />
      ) : theme === "blue" ? (
        <Droplet className="mr-2 h-4 w-4" />
      ) : (
        <Moon className="mr-2 h-4 w-4" />
      )}
      {theme === "dark" ? "Light" : theme === "blue" ? "Blue" : "Dark"}
    </Button>
  );
}
