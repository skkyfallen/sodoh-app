import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function safeHref(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;

  const href = value.trim();
  if (!href) return fallback;
  if (href.startsWith("/") && !href.startsWith("//") && !href.includes("\\")) {
    return href;
  }

  try {
    const url = new URL(href);
    if (url.protocol === "https:" && url.hostname) return href;
    if ((url.protocol === "mailto:" || url.protocol === "tel:") && url.pathname) {
      return href;
    }
  } catch {
    // Invalid URLs fall back to a known-safe destination.
  }

  return fallback;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
