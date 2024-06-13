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

export const formatNumberWithCommaDecimalSeparator = (number: number) => {
  return new Intl.NumberFormat("de", { minimumFractionDigits: 1 }).format(number);
};