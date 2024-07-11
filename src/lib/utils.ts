import { type ClassValue, clsx } from "clsx";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatDateToLocal = (dateStr: string, locale: string = "en-US") => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const navigateTo = (navigation: AppRouterInstance, value: string) => {
  navigation.push(value);
};

export const formatNumberWithCommaDecimalSeparator = (number: number): string => {
  // Format the number with the "de" locale to ensure commas are used as thousand separators
  let formattedNumber = new Intl.NumberFormat("de", { minimumFractionDigits: 1 }).format(number);

  // Split the formatted number to separate the integer and decimal parts
  const parts = formattedNumber.split(",");

  // Determine if the decimal part is zero
  const isDecimalZero = parts[1]?.length === 0 || parts[1] === "0";

  const isDecimalOneDigit = parts[1]?.length === 1
  // Adjust the formatted number based on whether the decimal part is zero
  if (isDecimalZero) {
    // If the decimal part is zero, replace it with ",-" to meet the requirement
    formattedNumber = `${parts[0]},-`;
  } else if (isDecimalOneDigit) {
    // Otherwise, ensure there is a zero after the decimal point
    formattedNumber += "0";
  }

  return formattedNumber;
};