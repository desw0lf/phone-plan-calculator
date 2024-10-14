import { useReducer, useEffect } from "react";
import { formatISO, add, parseISO, isAfter, set } from "date-fns";
import { useSettings } from "@/providers/settings-provider";
import { SidebarSummary } from "./sidebar-summary";
import { CirclePlus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputWithLabel } from "@/components/ui-custom/input-with-label";
import { Currency } from "@/components/ui-custom/currency";
import { ContractSelect } from "./contract-select";
import { initialContractStartDate } from "../../../consts";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { generatePaymentMonths } from "@/helpers/generate-payment-months";
// ? TYPES:
import type { CalculatorChangeEvent, CalculatorState, PriceAdjustement } from "./calculator.types";

function generateUid() {
  return window.btoa(Math.random() + "".substring(0, 12));
}

function generateInitialIncreaseDates(startIsoDate: ISODate, contractLength: number, increaseMonthAndDay = { month: 3, date: 1 }): ISODate[] {
  const startDate = parseISO(startIsoDate);
  const thisYearIncreaseDate = set(startDate, increaseMonthAndDay);
  const firstYearOffset = isAfter(startDate, thisYearIncreaseDate) ? 1 : 0;
  const dateCount = Math.floor(contractLength / 12);
  console.log({ dateCount });
  return Array.from(Array(dateCount)).map((_, i) => formatISO(add(thisYearIncreaseDate, { years: i + firstYearOffset })));
}

function generateAdjustements(
  startIsoDate: ISODate,
  contractLength: number,
  state: Pick<CalculatorState, "adjustements"> & { parsed: Pick<CalculatorState["parsed"], "adjustements"> },
): { newAdjustements: CalculatorState["adjustements"]; newParsedAdjustements: CalculatorState["parsed"]["adjustements"] } {
  const isoDates = generateInitialIncreaseDates(startIsoDate, contractLength);
  const newAdjustements = isoDates.map((increaseDate, i) => {
    const newAdj = state.adjustements[i] || initialAdjustement;
    return {
      ...newAdj,
      uid: generateUid(),
      increaseDate,
    };
  });
  const newParsedAdjustements = isoDates.map((increaseDate, i) => {
    const newAdj = state.parsed.adjustements[i] || initialParsedAdjustement;
    return {
      ...newAdj,
      increaseDate,
    };
  });
  return { newAdjustements, newParsedAdjustements };
}

const act = {
  ON_CHANGE_VALUE: "ON_CHANGE_VALUE",
  ON_ADD_INCREASE: "ON_ADD_INCREASE",
  ON_REMOVE_INCREASE: "ON_REMOVE_INCREASE",
  ON_CONTRACT_START_DATE_CHANGE: "ON_CONTRACT_START_DATE_CHANGE",
} as const;

// type ActionType = keyof typeof act;

type Action =
  | { type: "ON_CHANGE_VALUE"; event: CalculatorChangeEvent; contractStartDate?: ISODate }
  | { type: "ON_ADD_INCREASE"; contractStartDate: ISODate }
  | { type: "ON_REMOVE_INCREASE"; i: number }
  | { type: "ON_CONTRACT_START_DATE_CHANGE"; contractStartDate: ISODate; initial?: boolean };

