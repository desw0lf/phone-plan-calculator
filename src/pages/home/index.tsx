import { AuroraBackground } from "@/components/ui/aurora-background";
import { Main } from "./main";

export function Home() {
  return (
    <AuroraBackground>
      <div className="relative flex w-full min-h-screen flex-col sm:gap-4">
        <div className="min-h-screen lg:py-10 lg:px-10 xl:py-20 xl:px-40">
          <Main />
        </div>
      </div>
    </AuroraBackground>
  );
}
