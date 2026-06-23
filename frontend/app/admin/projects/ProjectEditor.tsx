"use client";

import { useState } from "react";
import type { Category, Project, ProjectMedia } from "@/lib/types";
import { admin } from "@/lib/admin";
import {
  Button,
  Card,
  Field,
  Input,
  MediaPicker,
  MultiLang,
  PageTitle,
  Select,
  useToast,
} from "@/components/admin/ui";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const EMPTY: Partial<Project> = {
  slug: "",
  title: {},
  subtitle: {},
  description: {},
  cover_url: "",
  hero_url: "",
  video_url: "",
  location: "",
  client_name: "",
  status: "completed",
  stats: [],
  media: [],
  is_featured: false,
  is_published: true,
};

export default function ProjectEditor({
  project,
  categories,
  onClose,
  onSaved,
}: {
  project: Project | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [p, setP] = useState<any>(project ? { ...project } : { ...EMPTY });
  const [media, setMedia] = useState<ProjectMedia[]>(project?.media || []);
  const [saving, setSaving] = useState(false);

  function set(key: string, value: any) {
    setP((prev: any) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        slug: p.slug || slugify(p.title?.en || `project-${Date.now()}`),
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        category_id: p.category_id ?? p.category?.id ?? null,
        cover_url: p.cover_url,
        hero_url: p.hero_url,
        video_url: p.video_url,
        location: p.location,
        year: p.year ? Number(p.year) : null,
        area_sqm: p.area_sqm ? Number(p.area_sqm) : null,
        client_name: p.client_name,
        status: p.status,
        stats: p.stats || [],
        is_featured: !!p.is_featured,
        is_published: !!p.is_published,
        order: p.order || 0,
      };
      let saved: Project;
      if (project) {
        saved = await admin.put<Project>(`/projects/${project.id}`, payload);
      } else {
        saved = await admin.post<Project>("/projects", payload);
      }
      // sync newly added media (those without ids) to the saved project
      for (const m of media.filter((x) => !x.id)) {
        await admin.post(`/projects/${saved.id}/media`, {
          kind: m.kind,
          url: m.url,
          url_secondary: m.url_secondary,
          caption: m.caption || {},
          order: m.order || 0,
        });
      }
      toast("Project saved");
      onSaved();
    } catch (e: any) {
      toast(e.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  function addMedia(kind: ProjectMedia["kind"]) {
    setMedia((prev) => [
      ...prev,
      { id: 0, kind, url: "", url_secondary: "", caption: {}, order: prev.length } as ProjectMedia,
    ]);
  }

  async function removeMedia(idx: number) {
    const m = media[idx];
    if (m.id) await admin.del(`/projects/media/${m.id}`).catch(() => {});
    setMedia((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="max-w-4xl pb-24">
      <PageTitle
        title={project ? "Edit project" : "New project"}
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Card>
          <div className="space-y-5">
            <MultiLang label="Title" value={p.title || {}} onChange={(v) => set("title", v)} />
            <MultiLang label="Subtitle" value={p.subtitle || {}} onChange={(v) => set("subtitle", v)} />
            <MultiLang label="Description" value={p.description || {}} onChange={(v) => set("description", v)} textarea />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Slug (URL)">
                <Input value={p.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />
              </Field>
              <Field label="Category">
                <Select
                  value={p.category_id ?? p.category?.id ?? ""}
                  onChange={(e) => set("category_id", e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">— none —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name.en}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Details</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Location"><Input value={p.location || ""} onChange={(e) => set("location", e.target.value)} /></Field>
            <Field label="Client"><Input value={p.client_name || ""} onChange={(e) => set("client_name", e.target.value)} /></Field>
            <Field label="Year"><Input type="number" value={p.year || ""} onChange={(e) => set("year", e.target.value)} /></Field>
            <Field label="Area (m²)"><Input type="number" value={p.area_sqm || ""} onChange={(e) => set("area_sqm", e.target.value)} /></Field>
          </div>
          <div className="mt-5 flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!p.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!p.is_published} onChange={(e) => set("is_published", e.target.checked)} /> Published
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Imagery</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <MediaPicker label="Cover image" value={p.cover_url || ""} onChange={(v) => set("cover_url", v)} />
            <MediaPicker label="Hero image" value={p.hero_url || ""} onChange={(v) => set("hero_url", v)} />
            <MediaPicker label="Project video" value={p.video_url || ""} onChange={(v) => set("video_url", v)} accept="video/*" />
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl text-ink">Gallery</h2>
            <div className="flex gap-2">
              <Button variant="ghost" type="button" onClick={() => addMedia("image")}>+ Image</Button>
              <Button variant="ghost" type="button" onClick={() => addMedia("video")}>+ Video</Button>
              <Button variant="ghost" type="button" onClick={() => addMedia("before_after")}>+ Before/After</Button>
            </div>
          </div>
          <div className="space-y-4">
            {media.map((m, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-lg border border-line p-3 md:flex-row md:items-end">
                <span className="self-start rounded bg-surface px-2 py-1 text-[10px] uppercase text-ink/50 md:mb-3">{m.kind}</span>
                <div className="flex-1">
                  <MediaPicker
                    label={m.kind === "before_after" ? "Before" : "Media URL"}
                    value={m.url}
                    accept={m.kind === "video" ? "video/*" : "image/*"}
                    onChange={(url) => setMedia((prev) => prev.map((x, idx) => (idx === i ? { ...x, url } : x)))}
                  />
                </div>
                {m.kind === "before_after" && (
                  <div className="flex-1">
                    <MediaPicker
                      label="After"
                      value={m.url_secondary}
                      onChange={(url) => setMedia((prev) => prev.map((x, idx) => (idx === i ? { ...x, url_secondary: url } : x)))}
                    />
                  </div>
                )}
                <Button variant="danger" type="button" onClick={() => removeMedia(i)}>✕</Button>
              </div>
            ))}
            {media.length === 0 && <p className="text-sm text-ink/40">No gallery items yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
