import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number in Indian notation (e.g., 1,50,000 instead of 150,000)
export function formatIndianCurrency(num: number): string {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum < 1000) {
    return sign + absNum.toString();
  }
  
  const numStr = Math.floor(absNum).toString();
  let result = '';
  
  // Last 3 digits
  result = numStr.slice(-3);
  let remaining = numStr.slice(0, -3);
  
  // Add pairs of digits with commas
  while (remaining.length > 0) {
    const chunk = remaining.slice(-2);
    remaining = remaining.slice(0, -2);
    result = chunk + ',' + result;
  }
  
  return sign + '₹' + result;
}
