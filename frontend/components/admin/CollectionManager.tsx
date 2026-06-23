"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin";
import {
  Button,
  Card,
  Field,
  Input,
  MediaPicker,
  MultiLang,
  PageTitle,
  useToast,
} from "@/components/admin/ui";

export type FieldType = "text" | "number" | "multilang" | "multilangText" | "media" | "video" | "checkbox" | "social";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  preview?: boolean; // show in the list row
}

export default function CollectionManager({
  title,
  endpoint,
  fields,
  titleKey,
  imageKey,
}: {
  title: string;
  endpoint: string; // e.g. "/team"
  fields: FieldDef[];
  titleKey: string; // field used as the row heading
  imageKey?: string;
}) {
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [draft, setDraft] = useState<any | null>(null);

  async function load() {
    setItems(await admin.get<any[]>(`${endpoint}?include_unpublished=true`).catch(() => admin.get<any[]>(endpoint)));
  }
  useEffect(() => {
    load();
  }, [endpoint]);

  function newDraft() {
    const base: any = {};
    fields.forEach((f) => {
      base[f.key] =
        f.type === "multilang" || f.type === "multilangText"
          ? {}
          : f.type === "checkbox"
          ? true
          : f.type === "social"
          ? []
          : f.type === "number"
          ? 0
          : "";
    });
    setDraft(base);
  }

  async function save() {
    if (!draft) return;
    try {
      const payload = { ...draft };
      fields.forEach((f) => {
        if (f.type === "number") payload[f.key] = Number(payload[f.key]) || 0;
      });
      if (draft.id) await admin.put(`${endpoint}/${draft.id}`, payload);
      else await admin.post(endpoint, payload);
      toast("Saved");
      setDraft(null);
      load();
    } catch (e: any) {
      toast(e.message || "Save failed", "error");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this item?")) return;
    await admin.del(`${endpoint}/${id}`);
    toast("Deleted");
    load();
  }

  function setField(key: string, value: any) {
    setDraft((prev: any) => ({ ...prev, [key]: value }));
  }

  if (draft) {
    return (
      <div className="max-w-3xl pb-24">
        <PageTitle
          title={draft.id ? `Edit ${title}` : `New ${title}`}
          action={
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          }
        />
        <Card>
          <div className="space-y-5">
            {fields.map((f) => {
              const v = draft[f.key];
              if (f.type === "multilang") return <MultiLang key={f.key} label={f.label} value={v || {}} onChange={(x) => setField(f.key, x)} />;
              if (f.type === "multilangText") return <MultiLang key={f.key} label={f.label} value={v || {}} onChange={(x) => setField(f.key, x)} textarea />;
              if (f.type === "media") return <MediaPicker key={f.key} label={f.label} value={v || ""} onChange={(x) => setField(f.key, x)} />;
              if (f.type === "video") return <MediaPicker key={f.key} label={f.label} value={v || ""} onChange={(x) => setField(f.key, x)} accept="video/*" />;
              if (f.type === "checkbox")
                return (
                  <label key={f.key} className="flex items-center gap-2 text-sm text-ink">
                    <input type="checkbox" checked={!!v} onChange={(e) => setField(f.key, e.target.checked)} /> {f.label}
                  </label>
                );
              if (f.type === "social") return <SocialEditor key={f.key} label={f.label} value={v || []} onChange={(x) => setField(f.key, x)} />;
              return (
                <Field key={f.key} label={f.label}>
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    value={v ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                </Field>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title={title} subtitle={`${items.length} items`} action={<Button onClick={newDraft}>+ New</Button>} />
      <div className="space-y-3">
        {items.map((it) => (
          <Card key={it.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {imageKey && it[imageKey] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it[imageKey]} alt="" className="h-14 w-14 shrink-0 rounded object-cover" />
              )}
              <div className="min-w-0">
                <div className="truncate font-medium text-ink">
                  {typeof it[titleKey] === "object" ? it[titleKey]?.en : it[titleKey]}
                </div>
                <div className="truncate text-xs text-ink/40">
                  {fields
                    .filter((f) => f.preview)
                    .map((f) => (typeof it[f.key] === "object" ? it[f.key]?.en : it[f.key]))
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" onClick={() => setDraft({ ...it })} className="flex-1 sm:flex-none">Edit</Button>
              <Button variant="danger" onClick={() => remove(it.id)} className="flex-1 sm:flex-none">Delete</Button>
            </div>
          </Card>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/40">Nothing here yet.</p>}
      </div>
    </div>
  );
}

function SocialEditor({ label, value, onChange }: { label: string; value: any[]; onChange: (v: any[]) => void }) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {value.map((item: any, i: number) => (
          <div key={i} className="flex flex-wrap gap-2 sm:flex-nowrap">
            <Input placeholder="platform" value={item.platform} onChange={(e) => { const n = [...value]; n[i] = { ...n[i], platform: e.target.value }; onChange(n); }} className="w-full sm:max-w-[160px]" />
            <div className="flex flex-1 gap-2">
              <Input placeholder="https://…" value={item.url} onChange={(e) => { const n = [...value]; n[i] = { ...n[i], url: e.target.value }; onChange(n); }} />
              <Button variant="danger" type="button" onClick={() => onChange(value.filter((_, x) => x !== i))}>✕</Button>
            </div>
          </div>
        ))}
        <Button variant="ghost" type="button" onClick={() => onChange([...value, { platform: "", url: "" }])}>+ Add link</Button>
      </div>
    </Field>
  );
}
