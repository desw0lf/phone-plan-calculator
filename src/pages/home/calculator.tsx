import { useSettings } from "@/providers/settings-provider";
import { SidebarSummary } from "@/components/sidebar-summary";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputWithLabel } from "@/components/ui-custom/input-with-label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

export const Calculator = () => {
  const { currencySettings } = useSettings();
  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-8">
      <form className="flex flex-col w-full gap-6 overflow-auto lg:col-span-5">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                <Label htmlFor="monthlyCost" className="max-w-40">
                  Monthly Cost
                </Label>
                <InputWithLabel labels={currencySettings} id="monthlyCost" name="monthlyCost" type="number" min={0} max={999} step={1} defaultValue={0} />
              </div>
              <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                <Label htmlFor="upfrontCost" className="max-w-40">
                  Upfront Cost
                </Label>
                <InputWithLabel labels={currencySettings} id="upfrontCost" name="upfrontCost" type="number" min={0} max={99999} step={10} defaultValue={0} />
              </div>
              <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                <Label htmlFor="contractLength" className="max-w-40">
                  Contract Length
                </Label>
                <span>.</span>
              </div>
              <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                <Label htmlFor="phoneValue" className="max-w-40 text-xs">
                  Phone Value
                </Label>
                <InputWithLabel className="h-8 my-1" labels={currencySettings} id="phoneValue" name="phoneValue" type="number" min={0} max={99999} step={10} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Price Adjustments</CardTitle>
            <CardDescription>Marshmallow powder cupcake dragée tiramisu liquorice gummies jelly.</CardDescription>
          </CardHeader>
          <CardContent>
            <fieldset className="grid gap-4 rounded-lg border p-4">
              <legend className="-ml-0.5 px-3 text-md font-medium">1</legend>
              <div className="grid gap-3">
                <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                  <Label htmlFor="staticPercentageIncrease" className="max-w-40">
                    % Increase
                  </Label>
                  <InputWithLabel
                    labels={{ suffix: "%" }}
                    id="staticPercentageIncrease"
                    name="staticPercentageIncrease"
                    type="number"
                    min={0}
                    max={999}
                    step={0.1}
                    defaultValue={3.9}
                  />
                </div>
                <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                  <Label htmlFor="rpiPercentagePredictionFrom" className="max-w-40">
                    RPI % Prediction
                  </Label>
                  <div className="flex items-center gap-2">
                    <InputWithLabel
                      labels={{ suffix: "%" }}
                      id="rpiPercentagePredictionFrom"
                      name="rpiPercentagePredictionFrom"
                      type="number"
                      min={0}
                      max={999}
                      step={0.1}
                      defaultValue={2}
                    />
                    <span>to</span>
                    <InputWithLabel
                      labels={{ suffix: "%" }}
                      id="rpiPercentagePredictionTo"
                      name="rpiPercentagePredictionTo"
                      type="number"
                      min={0}
                      max={999}
                      step={0.1}
                      defaultValue={11}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                  <Label htmlFor="staticCashIncrease" className="max-w-40">
                    Cash Increase
                  </Label>
                  <InputWithLabel
                    labels={currencySettings}
                    id="staticCashIncrease"
                    name="staticCashIncrease"
                    type="number"
                    min={0}
                    max={999}
                    step={0.1}
                    defaultValue={0}
                  />
                </div>
                <div className="flex flex-wrap gap-3 items-center [&>*]:grow [&>*]:w-auto">
                  <Label htmlFor="increaseDate" className="max-w-40">
                    Starting date
                  </Label>
                  <span>x</span>
                </div>
              </div>
            </fieldset>
            <footer className="mt-3">
              <Button type="button" className="gap-1 w-full" variant="ghost">
                <CirclePlus className="h-3.5 w-3.5" />
                Add Increase
              </Button>
            </footer>
          </CardContent>
        </Card>
      </form>
      <div className="lg:col-span-3">
        <SidebarSummary />
      </div>
    </main>
  );
};
