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

/**
 * Calculate quantity in box based on volume string (e.g., "75cl", "70cl", "20cl") or number
 * Rules:
 * - 20cl-25cl -> 24 in doos
 * - 35cl-50cl -> 12 in doos
 * - 70cl-100cl -> 6 in doos
 * - 150cl-175cl -> 6 in doos (same as 70cl-100cl)
 */
/**
 * Convert volume string (e.g., "75cl", "0.7L") or number to liters (as number)
 */
export function parseVolumeToLiters(volume: string | number | undefined): number | undefined {
  if (!volume) return undefined;
  
  // Handle string format (e.g., "75cl", "70cl", "0.7L")
  if (typeof volume === 'string') {
    // Extract number from volume string (e.g., "75cl" -> 75)
    const match = volume.match(/(\d+(?:\.\d+)?)/);
    if (!match) return undefined;
    
    const value = parseFloat(match[1]);
    if (!Number.isFinite(value) || value <= 0) return undefined;
    
    // Check if it's in cl (centiliters) or L (liters)
    if (volume.toLowerCase().includes('l') && !volume.toLowerCase().includes('cl')) {
      // It's already in liters (e.g., "0.7L", "1.0L")
      return value;
    } else {
      // Assume it's in cl (centiliters) and convert to liters
      return value / 100;
    }
  } else {
    // Already a number, assume it's in liters
    if (!Number.isFinite(volume) || volume <= 0) return undefined;
    return volume;
  }
}

export function calculateQuantityInBoxFromVolume(volume: string | number | undefined): number {
  if (!volume) return 6; // Default fallback
  
  let liters: number;
  
  // Handle string format (e.g., "75cl", "70cl")
  if (typeof volume === 'string') {
    // Extract number from volume string (e.g., "75cl" -> 75)
    const match = volume.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 6; // Default fallback
    
    const cl = parseFloat(match[1]);
    if (!Number.isFinite(cl) || cl <= 0) return 6; // Default fallback
    
    // Convert to liters
    liters = cl / 100;
  } else {
    // Handle number format (already in liters, e.g., 0.75)
    liters = volume;
    if (!Number.isFinite(liters) || liters <= 0) return 6; // Default fallback
  }
  
  // Determine quantity in box based on volume ranges
  if (liters >= 0.20 && liters <= 0.25) {
    return 24;
  } else if (liters >= 0.35 && liters <= 0.50) {
    return 12;
  } else if (liters >= 0.70 && liters <= 1.0) {
    return 6;
  } else if (liters >= 1.5 && liters <= 1.75) {
    return 6; // Same as 70cl-100cl
  } else {
    // Default fallback for other volumes
    return 6;
  }
}