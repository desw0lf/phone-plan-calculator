// import { TrendingUp } from "lucide-react";
import { useSettings } from "@/providers/settings-provider";
import { Bar, BarChart, CartesianGrid, LabelList, Label, XAxis, YAxis, Legend } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { toCurrency } from "@/helpers/to-currency";
// ? TYPES:
import type { ConcatenatedMonthBreakdown } from "./calculator.types";

const chartConfig = {
  min: {
    label: "Min",
    color: "hsl(212deg 95% 68%)",
  },
  max: {
    label: "Max",
    color: "hsl(0deg 65.36% 52.27%)",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export const Chart: React.FC<{ concatenatedMonthlyBreakdown: ConcatenatedMonthBreakdown[]; subheading: string }> = ({
  concatenatedMonthlyBreakdown,
  subheading,
}) => {
  const { currencySettings } = useSettings();
  const currencyFormatter = (v: number) => {
    const value = toCurrency(v);
    const suffix = " p/m";
    if ("prefix" in currencySettings) {
      return currencySettings.prefix + value + suffix;
    }
    return value + currencySettings.suffix + suffix;
  };
  console.log({ concatenatedMonthlyBreakdown });
  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>Monthly cost breakdown</CardTitle>
        <CardDescription>{subheading}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            barGap={0}
            // barSize={24}
            className="[&>svg]:overflow-visible [&_.recharts-default-legend]:!pl-16 [&_.recharts-default-legend]:!mt-3"
            accessibilityLayer
            data={concatenatedMonthlyBreakdown}
            layout="vertical"
            margin={{
              right: 44,
              bottom: 10,
            }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="label" type="category" tickLine={false} tickMargin={10} axisLine={true} />
            <XAxis dataKey="minCost" type="number" hide />
            <XAxis dataKey="maxCost" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="minCost" layout="vertical" fill="var(--color-min)" radius={4}>
              {/* <LabelList dataKey="label" position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} /> */}
              <LabelList dataKey="minCost" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={currencyFormatter} />
            </Bar>
            <Bar dataKey="maxCost" layout="vertical" fill="var(--color-max)" radius={4}>
              {/* <LabelList dataKey="label" position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} /> */}
              <LabelList dataKey="maxCost" position="right" offset={8} className="fill-foreground" fontSize={12} formatter={currencyFormatter} />
            </Bar>
            <Legend verticalAlign="bottom" height={36} margin={{ left: 60 }} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter> */}
    </Card>
  );
};
