"use client";

import Link from "next/link";
import type { JobPosting } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function CareersList({ jobs }: { jobs: JobPosting[] }) {
  const { locale, t } = useSite();
  if (!jobs.length)
    return <p className="px-6 py-20 text-center text-ink/50 md:px-12">{t("careers.noPositions")}</p>;

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-[1600px] divide-y divide-line border-y border-line">
        {jobs.map((j, i) => (
          <Reveal key={j.id} delay={i * 60}>
            <Link href={`/careers/${j.slug}`} className="group flex items-center justify-between gap-6 py-8">
              <div>
                <h3 className="font-heading text-2xl text-ink transition-colors group-hover:text-accent md:text-4xl">
                  {pick(j.title, locale)}
                </h3>
                <p className="mt-2 text-sm text-ink/55">
                  {j.location} · <span className="capitalize">{j.employment_type}</span>
                </p>
              </div>
              <span className="label text-ink/40 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                {t("careers.applyNow")} →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
