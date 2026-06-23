"use client";

import type { Service } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function Services({ services }: { services: Service[] }) {
  const { locale, t } = useSite();
  if (!services.length) return null;

  return (
    <section className="bg-surface-2 px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <span className="label text-accent">{t("section.services")}</span>
        </Reveal>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 60}>
              <div className="group flex flex-col gap-2 py-8 md:grid md:grid-cols-12 md:items-center md:gap-6 md:py-10">
                <span className="label text-ink/30 md:col-span-1">0{i + 1}</span>
                <h3 className="font-heading text-2xl text-ink transition-colors group-hover:text-accent sm:text-3xl md:col-span-4 md:text-4xl">
                  {pick(s.title, locale)}
                </h3>
                <p className="max-w-2xl text-ink/60 md:col-span-7">{pick(s.description, locale)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
