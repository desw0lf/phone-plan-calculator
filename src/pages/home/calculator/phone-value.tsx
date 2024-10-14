import { useSettings } from "@/providers/settings-provider";
import { ChartCandlestick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger, PopoverArrow } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InputWithLabel } from "@/components/ui-custom/input-with-label";
// ? TYPES:
import { CalculatorChangeEvent } from "./calculator.types";

// todo

export const PhoneValue: React.FC<{ value: string | number; onChange: (event: CalculatorChangeEvent) => void }> = ({ value, onChange }) => {
  const { currencySettings } = useSettings();
  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger asChild>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" className="h-6 w-6 -my-2 -mt-1">
              <ChartCandlestick className="h-3.5 w-3.5" />
              <span className="sr-only">Phone Value Settings</span>
            </Button>
          </TooltipTrigger>
        </PopoverTrigger>
        <TooltipContent className="text-xs">Cost Settings</TooltipContent>
      </Tooltip>
      <PopoverContent side="right" align="start" className="flex flex-col gap-4 w-60">
        <div className="flex flex-row items-center gap-4">
          <Label htmlFor="phoneValue" className="text-xs leading-none text-muted-foreground shrink-0">
            Phone Value
          </Label>
          <InputWithLabel
            // autoFocus={!value}
            className="input-currency h-8"
            labels={currencySettings}
            id="phoneValue"
            name="phoneValue"
            type="number"
            min={0}
            max={99999}
            step={10}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch disabled={!value} id="exclude-phone-value" className="h-4 w-9" thumbSize="h-3 w-3" />
          <Label className="cursor-pointer" htmlFor="exclude-phone-value">
            Subtract from total
          </Label>
        </div>
        <PopoverArrow className="popover__arrow" />
      </PopoverContent>
    </Popover>
  );
};
