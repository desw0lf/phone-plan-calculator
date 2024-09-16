// import { TrendingUp } from "lucide-react";
import { useSettings } from "@/providers/settings-provider";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { toCurrency } from "@/helpers/to-currency";
// ? TYPES:
import type { ConcatenatedMonthBreakdown } from "./calculator.types";

const chartConfig = {
  minCost: {
    label: "Min Cost",
    // color: "var(--yellow-50)",
    theme: {
      dark: "var(--yellow-50)",
      light: "var(--yellow-100)",
    },
  },
  maxCost: {
    label: "Max Cost",
    color: "hsl(var(--primary))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export const CalculatorChart: React.FC<{ concatenatedMonthlyBreakdown: ConcatenatedMonthBreakdown[] }> = ({ concatenatedMonthlyBreakdown }) => {
  const { currencySettings } = useSettings();
  const firstMinCost = concatenatedMonthlyBreakdown[0].minCost;
  const tooltipActive = firstMinCost > 0;
  const currencyFormatter = (v: number, suffix = " per month") => {
    if (v === 0) {
      return null;
    }
    const value = toCurrency(v);
    if ("prefix" in currencySettings) {
      return currencySettings.prefix + value + suffix;
    }
    return value + currencySettings.suffix + suffix;
  };
  const tooltipFormatter = (v: number) => {
    return currencyFormatter(v, "");
  };
  const tooltipLabelFormatter = (label: string, x: any[]) => {
    const found = x.find(({ payload }) => payload.label === label);
    const labelSuffix = found ? ` (${found.payload.monthCount} months)` : "";
    return label + labelSuffix;
  };
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px]">
      <BarChart
        barGap={6}
        barCategoryGap={14}
        maxBarSize={38}
        // barSize={24}
        className="[&>svg]:overflow-visible [&>svg_.recharts-bar-rectangles]:opacity-90 [&_.recharts-default-legend]:!pl-16 [&_.recharts-default-legend]:!mt-3"
        accessibilityLayer
        data={concatenatedMonthlyBreakdown}
        layout="vertical">
        <CartesianGrid horizontal={false} verticalValues={[firstMinCost]} />
        <YAxis width={118} dataKey="label" type="category" tickLine={false} tickMargin={36} axisLine={false} orientation="right" />
        <XAxis dataKey="minCost" type="number" hide />
        <XAxis dataKey="maxCost" type="number" hide />
        {tooltipActive && (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={tooltipLabelFormatter}
                valueFormatter={tooltipFormatter as never}
                indicator="dot"
                className="[&_.tabular-nums]:ml-6"
              />
            }
          />
        )}
        <Bar dataKey="minCost" layout="vertical" fill="var(--color-minCost)" radius={4}>
          {/* <LabelList dataKey="label" position="right" offset={8} className="fill-foreground" fontSize={12} /> */}
          {/* <LabelList dataKey="label" position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} /> */}
          <LabelList dataKey="minCost" position="insideRight" offset={8} className="fill-slate-900 font-semibold" fontSize={13} formatter={currencyFormatter} />
        </Bar>
        <Bar dataKey="maxCost" layout="vertical" fill="var(--color-maxCost)" radius={4}>
          {/* <LabelList dataKey="label" position="right" offset={8} className="fill-foreground" fontSize={12} /> */}
          <LabelList dataKey="maxCost" position="insideRight" offset={8} className="fill-slate-900 font-semibold" fontSize={13} formatter={currencyFormatter} />
        </Bar>
        <ChartLegend content={<ChartLegendContent />} />
        {/* <Legend verticalAlign="bottom" height={36} margin={{ left: 60 }} /> */}
      </BarChart>
    </ChartContainer>
  );
};
