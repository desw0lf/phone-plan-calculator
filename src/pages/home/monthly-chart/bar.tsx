import { cn } from "@/lib/utils";
// ? TYPES:
import type { BarProps, CSS } from "./monthly-chart.types";

export const Bar: React.FC<BarProps & { children?: React.ReactNode }> = ({ width, className, children, label }) => (
  <div
    className={cn("charty__bar relative flex items-center justify-end rounded-r-lg cursor-default", className)}
    style={{ "--bar-width": `${width}%` } as CSS}>
    {children}
    {label && <span className="text-slate-900 font-semibold text-sm px-3">{label}</span>}
  </div>
);
