import { ThemeProvider } from "./providers/theme-provider";
import { SettingsProvider } from "./providers/settings-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "./pages/home";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ppc-ui-theme">
      <SettingsProvider storageKey="ppc-settings">
        <TooltipProvider delayDuration={0}>
          <Home />
        </TooltipProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
