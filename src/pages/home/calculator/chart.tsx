// import { TrendingUp } from "lucide-react";
import { useSettings } from "@/providers/settings-provider";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { toCurrency } from "@/helpers/to-currency";
// ? TYPES:
import type { ConcatenatedMonthBreakdown } from "./calculator.types";

const chartConfig = {
  minCost: {
    label: "Min Cost",
    color: "hsl(212deg 95% 68%)",
  },
  maxCost: {
    label: "Max Cost",
    color: "hsl(0deg 65.36% 52.27%)",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export const Chart: React.FC<{ concatenatedMonthlyBreakdown: ConcatenatedMonthBreakdown[] }> = ({ concatenatedMonthlyBreakdown }) => {
  const { currencySettings } = useSettings();
  const tooltipActive = concatenatedMonthlyBreakdown[0].minCost > 0;
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
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px]">
      <BarChart
        barGap={6}
        barCategoryGap={14}
        // barSize={24}
        className="[&>svg]:overflow-visible [&_.recharts-default-legend]:!pl-16 [&_.recharts-default-legend]:!mt-3"
        accessibilityLayer
        data={concatenatedMonthlyBreakdown}
        layout="vertical"
        margin={{
          right: 44,
          bottom: 10,
        }}>
        {/* <CartesianGrid horizontal={false} /> */}
        <YAxis dataKey="label" type="category" tickLine={false} tickMargin={10} axisLine={false} orientation="right" />
        {/* <XAxis dataKey="minCost" type="number" hide /> */}
        <XAxis dataKey="maxCost" type="number" hide />
        {tooltipActive && (
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent valueFormatter={tooltipFormatter as never} indicator="dot" className="[&_.tabular-nums]:ml-6" />}
          />
        )}
        <Bar dataKey="minCost" layout="vertical" fill="var(--color-minCost)" radius={4}>
          {/* <LabelList dataKey="label" position="right" offset={8} className="fill-foreground" fontSize={12} /> */}
          {/* <LabelList dataKey="label" position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} /> */}
          <LabelList
            dataKey="minCost"
            position="insideRight"
            offset={8}
            className="fill-foreground font-semibold"
            fontSize={12}
            formatter={currencyFormatter}
          />
        </Bar>
        <Bar dataKey="maxCost" layout="vertical" fill="var(--color-maxCost)" radius={4}>
          {/* <LabelList dataKey="label" position="right" offset={8} className="fill-foreground" fontSize={12} /> */}
          <LabelList
            dataKey="maxCost"
            position="insideRight"
            offset={8}
            className="fill-foreground font-semibold"
            fontSize={12}
            formatter={currencyFormatter}
          />
        </Bar>
        <ChartLegend content={<ChartLegendContent />} />
        {/* <Legend verticalAlign="bottom" height={36} margin={{ left: 60 }} /> */}
      </BarChart>
    </ChartContainer>
  );
};
