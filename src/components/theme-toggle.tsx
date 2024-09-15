import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../providers/theme-provider";
import IconThemeLight from "../assets/icon-theme-light.svg";
import IconThemeDark from "../assets/icon-theme-dark.svg";

export const ThemeToggle = forwardRef<HTMLButtonElement, Record<string, unknown>>((props, ref) => {
  const { toggleThemeDarkLight } = useTheme();
  return (
    <Button {...props} ref={ref} onClick={toggleThemeDarkLight} variant="ghost" size="icon" className="[&>svg]:h-5 [&>svg]:w-5">
      <IconThemeLight />
      <IconThemeDark />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});
