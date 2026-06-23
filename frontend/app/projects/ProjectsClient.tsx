"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Category, Project } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsClient({
  projects,
  categories,
}: {
  projects: Project[];
  categories: Category[];
}) {
  const { locale, t } = useSite();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const inCat = active === "all" || p.category?.slug === active;
      const q = query.trim().toLowerCase();
      const inQuery =
        !q ||
        pick(p.title, locale).toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.category && pick(p.category.name, locale).toLowerCase().includes(q));
      return inCat && inQuery;
    });
  }, [projects, active, query, locale]);

  return (
    <div className="px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <div className="mx-auto max-w-[1600px]">
        <header className="mb-16">
          <span className="label text-accent">{t("nav.projects")}</span>
          <h1 className="mt-4 font-heading text-5xl text-ink md:text-8xl">{t("section.featured")}</h1>
        </header>

        {/* Controls */}
        <div className="mb-14 flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <FilterBtn label={t("common.all")} active={active === "all"} onClick={() => setActive("all")} />
            {categories.map((c) => (
              <FilterBtn
                key={c.slug}
                label={pick(c.name, locale)}
                active={active === c.slug}
                onClick={() => setActive(c.slug)}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 border-b border-line pb-2 md:w-72">
            <Search size={16} className="text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.search")}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-24 text-center text-ink/50">{t("common.noResults")}</p>
        ) : (
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`label transition-colors ${active ? "text-accent" : "text-ink/50 hover:text-ink"}`}
    >
      {label}
    </button>
  );
}
