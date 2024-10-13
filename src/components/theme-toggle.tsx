import { forwardRef } from "react";
import { SunDim, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
import { useTheme } from "../providers/theme-provider";
// import IconThemeLight from "../assets/icon-theme-light.svg";
// import IconThemeDark from "../assets/icon-theme-dark.svg";

export const ThemeToggle = forwardRef<HTMLButtonElement, Record<string, unknown>>(({ "data-state": ds, ...props }, ref) => {
  const { toggleThemeDarkLight, themeComputed } = useTheme();
  return (
    <Switch
      ref={ref}
      checked={themeComputed === "dark"}
      onCheckedChange={toggleThemeDarkLight}
      aria-label="Toggle theme"
      className="[&_svg]:h-full [&_svg]:w-full [&_svg]:absolute [&_svg]:transition-all border border-[hsl(12,6.5%,74%)] dark:border-[hsl(12,6.5%,19%)] hover:!border-primary data-[state=checked]:bg-card/80 data-[state=unchecked]:bg-input/60"
      {...props}>
      <SunDim className="rotate-0 scale-100 dark:-rotate-90 dark:scale-0 stroke-yellow-500 fill-yellow-500 p-px stroke-2" />
      <Moon className="rotate-90 scale-0 dark:rotate-0 dark:scale-100 stroke-yellow-100 fill-yellow-100 p-px stroke-1" />
    </Switch>
  );
});

// #FFE5B5

// export const ThemeToggle = forwardRef<HTMLButtonElement, Record<string, unknown>>((props, ref) => {
//   const { toggleThemeDarkLight } = useTheme();
//   return (
//     <Button {...props} ref={ref} onClick={toggleThemeDarkLight} variant="ghost" size="icon" className="[&>svg]:h-5 [&>svg]:w-5">
//       <IconThemeLight />
//       <IconThemeDark />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// });
