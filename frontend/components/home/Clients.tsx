"use client";

import type { Client } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import Reveal from "@/components/Reveal";

export default function Clients({ clients }: { clients: Client[] }) {
  const { t } = useSite();
  if (!clients.length) return null;

  return (
    <section className="bg-surface-2 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="mb-12 text-center">
          <span className="label text-accent">{t("section.clients")}</span>
        </Reveal>
        <div className="grid grid-cols-2 items-center gap-x-8 gap-y-12 md:grid-cols-4">
          {clients.map((c, i) => (
            <Reveal key={c.id} delay={i * 50} className="text-center">
              {c.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.logo_url} alt={c.name} className="mx-auto h-10 w-auto opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0" />
              ) : (
                <span className="font-heading text-2xl text-ink/40 transition hover:text-accent">{c.name}</span>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
