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
  let formattedNumber = new Intl.NumberFormat("de", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(number);

  // Split the formatted number to separate the integer and decimal parts
  const parts = formattedNumber.split(",");

  // Determine if the decimal part is zero
  const isDecimalZero = parts[1]?.length === 0 || parts[1] === "0";

  // Adjust the formatted number based on whether the decimal part is zero
  if (isDecimalZero) {
    // If the decimal part is zero, replace it with ",-" to meet the requirement
    formattedNumber = `${parts[0]},-`;
  } else if (parts[1]?.length === 1) {
    // If there's only one digit after the comma, add a zero
    formattedNumber += "0";
  }

  return formattedNumber;
};

export const formatCurrencyTwo = (value: number) => `€ ${value.toFixed(2)}`;

export const getCurrentFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // JavaScript months are 0-based.
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}