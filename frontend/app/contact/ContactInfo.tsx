"use client";

import type { SiteSettings } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function ContactInfo({ settings }: { settings: SiteSettings | null }) {
  const { locale, t } = useSite();
  if (!settings) return null;
  return (
    <aside className="space-y-8 text-ink/70">
      {settings.email && (
        <div>
          <span className="label text-accent">{t("contact.email")}</span>
          <p className="mt-2">{settings.email}</p>
        </div>
      )}
      {settings.phone && (
        <div>
          <span className="label text-accent">{t("contact.phone")}</span>
          <p className="mt-2"><bdi>{settings.phone}</bdi></p>
        </div>
      )}
      {settings.address && (
        <div>
          <span className="label text-accent">{t("contact.studio")}</span>
          <p className="mt-2">{pick(settings.address, locale)}</p>
        </div>
      )}
    </aside>
  );
}
