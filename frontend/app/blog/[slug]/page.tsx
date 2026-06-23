import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { pick } from "@/lib/i18n";
import ArticleBody from "./ArticleBody";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await api.post(slug);
  if (!post) return { title: "Article" };
  return {
    title: pick(post.title, "en"),
    description: pick(post.excerpt, "en"),
    openGraph: { images: post.cover_url ? [post.cover_url] : [], type: "article" },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await api.post(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pick(post.title, "en"),
    description: pick(post.excerpt, "en"),
    image: post.cover_url || undefined,
    author: { "@type": "Person", name: post.author || "Studio" },
    datePublished: post.published_at,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleBody post={post} />
    </>
  );
}
