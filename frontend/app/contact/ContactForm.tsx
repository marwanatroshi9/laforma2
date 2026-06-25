"use client";

import { useState } from "react";
import { useSite } from "@/providers/SiteProvider";

type Status = "idle" | "loading" | "ok" | "error";

export default function ContactForm() {
  const { t } = useSite();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full border-b border-line bg-transparent py-4 text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <input name="full_name" required placeholder={`${t("form.fullName")} *`} aria-label={t("form.fullName")} className={field} />
        <input name="email" type="email" required placeholder={`${t("form.email")} *`} aria-label={t("form.email")} className={field} />
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <input name="phone" placeholder={t("form.phone")} aria-label={t("form.phone")} className={field} />
        <input name="subject" placeholder={t("form.subject")} aria-label={t("form.subject")} className={field} />
      </div>
      <textarea name="message" required rows={5} placeholder={`${t("form.projectMessage")} *`} aria-label={t("form.projectMessage")} className={field} />

      <button
        type="submit"
        disabled={status === "loading"}
        className="group relative overflow-hidden border border-line px-10 py-5 label text-ink disabled:opacity-50"
      >
        <span className="relative z-10 transition-colors group-hover:text-black">
          {status === "loading" ? t("common.loading") : t("cta.contact")}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
      </button>

      {status === "ok" && <p className="text-accent">{t("form.thanksContact")}</p>}
      {status === "error" && <p className="text-red-400">{t("form.error")}</p>}
    </form>
  );
}
