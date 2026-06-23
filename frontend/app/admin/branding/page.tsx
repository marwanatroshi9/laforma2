"use client";

import { useEffect, useState } from "react";
import type { SiteSettings, Locale } from "@/lib/types";
import { admin } from "@/lib/admin";
import {
  ADMIN_LOCALES,
  Button,
  Card,
  ColorField,
  Field,
  Input,
  MediaPicker,
  MultiLang,
  PageTitle,
  Select,
  useToast,
} from "@/components/admin/ui";

const FONTS = [
  "Cormorant Garamond",
  "Playfair Display",
  "Inter",
  "Poppins",
  "Montserrat",
  "Libre Baskerville",
  "Marcellus",
  "Jost",
  "Syne",
];

export default function BrandingPage() {
  const toast = useToast();
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    admin.get<SiteSettings>("/settings").then(setS);
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setS((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!s) return;
    setSaving(true);
    try {
      await admin.put("/settings", s);
      toast("Settings saved — refresh the site to see changes");
    } catch (e: any) {
      toast(e.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  function toggleLocale(l: Locale) {
    if (!s) return;
    const has = s.enabled_locales.includes(l);
    set(
      "enabled_locales",
      has ? s.enabled_locales.filter((x) => x !== l) : [...s.enabled_locales, l]
    );
  }

  if (!s) return <p className="text-ink/50">Loading…</p>;

  return (
    <div className="max-w-4xl pb-24">
      <PageTitle
        title="Branding & Theme"
        subtitle="Everything here updates the live website — no code required"
        action={<Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>}
      />

      <div className="space-y-6">
        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Identity</h2>
          <div className="space-y-5">
            <MultiLang label="Company name" value={s.company_name} onChange={(v) => set("company_name", v)} />
            <MultiLang label="Tagline" value={s.tagline} onChange={(v) => set("tagline", v)} textarea />
            <div className="grid gap-5 md:grid-cols-3">
              <MediaPicker label="Logo" value={s.logo_url} onChange={(v) => set("logo_url", v)} />
              <MediaPicker label="Logo (dark bg)" value={s.logo_dark_url} onChange={(v) => set("logo_dark_url", v)} />
              <MediaPicker label="Favicon" value={s.favicon_url} onChange={(v) => set("favicon_url", v)} />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Colors & Theme</h2>
          <div className="grid gap-5 md:grid-cols-3">
            <ColorField label="Accent" value={s.color_accent} onChange={(v) => set("color_accent", v)} />
            <ColorField label="Background (light)" value={s.color_bg_light} onChange={(v) => set("color_bg_light", v)} />
            <ColorField label="Background (dark)" value={s.color_bg_dark} onChange={(v) => set("color_bg_dark", v)} />
            <ColorField label="Text (light)" value={s.color_text_light} onChange={(v) => set("color_text_light", v)} />
            <ColorField label="Text (dark)" value={s.color_text_dark} onChange={(v) => set("color_text_dark", v)} />
            <Field label="Default theme">
              <Select value={s.default_theme} onChange={(e) => set("default_theme", e.target.value as any)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Typography</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Heading font (Google Fonts)">
              <Select value={s.font_heading} onChange={(e) => set("font_heading", e.target.value)}>
                {FONTS.map((f) => <option key={f}>{f}</option>)}
              </Select>
            </Field>
            <Field label="Body font (Google Fonts)">
              <Select value={s.font_body} onChange={(e) => set("font_body", e.target.value)}>
                {FONTS.map((f) => <option key={f}>{f}</option>)}
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Languages</h2>
          <div className="flex flex-wrap gap-3">
            {ADMIN_LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLocale(l)}
                className={`rounded-md border px-4 py-2 text-sm ${
                  s.enabled_locales.includes(l)
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-line text-ink/50"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-5 max-w-xs">
            <Field label="Default language">
              <Select value={s.default_locale} onChange={(e) => set("default_locale", e.target.value as any)}>
                {s.enabled_locales.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </Select>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Hero (Homepage)</h2>
          <div className="space-y-5">
            <MultiLang label="Hero title" value={s.hero_title} onChange={(v) => set("hero_title", v)} />
            <MultiLang label="Hero subtitle" value={s.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} textarea />
            <div className="grid gap-5 md:grid-cols-2">
              <MediaPicker label="Hero video" value={s.hero_video_url} onChange={(v) => set("hero_video_url", v)} accept="video/*" />
              <MediaPicker label="Hero poster image" value={s.hero_poster_url} onChange={(v) => set("hero_poster_url", v)} />
            </div>
            <p className="text-xs text-ink/40">
              Tip: keep hero videos small (ideally under ~25&nbsp;MB, muted, 1080p) for fast loading. The poster image
              shows while the video loads, or if no video is set.
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Homepage — “The Studio” &amp; Stats</h2>
          <div className="space-y-6">
            <MultiLang
              label="About paragraph"
              value={s.content?.about || {}}
              onChange={(v) => set("content", { ...(s.content || {}), about: v })}
              textarea
            />
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-ink/60">Stats</span>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() =>
                    set("content", {
                      ...(s.content || {}),
                      stats: [...(s.content?.stats || []), { value: "", label: {} }],
                    })
                  }
                >
                  + Add stat
                </Button>
              </div>
              <div className="space-y-3">
                {(s.content?.stats || []).map((stat: any, i: number) => (
                  <div key={i} className="flex flex-col gap-3 rounded-lg border border-line p-3 sm:flex-row sm:items-end">
                    <div className="w-full sm:w-28 sm:shrink-0">
                      <Input
                        placeholder="180+"
                        value={stat.value || ""}
                        onChange={(e) => {
                          const stats = [...(s.content?.stats || [])];
                          stats[i] = { ...stats[i], value: e.target.value };
                          set("content", { ...(s.content || {}), stats });
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <MultiLang
                        label="Label"
                        value={stat.label || {}}
                        onChange={(v) => {
                          const stats = [...(s.content?.stats || [])];
                          stats[i] = { ...stats[i], label: v };
                          set("content", { ...(s.content || {}), stats });
                        }}
                      />
                    </div>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => {
                        const stats = (s.content?.stats || []).filter((_: any, x: number) => x !== i);
                        set("content", { ...(s.content || {}), stats });
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                {(!s.content?.stats || s.content.stats.length === 0) && (
                  <p className="text-sm text-ink/40">No stats yet — add a few (e.g. 180+ Projects).</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">Contact & Social</h2>
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Email"><Input value={s.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Phone"><Input value={s.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            </div>
            <MultiLang label="Address" value={s.address} onChange={(v) => set("address", v)} />
            <SocialEditor value={s.social_links} onChange={(v) => set("social_links", v)} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-5 font-heading text-xl text-ink">SEO</h2>
          <div className="space-y-5">
            <MultiLang label="SEO title" value={s.seo_title} onChange={(v) => set("seo_title", v)} />
            <MultiLang label="SEO description" value={s.seo_description} onChange={(v) => set("seo_description", v)} textarea />
            <Field label="Keywords (comma separated)">
              <Input value={s.seo_keywords} onChange={(e) => set("seo_keywords", e.target.value)} />
            </Field>
            <MediaPicker label="Open Graph image" value={s.og_image_url} onChange={(v) => set("og_image_url", v)} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </div>
    </div>
  );
}

function SocialEditor({
  value,
  onChange,
}: {
  value: { platform: string; url: string }[];
  onChange: (v: { platform: string; url: string }[]) => void;
}) {
  return (
    <Field label="Social links">
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="flex flex-wrap gap-2 sm:flex-nowrap">
            <Input
              placeholder="platform"
              value={item.platform}
              onChange={(e) => {
                const next = [...value];
                next[i] = { ...next[i], platform: e.target.value };
                onChange(next);
              }}
              className="w-full sm:max-w-[160px]"
            />
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="https://…"
                value={item.url}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = { ...next[i], url: e.target.value };
                  onChange(next);
                }}
              />
              <Button variant="danger" type="button" onClick={() => onChange(value.filter((_, x) => x !== i))}>
                ✕
              </Button>
            </div>
          </div>
        ))}
        <Button variant="ghost" type="button" onClick={() => onChange([...value, { platform: "", url: "" }])}>
          + Add social link
        </Button>
      </div>
    </Field>
  );
}
