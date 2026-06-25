"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const { locale, t } = useSite();
  if (!posts.length)
    return <p className="px-6 py-20 text-center text-ink/50 md:px-12">{t("blog.noArticles")}</p>;

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
          >
            <Link href={`/blog/${p.slug}`} className="group block">
              <div className="media-zoom relative aspect-[4/3] overflow-hidden bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover_url} alt={pick(p.title, locale)} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="mt-5">
                <span className="label text-accent">
                  {new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
                </span>
                <h3 className="mt-2 font-heading text-2xl text-ink transition-colors group-hover:text-accent">
                  {pick(p.title, locale)}
                </h3>
                <p className="mt-2 text-sm text-ink/60">{pick(p.excerpt, locale)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
