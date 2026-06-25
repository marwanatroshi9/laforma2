import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import BlogGrid from "./BlogGrid";

export const metadata = { title: "Journal" };

export default async function BlogPage() {
  const posts = await api.blog();
  return (
    <div className="pb-32">
      <PageHeader label="page.journal.label" title="page.journal.title" />
      <BlogGrid posts={posts} />
    </div>
  );
}
