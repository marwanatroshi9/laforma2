"use client";

import Link from "next/link";
import { useSite } from "@/providers/SiteProvider";
import Reveal from "@/components/Reveal";

export default function ContactCTA() {
  const { t } = useSite();
  return (
    <section className="px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1600px] text-center">
        <Reveal>
          <h2 className="mx-auto max-w-4xl font-heading text-5xl leading-[1.05] text-ink md:text-8xl">
            {t("section.contact")}
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <Link
            href="/contact"
            className="group relative mt-12 inline-block overflow-hidden border border-line px-10 py-5 label text-ink"
          >
            <span className="relative z-10 transition-colors group-hover:text-black">
              {t("cta.contact")}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-luxe group-hover:translate-x-0 rtl:translate-x-full rtl:group-hover:translate-x-0" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
