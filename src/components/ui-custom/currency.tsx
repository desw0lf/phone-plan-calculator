import { useSettings } from "@/providers/settings-provider";
import { toCurrency } from "../../helpers/to-currency";

export const Currency: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const { currencySettings } = useSettings();
  if ("prefix" in currencySettings) {
    return (
      <span className={className}>
        {currencySettings.prefix}
        {toCurrency(value)}
      </span>
    );
  }
  return (
    <span className={className}>
      {toCurrency(value)} {currencySettings.suffix}
    </span>
  );
};
