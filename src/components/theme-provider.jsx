import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeProviderContext = createContext();

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}) {
  const validThemes = ["light", "dark", "system"];
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(storageKey);
      return validThemes.includes(storedTheme) ? storedTheme : defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      if (validThemes.includes(newTheme)) {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      } else {
        console.error("Invalid theme:", newTheme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
