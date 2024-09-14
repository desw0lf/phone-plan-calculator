import { ThemeToggle } from "./theme-toggle";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <a className="mr-4 flex items-center space-x-2 lg:mr-6" href="/">
            <span className="font-bold lg:inline-block">PPC</span>
          </a>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            xx
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* <div className="w-full flex-1 md:w-auto md:flex-none">
            ...
          </div> */}
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};