import type { MetadataRoute } from "next";
import { api } from "@/lib/api";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, jobs] = await Promise.all([api.projects(), api.blog(), api.jobs()]);
  const staticPaths = [
    "",
    "/projects",
    "/about",
    "/team",
    "/services",
    "/awards",
    "/blog",
    "/careers",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${SITE}${p}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: `${SITE}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...jobs.map((j) => ({
      url: `${SITE}/careers/${j.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
