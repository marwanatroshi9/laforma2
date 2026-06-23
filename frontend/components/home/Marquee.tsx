"use client";

import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function Marquee() {
  const { settings, locale } = useSite();
  const phrase = pick(settings?.tagline, locale, "Architecture · Interior · Masterplanning");
  const items = Array(6).fill(phrase);

  return (
    <section className="overflow-hidden border-y border-line py-8">
      <div className="marquee-track whitespace-nowrap">
        {[...items, ...items].map((p, i) => (
          <span key={i} className="mx-8 font-heading text-3xl uppercase tracking-luxe text-ink/30 md:text-5xl">
            {p} <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
