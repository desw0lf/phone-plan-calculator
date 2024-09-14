import { ThemeProvider } from "./providers/theme-provider";
import { Home } from "./pages/home";


function App() {
  return <ThemeProvider defaultTheme="system" storageKey="ppc-ui-theme"><Home/></ThemeProvider>;
}

export default App;
