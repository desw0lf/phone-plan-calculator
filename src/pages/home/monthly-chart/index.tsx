import { useCallback } from "react";
import { useSettings } from "@/providers/settings-provider";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { VerticalLine } from "./vertical-line";
import { Legend } from "./legend";
import { ChartTooltip } from "./chart-tooltip";
import { Bar } from "./bar";
import { BarLabels } from "./bar-labels";
import { toCurrency } from "@/helpers/to-currency";
// ? TYPES:
import type { ConcatenatedMonthBreakdown } from "../calculator/calculator.types";
import type { CSS } from "./monthly-chart.types";

interface MonthlyChartProps {
  concatenatedMonthlyBreakdown: ConcatenatedMonthBreakdown[];
  isEmpty?: boolean;
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ concatenatedMonthlyBreakdown, isEmpty }) => {
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

  return (
    <div className={cn("charty__wrapper", isEmpty && "charty__wrapper--empty")}>
      <div className="charty relative leading-none flex flex-col gap-6 py-4">
        <VerticalLine xPercentage={concatenatedMonthlyBreakdown[0].minCostWidthPercentage} />
        {concatenatedMonthlyBreakdown.map((item) => (
          <Tooltip key={item.billingIndex}>
            <TooltipTrigger asChild>
              <div className="charty__row flex flex-grow items-center gap-4" style={{ "--bar-count": item.monthCount } as CSS}>
                <div className="flex gap-2 flex-col flex-grow relative">
                  {item.maxCostWidthPercentage !== item.minCostWidthPercentage && (
                    <Bar className={`${legendItems[1].className} absolute`} width={item.maxCostWidthPercentage}>
                      {/* <MonthSeparators count={item.monthCount} /> */}
                    </Bar>
                  )}
                  <Bar className={`${legendItems[0].className} dark:shadow-[1px_0_6px_1px_rgba(0,0,0,0.15)]`} width={item.minCostWidthPercentage}>
                    {/* <MonthSeparators count={item.monthCount} /> */}
                  </Bar>
                  <BarLabels
                    items={[
                      { label: isEmpty ? "?" : currencyFormatter(item.minCost, ""), width: item.minCostWidthPercentage, className: legendItems[0].className },
                      { label: isEmpty ? "?" : currencyFormatter(item.maxCost, ""), width: item.maxCostWidthPercentage, className: legendItems[1].className },
                    ]}
                  />
                </div>
                <span className="charty__label leading-tight">
                  <span className="block text-sm text-foreground">{item.monthCount} months</span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </span>
              </div>
            </TooltipTrigger>
            {!isEmpty && (
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