function limitValue(v: string | number, max: string) {
  // todo: fix deselect
  if (typeof v !== "string") {
    return v;
  }
  const value = v.startsWith("0") ? parseFloat(v) + "" : v;
  if (!max) {
    return value;
  }
  const maxZeroes = 4;
  const parsed = parseFloat(value);
  const [a, b] = value.split(".");
  const newValue = b === undefined ? a : a + "." + b.substring(0, maxZeroes);
  return parsed >= parseFloat(max) ? parseFloat(value.substring(0, max.length)) + "" : newValue;
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  if (action.type === act.ON_CHANGE_VALUE) {
    const { name, value: rawValue, max } = action.event.target;
    const value = limitValue(rawValue, max);
    const [key, adjustementIndexStr] = name.split("@");
    const parsedValue = value === "" ? 0 : parseFloat(value as string);
    if (adjustementIndexStr === undefined) {
      return {
        ...state,
        [key]: value,
        parsed: {
          ...state.parsed,
          [key]: parsedValue,
        },
      };
    }
    const index = parseInt(adjustementIndexStr, 10);
    const newAdjustements = state.adjustements.map((adj, i) => (index === i ? { ...adj, [key]: value } : adj));
    const newParsedAdjustements = state.parsed.adjustements.map((adj, i) => (index === i ? { ...adj, [key]: parsedValue } : adj));
    return {
      ...state,
      adjustements: newAdjustements,
      parsed: {
        ...state.parsed,
        adjustements: newParsedAdjustements,
      },
    };
  }
  if (action.type === act.ON_ADD_INCREASE) {
    const isEmpty = state.adjustements.length === 0;
    const startIsoDate = isEmpty ? action.contractStartDate : state.adjustements.at(-1)!.increaseDate;
    const [increaseDate] = isEmpty ? generateInitialIncreaseDates(startIsoDate, state.contractLength) : [formatISO(add(parseISO(startIsoDate), { years: 1 }))];
    if (!increaseDate) {
      console.warn("fml how did this happen");
      return state;
    }
    const prevAdjustement = isEmpty ? initialAdjustement : state.adjustements.at(-1)!;
    const prevParsedAdjustement = isEmpty ? initialParsedAdjustement : state.parsed.adjustements.at(-1)!;
    return {
      ...state,
      adjustements: [...state.adjustements, { ...prevAdjustement, uid: generateUid(), increaseDate }],
      parsed: {
        ...state.parsed,
        adjustements: [...state.parsed.adjustements, { ...prevParsedAdjustement, increaseDate }],
      },
    };
  }
  if (action.type === act.ON_REMOVE_INCREASE) {
    const newAdjustements = state.adjustements.filter((_adj, i) => action.i !== i);
    const newParsedAdjustements = state.parsed.adjustements.filter((_adj, i) => action.i !== i);
    return {
      ...state,
      adjustements: newAdjustements,
      parsed: {
        ...state.parsed,
        adjustements: newParsedAdjustements,
      },
    };
  }
  if (action.type === act.ON_CONTRACT_START_DATE_CHANGE) {
    if (!action.initial && state.adjustements.length === 0) {
      console.log({ action });
      return state;
    }
    const { newAdjustements, newParsedAdjustements } = generateAdjustements(action.contractStartDate, state.contractLength, state);
    return {
      ...state,
      adjustements: newAdjustements,
      parsed: {
        ...state.parsed,
        adjustements: newParsedAdjustements,
      },
    };
  }
  return state;
}

const dispatchMiddleware = (dispatch: React.Dispatch<Action>) => (action: Action) => {
  if (action.type === "ON_CHANGE_VALUE") {
    dispatch(action);
    if (action.contractStartDate) {
      dispatch({ type: "ON_CONTRACT_START_DATE_CHANGE", contractStartDate: action.contractStartDate });
    }
  } else {
    dispatch(action);
  }
};

const initialParsedAdjustement: PriceAdjustement<number, string | undefined> = {
  staticPercentageIncrease: 3.9,
  rpiPercentagePredictionFrom: 2,
  rpiPercentagePredictionTo: 11,
  staticCashIncrease: 0,
  increaseDate: "",
  uid: undefined,
};

const initialAdjustement: PriceAdjustement = {
  staticPercentageIncrease: initialParsedAdjustement.staticPercentageIncrease + "",
  rpiPercentagePredictionFrom: initialParsedAdjustement.rpiPercentagePredictionFrom + "",
  rpiPercentagePredictionTo: initialParsedAdjustement.rpiPercentagePredictionTo + "",
  staticCashIncrease: initialParsedAdjustement.staticCashIncrease + "",
  increaseDate: initialParsedAdjustement.increaseDate,
  uid: "",
};

