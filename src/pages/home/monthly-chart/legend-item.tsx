import { cn } from "@/lib/utils";
// ? TYPES:
import { TLegendBoxTooltip } from "./monthly-chart.types";

export const LegendItem: React.FC<TLegendBoxTooltip> = ({ label, className, value, labelSuffix }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-1.5">
      <div className={cn("charty__dot h-2 w-2 shrink-0 rounded-[2px]", className)}></div>
      <span>
        {label} {labelSuffix}
      </span>
    </div>
    {value && <span className="charty__legend__value ml-auto font-mono font-medium text-foreground">{value}</span>}
  </div>
);
