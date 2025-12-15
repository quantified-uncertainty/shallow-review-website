import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the main part of a name (before parentheses)
 * "Labs (giant companies)" -> "Labs"
 * "Black-box safety" -> "Black-box safety"
 */
export function getNameWithoutParentheses(name: string): string {
  if (!name.includes('(')) return name;
  return name.split('(')[0].trim();
}

/**
 * Extracts the parenthetical part of a name (including parentheses)
 * "Labs (giant companies)" -> "(giant companies)"
 * "Black-box safety" -> null
 */
export function getParentheticalPart(name: string): string | null {
  if (!name.includes('(')) return null;
  const idx = name.indexOf('(');
  return name.slice(idx);
}
