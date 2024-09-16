import { parseISO, format } from "date-fns";

export const prettyDate = (dateOrIsoDate: ISODate | Date, pattern = "do MMMM y"): string => {
  return format(typeof dateOrIsoDate === "string" ? parseISO(dateOrIsoDate) : dateOrIsoDate, pattern);
};
