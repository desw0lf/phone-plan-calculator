import { useCallback } from "react";
import { useSettings } from "@/providers/settings-provider";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toCurrency } from "@/helpers/to-currency";
// ? TYPES:
import type { ConcatenatedMonthBreakdown } from "./calculator.types";

// type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

interface MonthlyChartProps {
  concatenatedMonthlyBreakdown: ConcatenatedMonthBreakdown[];
}

type CSS = React.CSSProperties;

type TLegendBox<T = undefined | null> = { label: string; className: string; value?: T; labelSuffix?: string };

type TLegendBoxTooltip = TLegendBox<string | null>;

interface BarProps {
  width: number;
  className?: string;
  label?: string;
}

const LegendItem: React.FC<TLegendBoxTooltip> = ({ label, className, value, labelSuffix }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-1.5">
      <div className={cn("h-2 w-2 shrink-0 rounded-[2px]", className)}></div>
      <span>
        {label} {labelSuffix}
      </span>
    </div>
    {value && <span className="charty__legend__value ml-auto font-mono font-medium text-foreground">{value}</span>}
  </div>
);

const Legend: React.FC<{ items: TLegendBox[] }> = ({ items }) => (
  <aside className="flex items-center justify-center gap-4 pt-3 text-xs">
    {items.map((item) => (
      <LegendItem key={item.label} {...item} />
    ))}
  </aside>
);

// const MonthSeparators: React.FC<{ count: number }> = ({ count }) => (
//   <aside className="charty__month-separators absolute pointer-events-none flex flex-col h-full left-0 w-6 mt-px opacity-10 dark:opacity-40">
//     {Array.from({ length: count - 1 }, (_, i) => (
//       <div key={i} className="w-full pointer-events-none border-b border-dotted" style={{ height: `${100 / count}%` }}></div>
//     ))}
//   </aside>
// );

const Bar: React.FC<BarProps & { children?: React.ReactNode }> = ({ width, className, children, label }) => (
  <div
    className={cn("charty__bar relative flex items-center justify-end rounded-r-lg cursor-default", className)}
    style={{ "--bar-width": `${width}%` } as CSS}>
    {children}
    {label && <span className="text-slate-900 font-semibold text-sm px-3">{label}</span>}
  </div>
);

const BarLabels: React.FC<{ items: BarProps[] }> = ({ items }) => {
  return (
    <div className="charty__bar absolute flex items-center justify-end rounded-r-lg cursor-default" style={{ "--bar-width": `100%` } as CSS}>
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

const VerticalLine: React.FC<{ xPercentage: number }> = ({ xPercentage }) => {
  if (xPercentage <= 0) {
    return null;
  }
  return (
    <div className="absolute w-full inset-y-0 -z-[1] pointer-events-none flex flex-grow items-center gap-4">
      <div className="h-full flex gap-2 flex-col flex-grow">
        <div className="bg-border w-[2px] h-full" style={{ marginLeft: `${xPercentage}%` }} />
      </div>
      <span className="charty__label text-xs text-muted-foreground"></span>
    </div>
  );
};

const ChartTooltip: React.FC<{ title: string; subtitle?: string; items: TLegendBoxTooltip[] }> = ({ title, subtitle, items }) => (
  <div className="grid gap-3">
    <header className="flex flex-col">
      <span className="text-sm">{title}</span>
      <span className="text-muted-foreground">{subtitle}</span>
    </header>
    <div className="grid gap-1.5 pb-1 [&>*]:gap-6">
      {items.map((item) => (
        <LegendItem key={item.label} {...item} />
      ))}
    </div>
  </div>
);

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ concatenatedMonthlyBreakdown }) => {
  const { currencySettings } = useSettings();
  const legendItems = [
    { label: "Min Cost", className: "bg-yellow-100 dark:bg-yellow-50", labelSuffix: "(p/m)" },
    { label: "Max Cost", className: "bg-primary", labelSuffix: "(p/m)" },
  ];
  const currencyFormatter = useCallback(
    (v: number, suffix = " per month") => {
      if (v === 0) {
        return undefined;
      }
      const value = toCurrency(v);
      if ("prefix" in currencySettings) {
        return currencySettings.prefix + value + suffix;
      }
      return value + currencySettings.suffix + suffix;
    },
    [currencySettings],
  );
  console.log(concatenatedMonthlyBreakdown);
  return (
    <div>
      <div className="charty relative leading-none flex flex-col gap-6 py-4">
        <VerticalLine xPercentage={concatenatedMonthlyBreakdown[0].minCostWidthPercentage} />
        {concatenatedMonthlyBreakdown.map((item) => (
          <Tooltip key={item.billingIndex}>
            <TooltipTrigger asChild>
              <div className="charty__row flex flex-grow items-center gap-4" style={{ "--bar-count": item.monthCount } as CSS}>
                <div className="flex gap-2 flex-col flex-grow relative">
                  <Bar className={`${legendItems[1].className} absolute`} width={item.maxCostWidthPercentage}>
                    {/* <MonthSeparators count={item.monthCount} /> */}
                  </Bar>
                  <Bar className={`${legendItems[0].className} dark:shadow-[1px_0_6px_1px_rgba(0,0,0,0.15)]`} width={item.minCostWidthPercentage}>
                    {/* <MonthSeparators count={item.monthCount} /> */}
                  </Bar>
                  <BarLabels
                    items={[
                      { label: currencyFormatter(item.minCost, ""), width: item.minCostWidthPercentage, className: legendItems[0].className },
                      { label: currencyFormatter(item.maxCost, ""), width: item.maxCostWidthPercentage, className: legendItems[1].className },
                    ]}
                  />
                </div>
                <span className="charty__label leading-tight">
                  <span className="block text-sm text-foreground">{item.monthCount} months</span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </span>
              </div>
            </TooltipTrigger>
            {item.minCost > 0 && (
              <TooltipPortal>
                <TooltipContent side="left" sideOffset={12} className="text-xs py-3">
                  <ChartTooltip
                    title={`${item.monthCount} months`}
                    subtitle={item.label}
                    items={[
                      { ...legendItems[0], value: currencyFormatter(item.minCost, "") },
                      { ...legendItems[1], value: currencyFormatter(item.maxCost, "") },
                    ]}
                  />
                </TooltipContent>
              </TooltipPortal>
            )}
          </Tooltip>
        ))}
      </div>
      <Legend items={legendItems} />
    </div>
  );
};
