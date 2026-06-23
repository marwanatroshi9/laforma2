import { api } from "@/lib/api";
import ProjectsClient from "./ProjectsClient";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([api.projects(), api.categories()]);
  return <ProjectsClient projects={projects} categories={categories} />;
}
