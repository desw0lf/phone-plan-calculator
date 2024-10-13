import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeName = "system" | "light" | "dark" | (string & {});

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ThemeName;
  themeComputed: Omit<ThemeName, "system">;
  setTheme: (theme: string) => void;
  toggleThemeDarkLight: () => void;
};

const initialState = {
  theme: "system",
  themeComputed: "light",
  setTheme: () => null,
  toggleThemeDarkLight: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
  const themeComputed = useMemo(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return theme === "system" ? systemTheme : theme;
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const setThemeWithStorage = (theme: ThemeName) => {
    localStorage.setItem(storageKey, theme);
    setTheme(theme);
  };

  const value = {
    theme,
    themeComputed,
    setTheme: setThemeWithStorage,
    toggleThemeDarkLight: () => {
      setThemeWithStorage(themeComputed === "dark" ? "light" : "dark");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