const { newAdjustements, newParsedAdjustements } = generateAdjustements(initialContractStartDate, 24, { adjustements: [], parsed: { adjustements: [] } });

const initialParsed: CalculatorState["parsed"] = {
  monthlyCost: 0,
  upfrontCost: 0,
  contractLength: 24,
  phoneValue: 0,
  adjustements: newParsedAdjustements,
};

const initialState: CalculatorState = {
  monthlyCost: initialParsed.monthlyCost + "",
  upfrontCost: initialParsed.upfrontCost + "",
  contractLength: 24,
  phoneValue: "",
  adjustements: newAdjustements,
  parsed: initialParsed,
};

const SmallLabelHack = () => (
  <span className="text-sm leading-none invisible" aria-hidden="true">
    .
  </span>
);

export const Calculator = () => {
  const { currencySettings, contractStartDate } = useSettings();
  const [state, dispatch] = useReducer(reducer, initialState);
  const customDispatch = dispatchMiddleware(dispatch);
  useEffect(() => {
    dispatch({ type: "ON_CONTRACT_START_DATE_CHANGE", contractStartDate, initial: true });
  }, [contractStartDate]);
  const onValueChange = (event: CalculatorChangeEvent) => {
    customDispatch({ type: act.ON_CHANGE_VALUE, event, contractStartDate });
  };
  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-8 [&_.input-currency_input]:max-w-[76px] [&_.input-percent_input]:max-w-[66px]">
      <form className="flex flex-col w-full gap-4 overflow-auto lg:col-span-5">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex gap-3 flex-wrap">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="monthlyCost">Monthly Cost</Label>
                  <InputWithLabel
                    className="input-currency"
                    autoFocus
                    labels={currencySettings}
                    id="monthlyCost"
                    name="monthlyCost"
                    type="number"
                    min={0}
                    max={999}
                    step={1}
                    value={state.monthlyCost}
                    onChange={onValueChange}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="upfrontCost">Upfront Cost</Label>
                  <InputWithLabel
                    className="input-currency"
                    labels={currencySettings}
                    id="upfrontCost"
                    name="upfrontCost"
                    type="number"
                    min={0}
                    max={99999}
                    step={10}
                    value={state.upfrontCost}
                    onChange={onValueChange}
                  />
                </div>
                <div className="flex flex-col gap-3 flex-grow">
                  <Label htmlFor="contractLength">Contract Length</Label>
                  <ContractSelect value={state.contractLength} onValueChange={onValueChange} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="phoneValue" className="text-xs leading-none text-muted-foreground">
                    Phone Value
                    <SmallLabelHack />
                  </Label>
                  <InputWithLabel
                    className="input-currency h-8"
                    labels={currencySettings}
                    id="phoneValue"
                    name="phoneValue"
                    type="number"
                    min={0}
                    max={99999}
                    step={10}
                    value={state.phoneValue}
                    onChange={onValueChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Adjustments</CardTitle>
            <CardDescription>
              Factor in future price increases to your monthly bill. Add known percentage hikes and estimate ranges for uncertain increases. This helps
              calculate a more accurate total cost over your contract's lifetime.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {state.adjustements.length === 0 && (
              <p className="text-muted-foreground mb-6">
                No adjustments...{" "}
                {state.parsed.monthlyCost > 0 && (
                  <span>
                    You really don't need this calculator then.
                    <br />
                    It's just Monthly Cost (
                    <Currency className="text-foreground" value={state.parsed.monthlyCost} />) x Contract Length (
                    <span className="text-foreground">{state.contractLength}</span>)
                    {state.parsed.upfrontCost > 0 && (
                      <>
                        {" "}
                        + Upfront Cost (
                        <Currency className="text-foreground" value={state.parsed.upfrontCost} />)
                      </>
                    )}{" "}
                    ={" "}
                    <Currency
                      className="text-foreground font-medium"
                      value={state.parsed.upfrontCost + state.parsed.monthlyCost * state.parsed.contractLength}
                    />
                  </span>
                )}
              </p>
            )}
            {state.adjustements.map((adj, i) => (
              <fieldset key={adj.uid} className="relative grid gap-4 rounded-lg border p-4">
                <legend className="-ml-0.5 px-3 text-md font-medium text-[--input-label-foreground]">Increase {i + 1}</legend>
                <div className="grid gap-3">
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex flex-col gap-3">
                      <Label htmlFor={`staticPercentageIncrease@${i}`}>% Increase</Label>
                      <InputWithLabel
                        className="input-percent"
                        labels={{ suffix: "%" }}
                        id={`staticPercentageIncrease@${i}`}
                        name={`staticPercentageIncrease@${i}`}
                        type="number"
                        min={0}
                        max={999}
                        step={0.1}
                        value={adj.staticPercentageIncrease}
                        onChange={onValueChange}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor={`rpiPercentagePredictionFrom@${i}`}>
                        RPI % Prediction <span className="text-xs leading-none text-muted-foreground ml-2 opacity-80">(From - To)</span>
                      </Label>
                      <div className="flex items-center">
                        <InputWithLabel
                          placeholder="From"
                          className="input-percent border-r-0 rounded-r-none"
                          labels={{ suffix: "%" }}
                          id={`rpiPercentagePredictionFrom@${i}`}
                          name={`rpiPercentagePredictionFrom@${i}`}
                          type="number"
                          min={0}
                          max={999}
                          step={0.1}
                          value={adj.rpiPercentagePredictionFrom}
                          onChange={onValueChange}
                        />
                        <span className="flex items-center px-2 font-semibold bg-background/40 text-[--input-label-foreground] h-10 border-y border-input">
                          -
                        </span>
                        <InputWithLabel
                          placeholder="To"
                          className="input-percent border-l-0 rounded-l-none"
                          labels={{ suffix: "%" }}
                          id={`rpiPercentagePredictionTo@${i}`}
                          name={`rpiPercentagePredictionTo@${i}`}
                          type="number"
                          min={0}
                          max={999}
                          step={0.1}
                          value={adj.rpiPercentagePredictionTo}
                          onChange={onValueChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor={`staticCashIncrease@${i}`}>Cash Increase</Label>
                      <InputWithLabel
                        className="input-currency"
                        labels={currencySettings}
                        id={`staticCashIncrease@${i}`}
                        name={`staticCashIncrease@${i}`}
                        type="number"
                        min={0}
                        max={999}
                        step={0.1}
                        value={adj.staticCashIncrease}
                        onChange={onValueChange}
                      />
                    </div>
                    <div className="flex flex-col gap-3 min-[1686px]:ml-auto">
                      <Label htmlFor={`increaseDate@${i}`} className="text-xs leading-none text-muted-foreground">
                        Starting date
                        <SmallLabelHack />
                      </Label>
                      <span>{adj.increaseDate.substring(0, 10)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute right-0 top-2/4 translate-x-2/4 -translate-y-2/4 rounded-full h-6 w-6 text-red-600 hover:text-red-600"
                  onClick={() => dispatch({ type: act.ON_REMOVE_INCREASE, i })}>
                  <Minus className="h-3.5 w-3.5" />
                  <span className="sr-only">Remove Increase</span>
                </Button>
              </fieldset>
            ))}
            <footer>
              <Button
                type="button"
                className="gap-1 w-full text-green-600 hover:text-green-600 hover:bg-green-600/5"
                variant="ghost"
                onClick={() => dispatch({ type: act.ON_ADD_INCREASE, contractStartDate })}>
                <CirclePlus className="h-3.5 w-3.5" />
                Add Increase
              </Button>
            </footer>
          </CardContent>
        </Card>
      </form>
      <div className="lg:col-span-3">
        <SidebarSummary state={state.parsed} contractStartDate={contractStartDate} />
      </div>
    </main>
  );
};
