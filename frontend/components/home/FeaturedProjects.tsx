"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const { t } = useSite();
  if (!projects.length) return null;

  return (
    <section className="px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="label text-accent">{t("section.featured")}</span>
            <h2 className="mt-4 max-w-xl font-heading text-4xl leading-tight text-ink md:text-6xl">
              {t("section.featuredSub")}
            </h2>
          </div>
          <Link href="/projects" className="label text-ink/60 hover:text-accent">
            {t("cta.viewAll")} →
          </Link>
        </Reveal>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
