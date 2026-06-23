import type {
  Award,
  BlogPost,
  Category,
  Client,
  JobPosting,
  Project,
  Service,
  SiteSettings,
  TeamMember,
} from "./types";

// Server components call the backend directly; the browser uses the Next rewrite.
const SERVER_BASE = process.env.BACKEND_INTERNAL_URL || "http://localhost:8000";
const isServer = typeof window === "undefined";

function base() {
  return isServer ? `${SERVER_BASE}/api/v1` : "/api/v1";
}

async function get<T>(path: string, fallback: T, revalidate = 10): Promise<T> {
  try {
    const res = await fetch(`${base()}${path}`, {
      next: { revalidate },
    } as RequestInit);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const api = {
  settings: () =>
    get<SiteSettings | null>("/settings", null, 5),
  projects: (params?: { category?: string; featured?: boolean; q?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.featured !== undefined) qs.set("featured", String(params.featured));
    if (params?.q) qs.set("q", params.q);
    const suffix = qs.toString() ? `?${qs}` : "";
    return get<Project[]>(`/projects${suffix}`, []);
  },
  project: (slug: string) => get<Project | null>(`/projects/${slug}`, null),
  categories: () => get<Category[]>("/projects/categories", []),
  team: () => get<TeamMember[]>("/team", []),
  services: () => get<Service[]>("/services", []),
  awards: () => get<Award[]>("/awards", []),
  clients: () => get<Client[]>("/clients", []),
  blog: () => get<BlogPost[]>("/blog", []),
  post: (slug: string) => get<BlogPost | null>(`/blog/${slug}`, null),
  jobs: () => get<JobPosting[]>("/careers", []),
  job: (slug: string) => get<JobPosting | null>(`/careers/${slug}`, null),
};
