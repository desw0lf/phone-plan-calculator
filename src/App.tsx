import { ThemeProvider } from "./providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "./pages/home";


function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ppc-ui-theme">
      <TooltipProvider delayDuration={0}>
        <Home/>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
