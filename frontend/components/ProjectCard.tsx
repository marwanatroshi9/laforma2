"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { locale } = useSite();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="media-zoom relative aspect-[4/5] overflow-hidden bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover_url}
            alt={pick(project.title, locale)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {project.category && (
            <span className="absolute start-4 top-4 label bg-black/40 px-3 py-1.5 text-white backdrop-blur-sm">
              {pick(project.category.name, locale)}
            </span>
          )}
        </div>
        <div className="mt-5 flex items-baseline justify-between">
          <div>
            <h3 className="font-heading text-2xl text-ink transition-colors group-hover:text-accent">
              {pick(project.title, locale)}
            </h3>
            <p className="mt-1 text-sm text-ink/55">
              {project.location}
              {project.year ? ` — ${project.year}` : ""}
            </p>
          </div>
          <span className="label text-ink/40 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
