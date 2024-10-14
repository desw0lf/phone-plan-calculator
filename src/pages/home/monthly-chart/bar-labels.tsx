import { cn } from "@/lib/utils";
// ? TYPES:
import type { BarProps, CSS } from "./monthly-chart.types";

export const BarLabels: React.FC<{ items: BarProps[] }> = ({ items }) => {
  return (
    <div className="charty__bar absolute flex items-center justify-end rounded-r-lg cursor-default" style={{ minWidth: "100%" }}>
      <div className="flex flex-col w-full h-full justify-evenly">
        {items.map((item, i) => (
          <div key={i} className="charty__label__bar flex justify-end gap-2" style={{ "--bar-width": `${item.width}%` } as CSS}>
            <span className={cn("text-slate-900 font-semibold text-sm mr-2 px-1 rounded-lg", item.className)}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
