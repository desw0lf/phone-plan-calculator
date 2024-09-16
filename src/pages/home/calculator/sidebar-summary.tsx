import { useMemo } from "react";
import { Currency } from "@/components/ui-custom/currency";
import { cn as classNames } from "@/lib/utils";
import { Info, Copy, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generatePaymentMonths } from "@/helpers/generate-payment-months";
import { prettyDate } from "@/utils/pretty-date";
// ? TYPES:
import type { CalculatorState } from "./calculator.types";

type InitialMonthlyBreakdown = ReturnType<typeof generatePaymentMonths>[0];

interface MonthBreakdown extends InitialMonthlyBreakdown {
  minCost: number;
  maxCost: number;
  label: string;
}

interface ConcatenatedMonthBreakdown extends MonthBreakdown {
  totalMinCost: number;
  totalMaxCost: number;
  costDifference: number;
  monthCount: number;
}

function updateCost(originalValue: number, percent: number, fixed: number): number {
  const result = originalValue * (1 + percent / 100) + fixed;
  return parseFloat(result.toFixed(2));
}

export const SidebarSummary: React.FC<{ state: CalculatorState["parsed"]; contractStartDate: ISODate }> = ({ state, contractStartDate }) => {
  const { totals, monthlyBreakdown, concatenatedMonthlyBreakdown } = useMemo(() => {
    // const hasAdjustments = state.adjustements.length > 0;
    const adjustmentIsoDates = state.adjustements.map(({ increaseDate }) => increaseDate);
    const months = generatePaymentMonths(contractStartDate, state.contractLength, adjustmentIsoDates);
    const { monthlyBreakdown, totalMin, totalMax } = months.reduce(
      (acc: { monthlyBreakdown: MonthBreakdown[]; minCost: number; maxCost: number; totalMin: number; totalMax: number }, m) => {
        const adj = state.adjustements[m.billingIndex];
        const minCost = m.isIncreaseStartDate
          ? updateCost(acc.minCost, adj.staticPercentageIncrease + adj.rpiPercentagePredictionFrom, adj.staticCashIncrease)
          : acc.minCost;
        const maxCost = m.isIncreaseStartDate
          ? updateCost(acc.maxCost, adj.staticPercentageIncrease + adj.rpiPercentagePredictionTo, adj.staticCashIncrease)
          : acc.maxCost;
        const newValue = { ...m, minCost, maxCost, label: prettyDate(m.date, "MMMM y") };
        return {
          ...acc,
          monthlyBreakdown: [...acc.monthlyBreakdown, newValue],
          minCost,
          maxCost,
          totalMin: acc.totalMin + minCost,
          totalMax: acc.totalMax + maxCost,
        };
      },
      { monthlyBreakdown: [], minCost: state.monthlyCost, maxCost: state.monthlyCost, totalMin: 0, totalMax: 0 },
    );

    const grouped: MonthBreakdown[][] = monthlyBreakdown.reduce((acc, m) => {
      const index = m.billingIndex + 1;
      if (!acc[index]) {
        acc[index] = [];
      }
      acc[index].push(m);
      return acc;
    }, [] as MonthBreakdown[][]);

    const concatenatedMonthlyBreakdown: ConcatenatedMonthBreakdown[] = grouped.map((group) => {
      const first = group[0];
      if (!first) {
        console.warn("strange, very strange...");
      }
      const last = group.at(-1)!;
      const pattern = "MMM yy";
      const [totalMinCost, totalMaxCost] = group.reduce(([min, max], { minCost, maxCost }) => [min + minCost, max + maxCost], [0, 0]);
      return {
        ...first,
        label: prettyDate(first.date, pattern) + " - " + prettyDate(last.date, pattern),
        costDifference: Math.floor(first.maxCost - first.minCost),
        totalMinCost: Math.floor(totalMinCost),
        totalMaxCost: Math.floor(totalMaxCost),
        monthCount: group.length,
      };
    });

    return {
      monthlyBreakdown,
      concatenatedMonthlyBreakdown,
      totals: {
        minimum: totalMin + state.upfrontCost,
        maximum: totalMax + state.upfrontCost,
        guessOriginal: state.upfrontCost + state.monthlyCost * state.contractLength,
      },
    };
  }, [state, contractStartDate]);
  console.log({ monthlyBreakdown, concatenatedMonthlyBreakdown });
  const totalList = [
    { label: "Minimum", value: totals.minimum },
    { label: "Maximum", value: totals.maximum },
    {
      label: "Proclaimed",
      value: totals.guessOriginal,
      className: "opacity-60",
      tooltip: "TODO",
    },
  ];
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/35">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Calculation Oe31b70H
            <Button size="icon" variant="outline" className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy</span>
            </Button>
          </CardTitle>
          <CardDescription>Contract Start Date: {prettyDate(contractStartDate)}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="icon" variant="outline" className="h-8 w-8">
            <MoreVertical className="h-3.5 w-3.5" />
            <span className="sr-only">More</span>
          </Button>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Total cost over {state.contractLength} months</div>
          <ul className="grid gap-3">
            {totalList.map(({ label, value, className, tooltip }) => (
              <li key={label} className={classNames("flex items-center justify-between", className)}>
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  {label}
                  {tooltip && <Info className="h-3.5 w-3.5" />}
                </span>
                <Currency value={value} />
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="font-semibold">Monthly cost breakdown</div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/35 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime={contractStartDate}>{prettyDate(contractStartDate)}</time>
        </div>
        {/* <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </CardFooter>
    </Card>
  );
};
