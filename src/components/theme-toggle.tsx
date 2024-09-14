import { useTheme } from "../providers/theme-provider";
import IconThemeLight from "../assets/icon-theme-light.svg?react";
import IconThemeDark from "../assets/icon-theme-dark.svg?react";

export const ThemeToggle = () => {
  const { toggleThemeDarkLight } = useTheme();
  return (
    <button onClick={toggleThemeDarkLight} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0" type="button">
      <IconThemeLight />
      <IconThemeDark />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};