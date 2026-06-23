"use client";

import Link from "next/link";
import { useState } from "react";
import type { JobPosting } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function JobDetail({ job }: { job: JobPosting }) {
  const { locale, t } = useSite();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/v1/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, job_id: job.id }),
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
    <div className="px-6 pb-32 pt-36 md:px-12 md:pt-48">
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-2">
        <div>
          <Link href="/careers" className="label text-ink/50 hover:text-accent">← All positions</Link>
          <h1 className="mt-6 font-heading text-5xl leading-tight text-ink md:text-7xl">
            {pick(job.title, locale)}
          </h1>
          <p className="mt-4 label text-accent">
            {job.location} · <span className="capitalize">{job.employment_type}</span>
          </p>
          <p className="mt-8 max-w-xl leading-relaxed text-ink/70">{pick(job.description, locale)}</p>
        </div>

        <div className="lg:pt-16">
          <h2 className="mb-8 font-heading text-3xl text-ink">Apply now</h2>
          <form onSubmit={onSubmit} className="space-y-7">
            <input name="full_name" required placeholder="Full name *" aria-label="Full name" className={field} />
            <input name="email" type="email" required placeholder="Email *" aria-label="Email" className={field} />
            <input name="phone" placeholder="Phone" aria-label="Phone" className={field} />
            <input name="cv_url" placeholder="Link to CV / portfolio" aria-label="Link to CV or portfolio" className={field} />
            <textarea name="message" rows={4} placeholder="Cover note" aria-label="Cover note" className={field} />
            <button
              type="submit"
              disabled={status === "loading"}
              className="group relative overflow-hidden border border-line px-10 py-5 label text-ink disabled:opacity-50"
            >
              <span className="relative z-10 transition-colors group-hover:text-black">
                {status === "loading" ? t("common.loading") : "Submit application"}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
            </button>
            {status === "ok" && <p className="text-accent">Thank you — we received your application.</p>}
            {status === "error" && <p className="text-red-400">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
