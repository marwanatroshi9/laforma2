"use client";

import { motion } from "framer-motion";
import type { TeamMember } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function TeamGrid({ team }: { team: TeamMember[] }) {
  const { locale } = useSite();
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
            className="group"
          >
            <div className="media-zoom relative aspect-[3/4] overflow-hidden bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.photo_url} alt={m.name} className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0" loading="lazy" />
            </div>
            <h3 className="mt-5 font-heading text-2xl text-ink">{m.name}</h3>
            <p className="label mt-1 text-accent">{pick(m.position, locale)}</p>
            <p className="mt-3 text-sm text-ink/60">{pick(m.bio, locale)}</p>
            {m.social_links?.length > 0 && (
              <div className="mt-4 flex gap-4">
                {m.social_links.map((s) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" className="label text-ink/50 hover:text-accent">
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
