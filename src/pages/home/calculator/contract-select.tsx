import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import React from "react";
// ? TYPES:
import { CalculatorChangeEvent } from "./calculator.types";

interface ContractSelectProps {
  value: number;
  onValueChange: (event: CalculatorChangeEvent) => void;
}

export const ContractSelect: React.FC<ContractSelectProps> = ({ value, onValueChange }) => {
  const list = [{ value: 12 }, { value: 24 }, { value: 36 }];
  const onChange = (v: number) => {
    onValueChange({ target: { name: "contractLength", value: v as unknown as string, max: "" } });
  };
  return (
    <RadioGroup value={value as unknown as string} onValueChange={onChange as any} className="grid grid-cols-3 gap-4">
      {list.map((item) => (
        <div key={item.value}>
          <RadioGroupItem value={item.value as unknown as string} id={`length_${item.value}`} className="peer sr-only" />
          <Label
            htmlFor={`length_${item.value}`}
            className="leading-relaxed flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
            <span className="text-xl">{item.value}</span>
            <span>months</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
