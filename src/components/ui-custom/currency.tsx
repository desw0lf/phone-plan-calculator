import { useSettings } from "@/providers/settings-provider";
import { toCurrency } from "../../helpers/to-currency";

export const Currency: React.FC<{ value: number }> = ({ value }) => {
  const { currencySettings } = useSettings();
  if ("prefix" in currencySettings) {
    return (
      <span>
        {currencySettings.prefix}
        {toCurrency(value)}
      </span>
    );
  }
  return (
    <span>
      {toCurrency(value)} {currencySettings.suffix}
    </span>
  );
};
