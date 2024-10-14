import { startOfDay, formatISO } from "date-fns";

export const initialContractStartDate = formatISO(startOfDay(new Date()));
