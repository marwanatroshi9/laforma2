"use client";

import Link from "next/link";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function Footer() {
  const { settings, locale, t } = useSite();
  const name = pick(settings?.company_name, locale, "ARCHIPELAGO");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface px-6 py-16 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-heading text-3xl uppercase tracking-luxe text-ink">{name}</h3>
            <p className="mt-4 max-w-sm text-sm text-ink/60">
              {pick(settings?.tagline, locale, "")}
            </p>
          </div>

          <div>
            <p className="label mb-4 text-accent">{t("nav.contact")}</p>
            <ul className="space-y-2 text-sm text-ink/70">
              {settings?.email && <li>{settings.email}</li>}
              {settings?.phone && <li><bdi>{settings.phone}</bdi></li>}
              {settings?.address && <li>{pick(settings.address, locale, "")}</li>}
            </ul>
          </div>

          <div>
            <p className="label mb-4 text-accent">Social</p>
            <ul className="space-y-2 text-sm text-ink/70">
              {(settings?.social_links || []).map((s) => (
                <li key={s.platform}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="capitalize hover:text-accent">
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-ink/50 md:flex-row md:items-center">
          <span>© {year} {name}. {t("footer.rights")}.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
