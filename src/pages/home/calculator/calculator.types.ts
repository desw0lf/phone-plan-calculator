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
