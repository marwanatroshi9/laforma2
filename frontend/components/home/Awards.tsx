"use client";

import type { Award } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function Awards({ awards }: { awards: Award[] }) {
  const { locale, t } = useSite();
  if (!awards.length) return null;

  return (
    <section className="px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <span className="label text-accent">{t("section.awards")}</span>
        </Reveal>
        <div className="mt-12 space-y-2">
          {awards.map((a, i) => (
            <Reveal key={a.id} delay={i * 50}>
              <div className="flex flex-col gap-1 border-b border-line py-6 md:flex-row md:items-baseline md:gap-6 md:py-7">
                <span className="font-heading text-xl text-ink sm:text-2xl md:text-3xl">{pick(a.title, locale)}</span>
                <span className="hidden flex-1 border-b border-dotted border-line/60 md:block" />
                <div className="flex items-baseline justify-between gap-4 md:contents">
                  <span className="text-sm text-ink/60">{a.organization}</span>
                  <span className="label text-accent">{a.year}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
