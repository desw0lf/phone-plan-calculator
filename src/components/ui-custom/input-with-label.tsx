import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labels?: {
    prefix?: string;
    suffix?: string;
  };
}

const InputLabel: React.FC<{ label?: string }> = ({ label }) => {
  if (!label) {
    return null;
  }
  return <span className="flex items-center px-3 font-semibold bg-[--input-label] text-[--input-label-foreground]">{label}</span>;
};

const InputWithLabel = forwardRef<HTMLInputElement, InputProps>(({ className, type, labels = {}, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex [&>*]:h-full h-10 w-full items-center border border-input rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring",
        className,
      )}>
      <InputLabel label={labels.prefix} />
      <input
        type={type}
        className={cn(
          "flex flex-1 bg-background/40 text-sm focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          type === "number" ? "pl-3 pr-1" : "px-3",
        )}
        ref={ref}
        {...props}
      />
      <InputLabel label={labels.suffix} />
    </div>
  );
});

InputWithLabel.displayName = "InputWithLabel";

export { InputWithLabel };
