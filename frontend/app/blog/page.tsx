import { api } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import BlogGrid from "./BlogGrid";

export const metadata = { title: "Journal" };

export default async function BlogPage() {
  const posts = await api.blog();
  return (
    <div className="pb-32">
      <PageHeader label="Journal" title="Thoughts on space & craft." />
      <BlogGrid posts={posts} />
    </div>
  );
}
