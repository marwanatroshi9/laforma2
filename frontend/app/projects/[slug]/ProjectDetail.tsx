"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import BeforeAfter from "@/components/BeforeAfter";

export default function ProjectDetail({
  project,
  related,
}: {
  project: Project;
  related: Project[];
}) {
  const { locale, t } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  const meta: [string, string][] = [
    [t("project.location"), project.location],
    [t("project.year"), project.year ? String(project.year) : "—"],
    [t("project.area"), project.area_sqm ? `${project.area_sqm} m²` : "—"],
    [t("project.client"), project.client_name || "—"],
  ];

  return (
    <article>
      {/* Hero */}
      <section ref={ref} className="relative h-[100svh] overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.hero_url || project.cover_url} alt={pick(project.title, locale)} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 md:px-12">
          {project.category && <span className="label text-white/70">{pick(project.category.name, locale)}</span>}
          <h1 className="mt-4 font-heading text-[clamp(3rem,8vw,7rem)] leading-none text-white">
            {pick(project.title, locale)}
          </h1>
        </div>
      </section>

      {/* Meta + description */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-8 self-start lg:grid-cols-1">
            {meta.map(([label, value]) => (
              <div key={label} className="border-t border-line pt-4">
                <span className="label text-ink/50">{label}</span>
                <p className="mt-1 text-lg text-ink">{value}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Reveal>
              <p className="font-heading text-3xl leading-snug text-ink md:text-4xl">
                {pick(project.subtitle, locale)}
              </p>
              <p className="mt-8 max-w-2xl leading-relaxed text-ink/70">
                {pick(project.description, locale)}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Video */}
      {project.video_url && (
        <section className="px-6 md:px-12">
          <div className="mx-auto max-w-[1600px]">
            <video className="aspect-video w-full object-cover" src={project.video_url} controls playsInline />
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
          {project.media.map((m, i) =>
            m.kind === "before_after" ? (
              <BeforeAfter key={m.id} before={m.url} after={m.url_secondary} />
            ) : m.kind === "video" ? (
              <video key={m.id} className="w-full" src={m.url} controls playsInline />
            ) : (
              <Reveal key={m.id} delay={(i % 2) * 80} className="media-zoom overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={pick(m.caption, locale)} className="w-full object-cover" loading="lazy" />
              </Reveal>
            )
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-6 py-28 md:px-12">
          <div className="mx-auto max-w-[1600px]">
            <h2 className="mb-12 font-heading text-4xl text-ink md:text-5xl">{t("project.related")}</h2>
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-3">
              {related.slice(0, 3).map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
            <Link href="/projects" className="label mt-16 inline-block text-ink/60 hover:text-accent">
              ← {t("cta.viewAll")}
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
