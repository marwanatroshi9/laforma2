import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { pick } from "@/lib/i18n";
import ProjectDetail from "./ProjectDetail";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await api.project(slug);
  if (!project) return { title: "Project" };
  return {
    title: pick(project.title, "en"),
    description: pick(project.description, "en"),
    openGraph: { images: project.cover_url ? [project.cover_url] : [] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await api.project(slug);
  if (!project) notFound();

  const all = await api.projects(
    project.category ? { category: project.category.slug } : undefined
  );
  const related = all.filter((p) => p.id !== project.id);

  return <ProjectDetail project={project} related={related} />;
}
