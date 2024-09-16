import { createContext, useContext, useState } from "react";
import { loadStorage, saveStorage } from "@/utils/localstorage";
import { startOfDay, formatISO } from "date-fns";

type SettingsProviderProps = {
  children: React.ReactNode;
  defaultCurrencySettings?: { prefix?: string; suffix?: string };
  storageKey?: string;
};

type SettingsProviderState = {
  currencySettings: { prefix: string } | { suffix: string };
  contractStartDate: ISODate;
  updateSettings: (newValues: Partial<Omit<SettingsProviderState, "currencySettings">> & { currencySymbol?: string }) => void;
};

const initialState = {
  currencySettings: { prefix: "£" },
  contractStartDate: formatISO(startOfDay(new Date())),
  updateSettings: () => null,
};

const SettingsProviderContext = createContext<SettingsProviderState>(initialState);

export function SettingsProvider({ children, defaultCurrencySettings = { prefix: "£" }, storageKey = "site-settings", ...props }: SettingsProviderProps) {
  const [{ currencySettings, contractStartDate }, setSettings] = useState(
    () =>
      loadStorage(storageKey, { currencySettings: defaultCurrencySettings, contractStartDate: initialState.contractStartDate }, true) as SettingsProviderState,
  );

  const simpleUpdateSettingsWithStorage = (newValues: Partial<SettingsProviderState>) => {
    setSettings((prev) => {
      const value = { ...prev, newValues };

      const { contractStartDate, ...valuesWithoutDate } = value;
      saveStorage(storageKey, valuesWithoutDate);
      return value;
    });
  };

  const updateSettingsWithStorage = (newValues: Partial<Omit<SettingsProviderState, "currencySettings">> & { currencySymbol?: string }) => {
    if (newValues.currencySymbol !== undefined) {
      const { currencySymbol, ...rest } = newValues;
      const key = currencySymbol.length <= 1 ? "prefix" : "suffix";
      const currencySettings: SettingsProviderState["currencySettings"] = { [key]: currencySymbol } as SettingsProviderState["currencySettings"];
      simpleUpdateSettingsWithStorage({ currencySettings, ...rest });
      return;
    }
    simpleUpdateSettingsWithStorage(newValues as Partial<SettingsProviderState>);
  };

  const value = {
    currencySettings,
    contractStartDate,
    updateSettings: updateSettingsWithStorage,
  };

  return (
    <SettingsProviderContext.Provider {...props} value={value}>
      {children}
    </SettingsProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsProviderContext);

  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};
