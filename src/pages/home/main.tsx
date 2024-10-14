import { Plus, Settings, Share, Menu, TabletSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
// import { Advert } from "@/components/ui-custom/advert";
import { Calculator } from "./calculator";

const Link: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
}> = ({ href, children, className }) => {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

export function Main() {
  const title = import.meta.env.VITE_TITLE;
  const menuItems = [{ label: "Calculation 3rd03r", id: "x" }];
  return (
    <div className="grid min-h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border rounded-lg shadow-xl">
      <div className="hidden border-r bg-muted/30 md:block">
        <div className="flex min-h-full max-h-screen flex-col gap-4">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <TabletSmartphone className="h-6 w-6" />
              <span>{title}</span>
            </Link>
            {/* <div className="ml-auto inline-flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Open settings</span>
              </Button>
            </div> */}
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-2">
              <Link
                href="#/new"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary border border-dashed">
                <Plus className="h-4 w-4" />
                New Calculation
              </Link>
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#/id=${item.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          {/* <div className="mt-auto self-center">
            <Advert />
          </div> */}
          <div className="px-4 pb-4 self-center">
            <Button variant="link" size="sm" className="-mx-3">
              Find out more
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/30 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-2">
                  <TabletSmartphone className="h-6 w-6" />
                  <span className="sr-only">{title}</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-2 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground border border-dashed">
                  <Plus className="h-5 w-5" />
                  New Calculation
                </Link>
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.id}
                    className="mx-[-0.65rem] flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                    {item.label}
                  </Link>
                ))}
              </nav>
              {/* <div className="mt-auto self-center">
                <Advert />
              </div>
              <div>test</div> */}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form> */}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <ThemeToggle />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={12} className="text-xs">
              Toggle theme
            </TooltipContent>
          </Tooltip>
          <Popover>
            <Tooltip>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="[&:hover_svg]:stroke-primary">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <TooltipContent side="top" className="text-xs">
                Settings
              </TooltipContent>
            </Tooltip>
            <PopoverContent>TODO: currency symbol, contract start date here</PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="[&:hover_svg]:stroke-primary">
                <Share className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Share
            </TooltipContent>
          </Tooltip>
        </header>
        <Calculator />
      </div>
    </div>
  );
}
