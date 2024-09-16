export interface PriceAdjustement<TNumberInput = string | "", T2UID = string> {
  staticPercentageIncrease: TNumberInput;
  rpiPercentagePredictionFrom: TNumberInput;
  rpiPercentagePredictionTo: TNumberInput;
  staticCashIncrease: TNumberInput;
  increaseDate: ISODate;
  uid: T2UID;
}

export interface CalculatorState<TNumberInput = string | "", T2UID = string> {
  monthlyCost: TNumberInput;
  upfrontCost: TNumberInput;
  contractLength: 12 | 24 | 32 | (number & {});
  phoneValue: TNumberInput;
  adjustements: PriceAdjustement<TNumberInput, T2UID>[];
  parsed: Omit<CalculatorState<number, string | undefined>, "parsed">;
}

export interface InitialMonthBreakdown {
  date: Date;
  billingIndex: number;
  isIncreaseStartDate?: boolean;
}

export interface MonthBreakdown extends InitialMonthBreakdown {
  minCost: number;
  maxCost: number;
  label: string;
}

export interface ConcatenatedMonthBreakdown extends MonthBreakdown {
  totalMinCost: number;
  totalMaxCost: number;
  costDifference: number;
  monthCount: number;
}

export type CalculatorChangeEvent = { target: Pick<React.ChangeEvent<HTMLInputElement>["target"], "value" | "name" | "max"> };
