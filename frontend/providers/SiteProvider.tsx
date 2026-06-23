"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale, SiteSettings } from "@/lib/types";
import { dir, isRTL, tr } from "@/lib/i18n";

type Theme = "dark" | "light";

interface SiteContextValue {
  settings: SiteSettings | null;
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const SiteContext = createContext<SiteContextValue | null>(null);

const LOCALE_KEY = "arch_locale";
const THEME_KEY = "arch_theme";

export function SiteProvider({
  settings,
  children,
}: {
  settings: SiteSettings | null;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(settings?.default_locale || "en");
  const [theme, setTheme] = useState<Theme>(settings?.default_theme || "dark");

  // Hydrate from stored preferences.
  useEffect(() => {
    const storedLocale = localStorage.getItem(LOCALE_KEY) as Locale | null;
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    if (storedLocale) setLocaleState(storedLocale);
    if (storedTheme) setTheme(storedTheme);
  }, []);

  // Apply theme + direction + CSS variables to <html>.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("lang", locale);
    root.setAttribute("dir", dir(locale));

    if (settings) {
      const s = settings;
      root.style.setProperty("--color-accent", s.color_accent);
      root.style.setProperty(
        "--color-bg",
        theme === "dark" ? s.color_bg_dark : s.color_bg_light
      );
      root.style.setProperty(
        "--color-bg-2",
        theme === "dark" ? "#141416" : "#FFFFFF"
      );
      root.style.setProperty(
        "--color-text",
        theme === "dark" ? s.color_text_dark : s.color_text_light
      );
      root.style.setProperty(
        "--color-line",
        theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
      );
    }
  }, [theme, locale, settings]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const value = useMemo<SiteContextValue>(
    () => ({
      settings,
      locale,
      setLocale,
      theme,
      toggleTheme,
      t: (key: string) => tr(locale, key),
    }),
    [settings, locale, theme]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}

export { isRTL };
