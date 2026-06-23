"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { admin } from "@/lib/admin";
import type { Locale } from "@/lib/types";

export const ADMIN_LOCALES: Locale[] = ["en", "ar", "kmr"];
const LOCALE_LABEL: Record<Locale, string> = { en: "EN", ar: "AR", kmr: "KMR" };

const inputBase =
  "w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent";

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink/60">{children}</label>;
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className || ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} ${props.className || ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className || ""}`} />;
}

/** Multilingual text input — one box per locale, value is {en,ar,kmr}. */
export function MultiLang({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  textarea?: boolean;
}) {
  const [active, setActive] = useState<Locale>("en");
  const Comp: any = textarea ? Textarea : Input;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1">
          {ADMIN_LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActive(l)}
              className={`rounded px-2 py-0.5 text-[10px] font-semibold tracking-wider ${
                active === l ? "bg-accent text-black" : "bg-surface-2 text-ink/50"
              }`}
            >
              {LOCALE_LABEL[l]}
            </button>
          ))}
        </div>
      </div>
      <Comp
        dir={active === "ar" ? "rtl" : "ltr"}
        value={value?.[active] || ""}
        onChange={(e: any) => onChange({ ...value, [active]: e.target.value })}
        rows={textarea ? 3 : undefined}
      />
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-line bg-transparent"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

/** Upload an image/video and store the resulting URL. */
export function MediaPicker({
  label,
  value,
  onChange,
  accept = "image/*",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await admin.upload(file);
      onChange(url);
      toast("Uploaded");
    } catch (err: any) {
      toast(err.message || "Upload failed", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        {value ? (
          accept.includes("video") ? (
            <video src={value} className="h-16 w-24 rounded border border-line object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-16 w-16 rounded border border-line object-cover" />
          )
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded border border-dashed border-line text-xs text-ink/40">
            None
          </div>
        )}
        <div className="flex-1">
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL or upload →" />
          <label className="mt-2 inline-block cursor-pointer text-xs text-accent hover:underline">
            {busy ? "Uploading…" : "Upload file"}
            <input type="file" accept={accept} onChange={onFile} className="hidden" />
          </label>
        </div>
      </div>
    </Field>
  );
}

export function Button({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  const styles = {
    primary: "bg-accent text-black hover:opacity-90",
    ghost: "border border-line text-ink hover:border-accent",
    danger: "border border-red-500/40 text-red-400 hover:bg-red-500/10",
  }[variant];
  return (
    <button
      {...props}
      className={`rounded-md px-5 py-2.5 text-sm font-medium transition disabled:opacity-50 ${styles} ${props.className || ""}`}
    />
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface-2 p-6 ${className}`}>{children}</div>;
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        <h1 className="font-heading text-2xl text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---- Toast ---- */
type ToastFn = (msg: string, kind?: "ok" | "error") => void;
const ToastCtx = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string; kind: string }[]>([]);
  const push = useCallback<ToastFn>((msg, kind = "ok") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, msg, kind }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 end-6 z-[200] flex flex-col gap-2">
        {items.map((i) => (
          <div
            key={i.id}
            className={`rounded-md px-4 py-3 text-sm shadow-lg ${
              i.kind === "error" ? "bg-red-500 text-white" : "bg-accent text-black"
            }`}
          >
            {i.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
