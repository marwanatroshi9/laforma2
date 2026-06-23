"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useSite } from "@/providers/SiteProvider";
import { pick, LOCALE_NAMES } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";

const NAV = [
  ["nav.projects", "/projects"],
  ["nav.about", "/about"],
  ["nav.team", "/team"],
  ["nav.services", "/services"],
  ["nav.awards", "/awards"],
  ["nav.blog", "/blog"],
  ["nav.contact", "/contact"],
] as const;

export default function Navbar() {
  const { settings, locale, setLocale, theme, toggleTheme, t } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const name = pick(settings?.company_name, locale, "ARCHIPELAGO");
  const enabled = settings?.enabled_locales?.length ? settings.enabled_locales : LOCALES;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-surface/80 backdrop-blur-md border-b border-line" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <Link href="/" className="font-heading text-xl tracking-luxe uppercase text-ink">
            {settings?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo_url} alt={name} className="h-7 w-auto" />
            ) : (
              name
            )}
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {NAV.map(([key, href]) => (
              <Link
                key={href}
                href={href}
                className="label text-ink/70 transition-colors hover:text-accent"
              >
                {t(key)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 label text-ink/70 hover:text-accent"
                aria-label="Language"
              >
                <Globe size={15} /> {locale.toUpperCase()}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute end-0 mt-3 w-44 border border-line bg-surface-2 py-2 shadow-2xl"
                  >
                    {enabled.map((l) => (
                      <li key={l}>
                        <button
                          onClick={() => {
                            setLocale(l);
                            setLangOpen(false);
                          }}
                          className={`block w-full px-4 py-2 text-start text-sm hover:text-accent ${
                            l === locale ? "text-accent" : "text-ink/70"
                          }`}
                        >
                          {LOCALE_NAMES[l]}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <button onClick={toggleTheme} aria-label="Toggle theme" className="text-ink/70 hover:text-accent">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={() => setOpen(true)} className="text-ink lg:hidden" aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-surface px-8 py-8"
          >
            <div className="flex items-center justify-between">
              <span className="font-heading text-xl uppercase tracking-luxe">{name}</span>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={26} /></button>
            </div>
            <ul className="mt-16 flex flex-col gap-6">
              {NAV.map(([key, href], i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="font-heading text-4xl text-ink hover:text-accent"
                  >
                    {t(key)}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
