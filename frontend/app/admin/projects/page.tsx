"use client";

import { useEffect, useState } from "react";
import type { Category, Project } from "@/lib/types";
import { admin } from "@/lib/admin";
import { pick } from "@/lib/i18n";
import { Button, Card, PageTitle, useToast } from "@/components/admin/ui";
import ProjectEditor from "./ProjectEditor";

export default function ProjectsAdmin() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    const [p, c] = await Promise.all([
      admin.get<Project[]>("/projects?include_unpublished=true"),
      admin.get<Category[]>("/projects/categories"),
    ]);
    setProjects(p);
    setCategories(c);
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(id: number) {
    if (!confirm("Delete this project?")) return;
    await admin.del(`/projects/${id}`);
    toast("Project deleted");
    load();
  }

  if (editing || creating) {
    return (
      <ProjectEditor
        project={editing}
        categories={categories}
        onClose={() => {
          setEditing(null);
          setCreating(false);
        }}
        onSaved={() => {
          setEditing(null);
          setCreating(false);
          load();
        }}
      />
    );
  }

  return (
    <div>
      <PageTitle
        title="Projects"
        subtitle={`${projects.length} projects`}
        action={<Button onClick={() => setCreating(true)}>+ New project</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className="p-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.cover_url} alt="" className="aspect-video w-full object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl text-ink">{pick(p.title, "en")}</h3>
                {p.is_featured && <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] text-accent">Featured</span>}
                {!p.is_published && <span className="rounded bg-ink/10 px-2 py-0.5 text-[10px] text-ink/50">Draft</span>}
              </div>
              <p className="mt-1 text-xs text-ink/50">{p.location} · {p.year}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="ghost" onClick={() => setEditing(p)} className="flex-1">Edit</Button>
                <Button variant="danger" onClick={() => remove(p.id)}>Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
