"use client";

import { useEffect, useRef, useState } from "react";
import { admin } from "@/lib/admin";
import { Button, Card, PageTitle, useToast } from "@/components/admin/ui";

interface Asset {
  id: number;
  url: string;
  kind: string;
  filename: string;
  width?: number;
  height?: number;
}

export default function MediaLibrary() {
  const toast = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setAssets(await admin.get<Asset[]>("/media").catch(() => []));
  }
  useEffect(() => {
    load();
  }, []);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        await admin.upload(f);
      }
      toast("Upload complete");
      load();
    } catch (e: any) {
      toast(e.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    await admin.del(`/media/${id}`);
    load();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    toast("URL copied");
  }

  return (
    <div>
      <PageTitle title="Media Library" subtitle="Drag & drop to upload images and videos" />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mb-8 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed py-16 text-center transition ${
          dragging ? "border-accent bg-accent/5" : "border-line"
        }`}
      >
        <p className="text-ink/60">{uploading ? "Uploading…" : "Drop files here or click to browse"}</p>
        <p className="mt-1 text-xs text-ink/40">JPG · PNG · WEBP · SVG · MP4 · WEBM</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {assets.map((a) => (
          <Card key={a.id} className="p-0 overflow-hidden">
            <div className="aspect-square bg-surface">
              {a.kind === "video" ? (
                <video src={a.url} className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt={a.filename} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-2">
              <p className="truncate text-[11px] text-ink/50">{a.filename}</p>
              <div className="mt-2 flex gap-1">
                <Button variant="ghost" onClick={() => copy(a.url)} className="flex-1 px-2 py-1 text-xs">Copy URL</Button>
                <Button variant="danger" onClick={() => remove(a.id)} className="px-2 py-1 text-xs">✕</Button>
              </div>
            </div>
          </Card>
        ))}
        {assets.length === 0 && <p className="col-span-full text-sm text-ink/40">No media uploaded yet.</p>}
      </div>
    </div>
  );
}
