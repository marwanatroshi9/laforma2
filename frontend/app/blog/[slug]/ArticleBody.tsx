"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { useSite } from "@/providers/SiteProvider";
import { pick } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function ArticleBody({ post }: { post: BlogPost }) {
  const { locale } = useSite();
  const body = pick(post.body, locale);

  return (
    <article className="pb-32">
      <div className="relative h-[60svh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.cover_url} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-12 md:px-12">
          <span className="label text-white/70">
            {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: "long" })}
            {post.author ? ` · ${post.author}` : ""}
          </span>
          <h1 className="mt-3 font-heading text-4xl leading-tight text-white md:text-6xl">
            {pick(post.title, locale)}
          </h1>
        </div>
      </div>

      <Reveal className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        <div className="space-y-6 text-lg leading-relaxed text-ink/80">
          {body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {post.tags?.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="label rounded-full border border-line px-4 py-1.5 text-ink/60">
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link href="/blog" className="label mt-12 inline-block text-ink/60 hover:text-accent">
          ← Back to journal
        </Link>
      </Reveal>
    </article>
  );
}
