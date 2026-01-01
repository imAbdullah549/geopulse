import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FormatDateTimeOptions = Intl.DateTimeFormatOptions;

/**
 * Safe date-time formatter for tables/UI.
 * Returns "—" for empty/invalid values.
 */
export function formatDateTime(
  value?: string | number | Date | null,
  options: FormatDateTimeOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }
) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, options).format(date);
}
