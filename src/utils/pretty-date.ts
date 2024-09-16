import { parseISO, format } from "date-fns";

export const prettyDate = (dateOrIsoDate: ISODate | Date, pattern = "do MMMM y"): string => {
  return format(typeof dateOrIsoDate === "string" ? parseISO(dateOrIsoDate) : dateOrIsoDate, pattern);
};

export const prettyRange = (dateOrIsoDates: [ISODate | Date, ISODate | Date], pattern = "MMM yy"): string => {
  return prettyDate(dateOrIsoDates[0], pattern) + " - " + prettyDate(dateOrIsoDates[1], pattern);
};
