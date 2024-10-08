import { isAfter, parseISO, add } from "date-fns";
// ? TYPES:
import type { InitialMonthBreakdown } from "../pages/home/calculator/calculator.types";

export function generatePaymentMonths(startDate: ISODate, contractLength: number, adjustementDates: ISODate[]): InitialMonthBreakdown[] {
  const beginDate = parseISO(startDate);
  const increaseDates = adjustementDates.map((d) => parseISO(d));
  const { months } = Array.from(Array(contractLength)).reduce(
    (acc, _, i) => {
      const date = add(beginDate, { months: i });
      const nextIndex = acc.billingIndex + 1;
      const isIncreaseStartDate = isAfter(date, increaseDates[nextIndex]);
      const billingIndex = isIncreaseStartDate ? nextIndex : acc.billingIndex;
      return {
        ...acc,
        months: [
          ...acc.months,
          {
            date,
            billingIndex,
            isIncreaseStartDate,
          },
        ],
        billingIndex,
      };
    },
    { months: [], billingIndex: -1 },
  );
  return months;
}
