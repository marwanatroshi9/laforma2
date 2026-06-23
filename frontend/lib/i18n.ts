import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import kmr from "@/messages/kmr.json";
import type { I18nText, Locale } from "./types";

export const LOCALES: Locale[] = ["en", "ar", "kmr"];
export const RTL_LOCALES: Locale[] = ["ar"];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  kmr: "Kurdî (Badînî)",
};

const dictionaries: Record<Locale, Record<string, string>> = { en, ar, kmr };

export function isRTL(locale: Locale) {
  return RTL_LOCALES.includes(locale);
}

export function dir(locale: Locale) {
  return isRTL(locale) ? "rtl" : "ltr";
}

/** Resolve a UI string key for a locale, falling back to English then the key. */
export function tr(locale: Locale, key: string): string {
  return dictionaries[locale]?.[key] ?? dictionaries.en?.[key] ?? key;
}

/** Pick the right language out of a multilingual content field. */
export function pick(field: I18nText | undefined, locale: Locale, fallback = ""): string {
  if (!field) return fallback;
  return field[locale] || field.en || Object.values(field)[0] || fallback;
}
